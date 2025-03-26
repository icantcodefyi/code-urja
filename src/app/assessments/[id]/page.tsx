'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Clock, Video, AudioLines, AlignLeft } from "lucide-react";
import VideoRecorder from "~/components/VideoRecorder";
import AudioRecorder from "~/components/AudioRecorder";
import ResumeUploader from "~/components/ResumeUploader";
import { toast } from "sonner";

// Type definitions
interface Assessment {
  id: string;
  title: string;
  description: string | null;
  questions: Question[];
  maxDuration: number | null;
}

interface Question {
  id: string;
  text: string;
  type: 'VIDEO' | 'AUDIO' | 'TEXT';
  order: number;
}

interface Response {
  type: 'VIDEO' | 'AUDIO' | 'TEXT';
  content: string;
  questionId: string;
  questionText: string;
}

interface AnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skillMatch: number;
  communicationScore: number;
  technicalScore: number;
  overallScore: number;
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'CONSIDER' | 'REJECT';
  feedbackPoints: string[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
  candidateDetails?: {
    name: string;
    email: string;
    resumeUrl: string;
    resumeText: string;
  };
  processedResponses?: Array<{
    type: 'VIDEO' | 'AUDIO' | 'TEXT';
    content: string;
    questionId: string;
    questionText: string;
    transcription: string;
  }>;
  analysis?: AnalysisResult;
}

enum AssessmentStep {
  LOADING,
  ERROR,
  CANDIDATE_INFO,
  INSTRUCTIONS,
  ASSESSMENT,
  COMPLETED
}

export default function AssessmentPage() {
  const params = useParams();
  const assessmentId = params.id as string;
  
  const [step, setStep] = useState<AssessmentStep>(AssessmentStep.LOADING);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Candidate info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  
  // Current question state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Analysis results
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // Fetch assessment data
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${assessmentId}`);
        
        if (!response.ok) {
          throw new Error('Assessment not found or no longer available');
        }
        
        const data = await response.json() as { assessment: Assessment };
        setAssessment(data.assessment);
        setStep(AssessmentStep.CANDIDATE_INFO);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment');
        setStep(AssessmentStep.ERROR);
      } finally {
        setLoading(false);
      }
    };
    
    void fetchAssessment();
  }, [assessmentId]);

  // Handle candidate info submission
  const handleCandidateInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate resume
    if (!resumeUrl) {
      toast("Please upload your resume to continue.", {
        description: "Your resume is required to proceed with the assessment.",
      });
      return;
    }
    
    // Proceed to instructions
    setStep(AssessmentStep.INSTRUCTIONS);
  };
  
  // Handle resume upload
  const handleResumeUpload = (fileUrl: string) => {
    setResumeUrl(fileUrl);
  };
  
  // Handle resume upload error
  const handleResumeUploadError = (error: Error) => {
    console.error('Resume upload error:', error);
    alert(`Failed to upload resume: ${error.message}`);
  };
  
  // Start the assessment
  const startAssessment = () => {
    setStep(AssessmentStep.ASSESSMENT);
  };
  
  // Submit the assessment
  const submitAssessment = async () => {
    if (!assessment) return;
    
    // Check if all questions have responses
    const unansweredQuestions = assessment.questions.filter(
      question => !responses[question.id]
    );
    
    if (unansweredQuestions.length > 0) {
      const confirm = window.confirm(
        `You have ${unansweredQuestions.length} unanswered question(s). Do you want to continue without answering them?`
      );
      
      if (!confirm) return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId: assessment.id,
          candidateName: name,
          candidateEmail: email,
          resumeUrl,
          responses,
        }),
      });
      
      const data = await response.json() as ApiResponse;
      
      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to submit assessment');
      }

      // Display toast notification about transcription
      toast.success("Assessment submitted", {
        description: "Your responses are being processed and transcribed. This might take a moment.",
      });
      
      // Store analysis result if available
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
      
      // Move to completed step
      setStep(AssessmentStep.COMPLETED);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit assessment');
      console.error('Error submitting assessment:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle moving to the next question
  const nextQuestion = () => {
    if (!assessment) return;
    
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // When reaching the last question, submit the assessment
      void submitAssessment();
    }
  };
  
  // Handle text response change
  const handleTextResponseChange = (questionId: string, text: string, questionText: string) => {
    setResponses({
      ...responses,
      [questionId]: {
        type: 'TEXT',
        content: text,
        questionId,
        questionText
      }
    });
  };
  
  // Handle video recording complete
  const handleVideoRecordingComplete = (questionId: string, videoUrl: string, questionText: string) => {
    setResponses({
      ...responses,
      [questionId]: {
        type: 'VIDEO',
        content: videoUrl,
        questionId,
        questionText
      }
    });
  };
  
  // Handle audio recording complete
  const handleAudioRecordingComplete = (questionId: string, audioUrl: string, questionText: string) => {
    setResponses({
      ...responses,
      [questionId]: {
        type: 'AUDIO',
        content: audioUrl,
        questionId,
        questionText
      }
    });
  };
  
  // Render question based on type
  const renderQuestion = (question: Question) => {
    const response = responses[question.id];
    
    switch (question.type) {
      case 'VIDEO':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Video Response</h3>
            </div>
            <p className="mb-4">{question.text}</p>
            
            {response ? (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Video recorded successfully!
                </p>
                <video 
                  className="w-full rounded-md"
                  src={response.content} 
                  controls 
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Remove the response to allow re-recording
                      const newResponses = { ...responses };
                      delete newResponses[question.id];
                      setResponses(newResponses);
                    }}
                  >
                    Record Again
                  </Button>
                </div>
              </div>
            ) : (
              <VideoRecorder 
                onRecordingComplete={(videoUrl) => 
                  handleVideoRecordingComplete(question.id, videoUrl, question.text)
                }
                onError={(err) => console.error("Video recording error:", err)}
                maxDuration={assessment?.maxDuration ? assessment.maxDuration * 60 : 120}
              />
            )}
          </div>
        );
      case 'AUDIO':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AudioLines className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Audio Response</h3>
            </div>
            <p className="mb-4">{question.text}</p>
            
            {response ? (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Audio recorded successfully!
                </p>
                <audio 
                  className="w-full" 
                  src={response.content} 
                  controls 
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Remove the response to allow re-recording
                      const newResponses = { ...responses };
                      delete newResponses[question.id];
                      setResponses(newResponses);
                    }}
                  >
                    Record Again
                  </Button>
                </div>
              </div>
            ) : (
              <AudioRecorder 
                onRecordingComplete={(audioUrl) => 
                  handleAudioRecordingComplete(question.id, audioUrl, question.text)
                }
                onError={(err) => console.error("Audio recording error:", err)}
                maxDuration={assessment?.maxDuration ? assessment.maxDuration * 60 : 120}
              />
            )}
          </div>
        );
      case 'TEXT':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlignLeft className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Text Response</h3>
            </div>
            <p className="mb-4">{question.text}</p>
            <Textarea
              placeholder="Type your answer here..."
              rows={6}
              value={response?.content ?? ''}
              onChange={(e) => handleTextResponseChange(question.id, e.target.value, question.text)}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  // Render the appropriate UI based on current step
  if (step === AssessmentStep.LOADING) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[80vh] flex justify-center items-center">
        <p>Loading assessment...</p>
      </div>
    );
  }
  
  if (step === AssessmentStep.ERROR) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Please contact the assessment administrator.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  if (step === AssessmentStep.CANDIDATE_INFO) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to the Assessment</CardTitle>
              <CardDescription>
                Please provide your information before starting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="candidateInfoForm" onSubmit={handleCandidateInfoSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Resume/CV</Label>
                  <ResumeUploader
                    onUploadComplete={handleResumeUpload}
                    onUploadError={handleResumeUploadError}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="candidateInfoForm" 
                className="w-full"
                disabled={!resumeUrl}
              >
                Continue to Assessment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  if (step === AssessmentStep.INSTRUCTIONS) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center">
          <Card>
            <CardHeader>
              <CardTitle>{assessment?.title}</CardTitle>
              <CardDescription>
                Instructions and overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{assessment?.description}</p>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Assessment Details:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{assessment?.maxDuration} minutes maximum duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                    <span>{assessment?.questions.length} questions in total</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-md">
                <h3 className="font-medium mb-2">Important:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Please ensure you have a stable internet connection</li>
                  <li>Allow access to your camera and microphone when prompted</li>
                  <li>Complete the assessment in a quiet environment</li>
                  <li>Once started, try to complete the assessment in one sitting</li>
                  <li>For video and audio recordings, you&apos;ll have a chance to review before submitting</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startAssessment} className="w-full">
                Start Assessment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  if (step === AssessmentStep.ASSESSMENT) {
    const currentQuestion = assessment?.questions[currentQuestionIndex];
    
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center">
          <Card className="min-h-[500px] flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Question {currentQuestionIndex + 1}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {currentQuestionIndex + 1} of {assessment?.questions.length}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              {currentQuestion && renderQuestion(currentQuestion)}
            </CardContent>
            <CardFooter className="flex justify-between mt-auto pt-6 border-t">
              <Button 
                variant="outline" 
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              >
                Previous
              </Button>
              <Button 
                onClick={nextQuestion}
                // For video/audio questions, only enable next when recording is completed
                disabled={
                  currentQuestion?.type !== 'TEXT' && 
                  !responses[currentQuestion?.id ?? '']
                }
              >
                {currentQuestionIndex === (assessment?.questions.length ?? 0) - 1 ? 'Finish' : 'Next'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  if (step === AssessmentStep.COMPLETED) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Completed</CardTitle>
            </CardHeader>
            <CardContent>
              {submitError ? (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md mb-4">
                  <p>{submitError}</p>
                  <p className="mt-2">Please try again or contact support.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>Thank you for completing the assessment!</p>
                  <p>Your responses have been recorded successfully.</p>
                  <div className="bg-primary/10 p-4 rounded-md">
                    <h3 className="font-medium mb-2">What happens next?</h3>
                    <p className="text-sm">
                      Our team will review your assessment responses and get back to you soon.
                      The system will analyze your responses to help match your skills with the position.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            {submitError && (
              <CardFooter>
                <Button onClick={submitAssessment} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Try Again'}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    );
  }
  
  return null;
} 