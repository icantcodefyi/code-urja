'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Clock, Video, AudioLines, AlignLeft } from "lucide-react";

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
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // Current question state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    // In a real app, you would save this info to the database
    // For now, we just move to the instructions step
    setStep(AssessmentStep.INSTRUCTIONS);
  };
  
  // Handle resume file upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setResumeFile(e.target.files[0]);
    }
  };
  
  // Start the assessment
  const startAssessment = () => {
    setStep(AssessmentStep.ASSESSMENT);
  };
  
  // Submit the assessment
  const submitAssessment = async () => {
    if (!assessment) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // In a real app, you would upload the resume file to cloud storage here
      // and get the URL to store in the database
      const resumeUrl = "demo-resume-url";
      
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
      
      if (!response.ok) {
        const errorData = await response.json() as { error: string };
        throw new Error(errorData.error ?? 'Failed to submit assessment');
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
  const handleTextResponseChange = (questionId: string, value: string) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };
  
  // Render question based on type
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'VIDEO':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Video Response</h3>
            </div>
            <p className="mb-4">{question.text}</p>
            <div className="p-8 border border-dashed rounded-lg bg-muted/50 flex flex-col items-center justify-center text-center">
              <p className="mb-4">Video recording functionality would appear here</p>
              <Button>Start Recording</Button>
            </div>
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
            <div className="p-8 border border-dashed rounded-lg bg-muted/50 flex flex-col items-center justify-center text-center">
              <p className="mb-4">Audio recording functionality would appear here</p>
              <Button>Start Recording</Button>
            </div>
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
              value={responses[question.id] ?? ''}
              onChange={(e) => handleTextResponseChange(question.id, e.target.value)}
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
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading assessment...</p>
      </div>
    );
  }
  
  if (step === AssessmentStep.ERROR) {
    return (
      <div className="px-4 py-12 max-w-3xl mx-auto">
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
    );
  }
  
  if (step === AssessmentStep.CANDIDATE_INFO) {
    return (
      <div className="px-4 py-12 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to the Assessment</CardTitle>
            <CardDescription>
              Please provide your information before starting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="candidateInfoForm" onSubmit={handleCandidateInfoSubmit} className="space-y-4">
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
                <Label htmlFor="resume">Resume/CV</Label>
                <Input 
                  id="resume" 
                  type="file" 
                  required
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
                <p className="text-xs text-muted-foreground">
                  Upload your resume in PDF, DOC, or DOCX format
                </p>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" form="candidateInfoForm" className="w-full">
              Continue to Assessment
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (step === AssessmentStep.INSTRUCTIONS) {
    return (
      <div className="px-4 py-12 max-w-3xl mx-auto">
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
    );
  }
  
  if (step === AssessmentStep.ASSESSMENT) {
    const currentQuestion = assessment?.questions[currentQuestionIndex];
    
    return (
      <div className="px-4 py-12 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Question {currentQuestionIndex + 1}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {currentQuestionIndex + 1} of {assessment?.questions.length}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentQuestion && renderQuestion(currentQuestion)}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            >
              Previous
            </Button>
            <Button onClick={nextQuestion}>
              {currentQuestionIndex === (assessment?.questions.length ?? 0) - 1 ? 'Finish' : 'Next'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (step === AssessmentStep.COMPLETED) {
    return (
      <div className="px-4 py-12 max-w-3xl mx-auto">
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
              <>
                <p className="mb-4">Thank you for completing the assessment!</p>
                <p>Your responses have been recorded. The assessment administrator will review your submission.</p>
              </>
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
    );
  }
  
  return null;
} 