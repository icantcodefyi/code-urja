'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { 
  User, ChevronLeft, FileText, Clock, CheckSquare, 
  XSquare, Download, BadgeCheck, Zap, Lightbulb, Award
} from "lucide-react";
import Link from "next/link";
import Avatar from "~/components/ui/avatar";
import { getAvatarUrlFromName } from "~/utils/avatar";
import { Skeleton } from "~/components/ui/skeleton";

interface CandidateAnalysis {
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

interface CandidateDetails {
  candidateId: string;
  name: string;
  email: string;
  analysis: {
    id: string;
    overallScore: number;
    skillScore: number;
    experienceScore: number;
    intentToJoin: number;
    strengths: string[];
    analysisJson: CandidateAnalysis;
    createdAt: string;
    updatedAt: string;
  } | null;
  assessment: {
    id: string;
    title: string;
    status: string;
  } | null;
  mediaResponses: {
    video: Array<{
      id: string;
      videoUrl: string;
      transcription: string | null;
      question: {
        id: string;
        text: string;
      };
    }>;
    audio: Array<{
      id: string;
      audioUrl: string;
      transcription: string | null;
      question: {
        id: string;
        text: string;
      };
    }>;
    text: Array<{
      id: string;
      content: string;
      question: {
        id: string;
        text: string;
      };
    }>;
  };
}

function getRecommendationColor(recommendation: string) {
  switch (recommendation) {
    case 'STRONG_HIRE': return 'text-green-600';
    case 'HIRE': return 'text-emerald-600';
    case 'CONSIDER': return 'text-amber-600';
    case 'REJECT': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function formatScoreLabel(score: number) {
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Satisfactory';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
}

export default function CandidateDetailPage() {
  const params = useParams();
  const candidateId = params.id as string;
  
  const [candidate, setCandidate] = useState<CandidateDetails | null>(null);
  console.log(candidate?.mediaResponses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState<Record<string, boolean>>({});
  const [transcriptionErrors, setTranscriptionErrors] = useState<Record<string, string>>({});
  const [autoTranscribeCompleted, setAutoTranscribeCompleted] = useState(false);
  
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const response = await fetch(`/api/candidates/${candidateId}/analysis`);

        if (response.ok) {
          const data = await response.json() as CandidateDetails;
          setCandidate(data);
        } else {
          setError('Failed to fetch candidate details');
          console.error('Failed to fetch candidate details:', await response.text());
        }
      } catch (err) {
        setError('Error loading candidate details');
        console.error('Error loading candidate details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    void fetchCandidateDetails();
  }, [candidateId]);
  
  // Auto-transcribe media when candidate data loads
  useEffect(() => {
    if (candidate && !autoTranscribeCompleted) {      
      // Filter out videos that need transcription - either null or have error message
      const videosNeedingTranscription = candidate.mediaResponses.video.filter(
        item => !item.transcription || item.transcription.includes("cannot be fully processed server-side")
      );
      
      // Filter out audios that need transcription - either null or have error message
      const audiosNeedingTranscription = candidate.mediaResponses.audio.filter(
        item => !item.transcription || item.transcription.includes("cannot be fully processed server-side")
      );
      
      const transcribeAllMedia = async () => {
        // Create a batch of promises for all transcription requests
        const transcriptionPromises = [
          ...videosNeedingTranscription.map(video => 
            requestTranscription('video', video.id, video.videoUrl)
          ),
          ...audiosNeedingTranscription.map(audio => 
            requestTranscription('audio', audio.id, audio.audioUrl)
          )
        ];
        
        // Execute all promises
        if (transcriptionPromises.length > 0) {
          await Promise.allSettled(transcriptionPromises);
        }
        
        setAutoTranscribeCompleted(true);
      };
      
      if (videosNeedingTranscription.length > 0 || audiosNeedingTranscription.length > 0) {
        void transcribeAllMedia();
      } else {
        setAutoTranscribeCompleted(true);
      }
    }
  }, [candidate, autoTranscribeCompleted]);
  
  // Function to request transcription for a media response
  const requestTranscription = async (mediaType: 'video' | 'audio', mediaId: string, mediaUrl: string) => {
    try {
      // Clear any previous error and mark as transcribing
      setTranscriptionErrors(prev => {
        const updated = { ...prev };
        delete updated[mediaId];
        return updated;
      });
      setTranscribing(prev => ({ ...prev, [mediaId]: true }));
      
      // Handle blob URLs by fetching and converting to base64
      let mediaContent: string | undefined;
      if (mediaUrl.startsWith('blob:')) {
        try {
          mediaContent = await fetchAndConvertToBase64(mediaUrl);
        } catch (error) {
          throw new Error('Failed to process blob URL. Please try again.');
        }
      }
      
      const response = await fetch('/api/transcription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mediaType,
          mediaId,
          mediaUrl,
          ...(mediaContent && { mediaContent }),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error ?? 'Failed to transcribe media');
      }
      
      const data = await response.json() as { transcription: string };
      
      // Update the candidate state with the new transcription
      setCandidate(prev => {
        if (!prev) return prev;
        
        const updatedMediaResponses = { ...prev.mediaResponses };
        
        if (mediaType === 'video') {
          updatedMediaResponses.video = updatedMediaResponses.video.map(item => 
            item.id === mediaId ? { ...item, transcription: data.transcription } : item
          );
        } else {
          updatedMediaResponses.audio = updatedMediaResponses.audio.map(item => 
            item.id === mediaId ? { ...item, transcription: data.transcription } : item
          );
        }
        
        return {
          ...prev,
          mediaResponses: updatedMediaResponses,
        };
      });
    } catch (err) {
      console.error('Transcription error:', err);
      setTranscriptionErrors(prev => ({
        ...prev,
        [mediaId]: err instanceof Error ? err.message : 'An unknown error occurred',
      }));
    } finally {
      setTranscribing(prev => {
        const updated = { ...prev };
        delete updated[mediaId];
        return updated;
      });
    }
  };
  
  // Helper function to determine if a transcription is valid or contains error message
  const isValidTranscription = (transcription: string | null): boolean => {
    if (!transcription) return false;
    return !transcription.includes("cannot be fully processed server-side");
  };
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/app/candidates">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Candidates
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <p>Loading candidate details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !candidate) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/app/candidates">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Candidates
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500 text-lg mb-2">Error loading candidate details</p>
            <p className="text-muted-foreground">{error ?? 'Candidate not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Split name into first and last name
  const nameParts = candidate.name.split(' ');
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ') ?? '';
  
  const analysis = candidate.analysis?.analysisJson;
  
  return (
    <div className="p-6">
      <div className="flex items-center space-x-2 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/app/candidates">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Candidates
          </Link>
        </Button>
      </div>
      
      {/* Candidate Info Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar 
                src={getAvatarUrlFromName(`${firstName} ${lastName}`)}
                size="lg"
              />
              <div>
                <CardTitle className="text-2xl font-bold">{candidate.name}</CardTitle>
                <CardDescription className="text-base">{candidate.email}</CardDescription>
              </div>
            </div>
            
            {candidate.assessment && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                <Clock className="h-4 w-4" />
                <span>{candidate.assessment.status ? candidate.assessment.status.replace(/_/g, ' ').toLowerCase()
                  .replace(/\b\w/g, char => char.toUpperCase()) : 'Pending'}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {candidate.assessment && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Applied For:</span> {candidate.assessment.title}
              </p>
            </div>
          )}
          
          {!candidate.analysis && (
            <div className="mt-6 p-4 bg-amber-50 text-amber-800 rounded-md">
              <p className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Analysis not available for this candidate yet.</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {candidate.analysis && analysis && (
        <>
          {/* Overall Assessment Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Assessment Summary</CardTitle>
              <CardDescription>Overall evaluation and recommendation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-base">{analysis.summary}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-blue-600" />
                    Overall Scores
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Overall</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis.overallScore)}`}>
                          {analysis.overallScore}% ({formatScoreLabel(analysis.overallScore)})
                        </span>
                      </div>
                      <Progress 
                        value={analysis.overallScore} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Skill Match</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis.skillMatch)}`}>
                          {analysis.skillMatch}%
                        </span>
                      </div>
                      <Progress 
                        value={analysis.skillMatch} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Technical Skills</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis.technicalScore)}`}>
                          {analysis.technicalScore}%
                        </span>
                      </div>
                      <Progress 
                        value={analysis.technicalScore} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Communication</span>
                        <span className={`text-sm font-medium ${getScoreColor(analysis.communicationScore)}`}>
                          {analysis.communicationScore}%
                        </span>
                      </div>
                      <Progress 
                        value={analysis.communicationScore} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <BadgeCheck className="h-5 w-5 mr-2 text-blue-600" />
                    Recommendation
                  </h3>
                  
                  <div className={`text-xl font-bold ${getRecommendationColor(analysis.recommendation)}`}>
                    {analysis.recommendation.replace(/_/g, ' ')}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Additional Metrics
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-50 p-2 rounded-md">
                        <p className="text-xs text-gray-500">Skill Fit</p>
                        <p className="text-lg font-semibold">{candidate.analysis.skillScore}%</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md">
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-lg font-semibold">{candidate.analysis.experienceScore}%</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md">
                        <p className="text-xs text-gray-500">Intent to Join</p>
                        <p className="text-lg font-semibold">{candidate.analysis.intentToJoin}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-sm">{strength}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <XSquare className="h-5 w-5 mr-2 text-red-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-sm">{weakness}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Feedback Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
                Feedback Points
              </CardTitle>
              <CardDescription>Specific feedback that can be shared with the candidate</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-3">
                {analysis.feedbackPoints.map((feedback, index) => (
                  <li key={index} className="text-sm">{feedback}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Add the Responses Card after the Feedback Card */}
          {/* Candidate's Media Responses */}
          {candidate.mediaResponses && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Assessment Responses
                </CardTitle>
                <CardDescription>Candidate&apos;s responses to assessment questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Responses */}
                {candidate.mediaResponses.video.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Video Responses</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {candidate.mediaResponses.video.map((response) => (
                        <div key={response.id} className="border rounded-lg p-4 bg-muted/20">
                          <h4 className="font-medium mb-2">{response.question.text}</h4>
                          <div className="aspect-video mb-4">
                            <video 
                              className="w-full h-full rounded-md" 
                              src={response.videoUrl} 
                              controls
                            />
                          </div>
                          {isValidTranscription(response.transcription) ? (
                            <div className="mt-2">
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">Transcription:</h5>
                              <p className="text-sm whitespace-pre-line">{response.transcription}</p>
                            </div>
                          ) : transcribing[response.id] ? (
                            <div className="mt-2 space-y-2">
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">Transcription:</h5>
                              <div className="space-y-1">
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-3/4 h-4" />
                                <Skeleton className="w-5/6 h-4" />
                              </div>
                              <p className="text-xs text-muted-foreground">Generating transcription...</p>
                            </div>
                          ) : transcriptionErrors[response.id] ? (
                            <div className="mt-2">
                              <div className="text-sm text-red-500 mb-2">
                                Error: {transcriptionErrors[response.id]}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => requestTranscription('video', response.id, response.videoUrl)}
                              >
                                Retry Transcription
                              </Button>
                            </div>
                          ) : (
                            <div className="mt-2 space-y-2">
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">Transcription:</h5>
                              <div className="space-y-1">
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-3/4 h-4" />
                                <Skeleton className="w-5/6 h-4" />
                              </div>
                              <p className="text-xs text-muted-foreground">Starting transcription...</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio Responses */}
                {candidate.mediaResponses.audio.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Audio Responses</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {candidate.mediaResponses.audio.map((response) => (
                        <div key={response.id} className="border rounded-lg p-4 bg-muted/20">
                          <h4 className="font-medium mb-2">{response.question.text}</h4>
                          <audio 
                            className="w-full mb-4" 
                            src={response.audioUrl} 
                            controls
                          />
                          {isValidTranscription(response.transcription) ? (
                            <div className="mt-2">
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">Transcription:</h5>
                              <p className="text-sm whitespace-pre-line">{response.transcription}</p>
                            </div>
                          ) : transcribing[response.id] ? (
                            <div className="mt-2 space-y-2">
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">Transcription:</h5>
                              <div className="space-y-1">
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-3/4 h-4" />
                                <Skeleton className="w-5/6 h-4" />
                              </div>
                              <p className="text-xs text-muted-foreground">Generating transcription...</p>
                            </div>
                          ) : transcriptionErrors[response.id] ? (
                            <div className="mt-2">
                              <div className="text-sm text-red-500 mb-2">
                                Error: {transcriptionErrors[response.id]}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => requestTranscription('audio', response.id, response.audioUrl)}
                              >
                                Retry Transcription
                              </Button>
                            </div>
                          ) : (
                            <div className="mt-2 space-y-2">
                              <h5 className="text-sm font-medium text-muted-foreground mb-1">Transcription:</h5>
                              <div className="space-y-1">
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-3/4 h-4" />
                                <Skeleton className="w-5/6 h-4" />
                              </div>
                              <p className="text-xs text-muted-foreground">Starting transcription...</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Text Responses */}
                {candidate.mediaResponses.text.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Text Responses</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {candidate.mediaResponses.text.map((response) => (
                        <div key={response.id} className="border rounded-lg p-4 bg-muted/20">
                          <h4 className="font-medium mb-2">{response.question.text}</h4>
                          <p className="whitespace-pre-line">{response.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No responses message */}
                {candidate.mediaResponses.video.length === 0 && 
                 candidate.mediaResponses.audio.length === 0 && 
                 candidate.mediaResponses.text.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No responses found for this candidate.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
      
      <div className="flex justify-end mt-6">
        <Button variant="outline" className="mr-2">
          <Download className="h-4 w-4 mr-2" />
          Export Analysis
        </Button>
        <Button>Schedule Interview</Button>
      </div>
    </div>
  );
}

const fetchAndConvertToBase64 = async (blobUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Fetch the blob URL
      fetch(blobUrl)
        .then(response => response.blob())
        .then(blob => {
          // Use FileReader to convert Blob to base64
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Remove the data URL prefix (e.g., "data:audio/mp3;base64,")
            const base64Content = base64data.split(',')[1] ?? '';
            resolve(base64Content);
          };
          reader.onerror = () => {
            reject(new Error('Failed to read blob data'));
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          reject(error instanceof Error ? error : new Error(String(error)));
        });
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}; 