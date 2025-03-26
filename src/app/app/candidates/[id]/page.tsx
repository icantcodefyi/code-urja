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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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