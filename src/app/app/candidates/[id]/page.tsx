'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Progress } from "~/components/ui/progress";
import Badge from "~/components/ui/badge";
import { 
  User, CheckCircle, XCircle, 
  PlayCircle, PauseCircle, MessageCircle, Download, Share2, ThumbsUp, ThumbsDown
} from "lucide-react";
import { QuestionType } from '~/server/types';

// Mock data for the candidate
const candidateData = {
  id: "c123",
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@example.com",
  phone: "+1 (555) 123-4567",
  currentPosition: "Senior Frontend Developer",
  linkedIn: "https://linkedin.com/in/johndoe",
  resumeUrl: "/candidates/johndoe/resume.pdf",
  appliedPosition: "Lead Frontend Developer",
  appliedDate: "2023-10-15",
  status: "Reviewed",
  assessment: {
    id: "a123",
    title: "Frontend Developer Assessment",
    description: "Technical assessment for frontend developer role",
    score: 87,
    maxScore: 100,
    completedOn: "2023-10-18",
    duration: 48, // minutes
    questions: [
      {
        id: "q1",
        text: "Describe your experience with React and TypeScript. What are some best practices you follow?",
        type: QuestionType.VIDEO,
        videoUrl: "/candidates/johndoe/video1.mp4",
        transcription: "I have been working with React for over 5 years and TypeScript for 3 years. I believe in component-based architecture and always ensure my components are reusable and well-typed. For state management, I prefer using React Context for simpler applications and Redux for more complex ones. I always follow the principle of lifting state up when needed and try to keep components pure and focused on a single responsibility. For TypeScript, I use interfaces over types when possible and make sure to properly type all props and state.",
        duration: 95, // seconds
      },
      {
        id: "q2",
        text: "Explain how you would optimize the performance of a React application.",
        type: QuestionType.AUDIO,
        audioUrl: "/candidates/johndoe/audio1.mp3",
        transcription: "For React performance optimization, I follow several strategies. First, I use React.memo for functional components that render often but with the same props. I also implement shouldComponentUpdate for class components. I avoid anonymous functions in render methods to prevent unnecessary re-renders. I use the useCallback and useMemo hooks to memoize functions and computed values. For large lists, I implement virtualization using libraries like react-window. I also code-split using React.lazy and Suspense to reduce the initial bundle size.",
        duration: 78, // seconds
      },
      {
        id: "q3",
        text: "What is your experience with state management in React applications?",
        type: QuestionType.TEXT,
        answer: "I have extensive experience with various state management approaches in React. For smaller applications, I typically use React's built-in Context API with useReducer for global state. For larger applications, I've worked with Redux and Redux Toolkit, which provides better scalability and debugging capabilities. I've also used MobX for some projects that benefit from its reactive programming model. Recently, I've been exploring Recoil and Jotai for their atom-based approach, which can simplify state management in certain scenarios. I always evaluate the needs of the project before choosing a state management solution, considering factors like team familiarity, project complexity, and performance requirements.",
      },
    ],
  },
  analysis: {
    overallScore: 87,
    intentToJoin: 92,
    skillScore: 89,
    experienceScore: 85,
    strengths: ["React", "TypeScript", "Performance Optimization", "State Management"],
    weaknesses: ["Backend Integration", "Testing Strategy"],
    recommendation: "Shortlist",
    notes: "Strong technical skills and communicates clearly. Has the experience we need for the lead position.",
    sentimentAnalysis: {
      positive: 78,
      neutral: 19,
      negative: 3,
    }
  }
};

export default function CandidateAnalysis({ params }: { params: { id: string } }) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  
  // Normally would fetch candidate data using params.id
  const candidate = candidateData;
  
  const toggleVideoPlayback = () => {
    setVideoPlaying(!videoPlaying);
  };
  
  const toggleAudioPlayback = () => {
    setAudioPlaying(!audioPlaying);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{candidate.firstName} {candidate.lastName}</h1>
            <Badge>{candidate.status}</Badge>
          </div>
          <p className="text-muted-foreground">
            Applied for {candidate.appliedPosition} on {new Date(candidate.appliedDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Resume
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button size="sm" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Shortlist
          </Button>
          <Button variant="destructive" size="sm" className="gap-2">
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Candidate Overview */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Candidate Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{candidate.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{candidate.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Position</p>
                <p className="font-medium">{candidate.currentPosition}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">LinkedIn</p>
                <a 
                  href={candidate.linkedIn} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  View Profile
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assessment Completed</p>
                <p className="font-medium">{new Date(candidate.assessment.completedOn).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assessment Duration</p>
                <p className="font-medium">{candidate.assessment.duration} minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Analysis */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Assessment Analysis</CardTitle>
            <CardDescription>Overall performance score: {candidate.analysis.overallScore}%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Intent to Join</span>
                  <span className="font-medium">{candidate.analysis.intentToJoin}%</span>
                </div>
                <Progress value={candidate.analysis.intentToJoin} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Skill Match</span>
                  <span className="font-medium">{candidate.analysis.skillScore}%</span>
                </div>
                <Progress value={candidate.analysis.skillScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Experience</span>
                  <span className="font-medium">{candidate.analysis.experienceScore}%</span>
                </div>
                <Progress value={candidate.analysis.experienceScore} className="h-2" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.analysis.strengths.map((strength, index) => (
                    <Badge key={index}>{strength}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Areas for Improvement</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.analysis.weaknesses.map((weakness, index) => (
                    <Badge key={index}>{weakness}</Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Recommendation</h3>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">{candidate.analysis.recommendation}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{candidate.analysis.notes}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Sentiment Analysis</h3>
              <div className="flex items-center gap-2 w-full h-6 rounded-full overflow-hidden bg-muted">
                <div 
                  className="h-full bg-green-500" 
                  style={{width: `${candidate.analysis.sentimentAnalysis.positive}%`}}
                />
                <div 
                  className="h-full bg-gray-400" 
                  style={{width: `${candidate.analysis.sentimentAnalysis.neutral}%`}}
                />
                <div 
                  className="h-full bg-red-500" 
                  style={{width: `${candidate.analysis.sentimentAnalysis.negative}%`}}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Positive ({candidate.analysis.sentimentAnalysis.positive}%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span>Neutral ({candidate.analysis.sentimentAnalysis.neutral}%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Negative ({candidate.analysis.sentimentAnalysis.negative}%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responses Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="all">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="all">All Responses</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {candidate.assessment.questions.map((question, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <Badge>{question.type}</Badge>
                      </div>
                      <CardDescription className="mt-1">{question.text}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {question.type === QuestionType.VIDEO && (
                    <div className="space-y-4">
                      <div className="relative aspect-video bg-black/5 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full h-12 w-12 bg-white/80"
                            onClick={toggleVideoPlayback}
                          >
                            {videoPlaying ? (
                              <PauseCircle className="h-8 w-8" />
                            ) : (
                              <PlayCircle className="h-8 w-8" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="text-sm font-medium mb-1">Transcription</h3>
                            <p className="text-sm text-muted-foreground">{question.transcription}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {question.type === QuestionType.AUDIO && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 h-16 border rounded-md p-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={toggleAudioPlayback}
                        >
                          {audioPlaying ? (
                            <PauseCircle className="h-6 w-6" />
                          ) : (
                            <PlayCircle className="h-6 w-6" />
                          )}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="w-full h-8">
                            <div className="w-full h-full flex items-center gap-0.5">
                              {Array.from({length: 50}).map((_, i) => (
                                <div 
                                  key={i} 
                                  className="bg-primary/60 w-1 rounded-full"
                                  style={{height: `${Math.random() * 100}%`}}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(question.duration ?? 0 / 60)}:{String(question.duration ?? 0 % 60).padStart(2, '0')}
                        </span>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="text-sm font-medium mb-1">Transcription</h3>
                            <p className="text-sm text-muted-foreground">{question.transcription}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {question.type === QuestionType.TEXT && (
                    <div className="border rounded-lg p-3">
                      <p className="text-sm">{question.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="video" className="space-y-6">
            {candidate.assessment.questions
              .filter(q => q.type === QuestionType.VIDEO)
              .map((question, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">Video Response {index + 1}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">{question.text}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative aspect-video bg-black/5 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full h-12 w-12 bg-white/80"
                            onClick={toggleVideoPlayback}
                          >
                            {videoPlaying ? (
                              <PauseCircle className="h-8 w-8" />
                            ) : (
                              <PlayCircle className="h-8 w-8" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="text-sm font-medium mb-1">Transcription</h3>
                            <p className="text-sm text-muted-foreground">{question.transcription}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="audio" className="space-y-6">
            {candidate.assessment.questions
              .filter(q => q.type === QuestionType.AUDIO)
              .map((question, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">Audio Response {index + 1}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">{question.text}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 h-16 border rounded-md p-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={toggleAudioPlayback}
                        >
                          {audioPlaying ? (
                            <PauseCircle className="h-6 w-6" />
                          ) : (
                            <PlayCircle className="h-6 w-6" />
                          )}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="w-full h-8">
                            <div className="w-full h-full flex items-center gap-0.5">
                              {Array.from({length: 50}).map((_, i) => (
                                <div 
                                  key={i} 
                                  className="bg-primary/60 w-1 rounded-full"
                                  style={{height: `${Math.random() * 100}%`}}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(question.duration ?? 0 / 60)}:{String(question.duration ?? 0 % 60).padStart(2, '0')}
                        </span>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="text-sm font-medium mb-1">Transcription</h3>
                            <p className="text-sm text-muted-foreground">{question.transcription}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="text" className="space-y-6">
            {candidate.assessment.questions
              .filter(q => q.type === QuestionType.TEXT)
              .map((question, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">Text Response {index + 1}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">{question.text}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-3">
                      <p className="text-sm">{question.answer}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 