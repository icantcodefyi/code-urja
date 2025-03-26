'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import Badge from "~/components/ui/badge";
import { VideoIcon, MicIcon, FileIcon, Upload, Clock, MessageSquare, BarChart2 } from "lucide-react";
import type { CreateAssessmentInput } from '~/server/types';
import { QuestionType } from '~/server/types';

interface ApiError {
  error: string;
  details?: unknown;
}

type ApiResponse = CreateAssessmentInput | ApiError;

export default function AssessmentGenerator() {
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<CreateAssessmentInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [videoRecording, setVideoRecording] = useState(false);
  const [audioRecording, setAudioRecording] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    { title: "Assessment Configuration", description: "Set up your assessment parameters" },
    { title: "Personal Details", description: "Add candidate information" },
    { title: "Resume Upload", description: "Upload your resume" },
    { title: "Video Cover Letter", description: "Record your introduction" },
    { title: "Assessment Questions", description: "Complete required questions" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const input = {
      jobTitle: formData.get('jobTitle') as string,
      experienceLevel: formData.get('experienceLevel') as string,
      requiredSkills: (formData.get('requiredSkills') as string).split(',').map(s => s.trim()),
      companyContext: formData.get('companyContext') as string,
      assessmentType: formData.get('assessmentType') as 'TECHNICAL' | 'BEHAVIORAL' | 'MIXED',
      numberOfQuestions: Number(formData.get('numberOfQuestions')),
      preferredDuration: Number(formData.get('preferredDuration')),
    };

    try {
      const response = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const data = await response.json() as ApiResponse;

      if (!response.ok) {
        const errorData = data as ApiError;
        throw new Error(errorData.error ?? 'Failed to generate assessment');
      }

      setAssessment(data as CreateAssessmentInput);
      setCurrentStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate assessment');
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoRecording = () => {
    setVideoRecording(!videoRecording);
  };

  const toggleAudioRecording = () => {
    setAudioRecording(!audioRecording);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress((currentStep + 1) * (100 / (steps.length - 1)));
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(currentStep * (100 / (steps.length - 1)));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assessment Portal</h1>
        <p className="text-muted-foreground">Create and manage candidate assessments with video and audio responses</p>
        
        <div className="mt-6">
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center w-1/5 ${index <= currentStep ? 'text-primary' : ''}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                    ${index < currentStep ? 'bg-primary text-primary-foreground' : 
                      index === currentStep ? 'border-2 border-primary' : 'border-2 border-muted'}`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className="text-xs text-center hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {currentStep === 0 && (
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="create">Create Assessment</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="">
                <CardHeader>
                  <CardTitle>Assessment Configuration</CardTitle>
                  <CardDescription>
                    Configure your assessment parameters to match your hiring needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="assessmentForm" onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        required
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experienceLevel">Experience Level</Label>
                      <Select name="experienceLevel" defaultValue="Mid">
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Mid">Mid-Level</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Lead">Lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requiredSkills">Required Skills</Label>
                      <Input
                        id="requiredSkills"
                        name="requiredSkills"
                        required
                        placeholder="e.g., TypeScript, React, Node.js"
                      />
                      <p className="text-xs text-muted-foreground">Comma-separated list of skills</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyContext">Company Context</Label>
                      <Textarea
                        id="companyContext"
                        name="companyContext"
                        placeholder="Brief description of your company and culture"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assessmentType">Assessment Type</Label>
                      <Select name="assessmentType" defaultValue="MIXED">
                        <SelectTrigger>
                          <SelectValue placeholder="Select assessment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TECHNICAL">Technical</SelectItem>
                          <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
                          <SelectItem value="MIXED">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                        <Input
                          id="numberOfQuestions"
                          name="numberOfQuestions"
                          type="number"
                          min="1"
                          max="20"
                          defaultValue="5"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferredDuration">Duration (minutes)</Label>
                        <Input
                          id="preferredDuration"
                          name="preferredDuration"
                          type="number"
                          min="15"
                          max="180"
                          defaultValue="60"
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    form="assessmentForm"
                    disabled={loading} 
                    className="w-full"
                  >
                    {loading ? 'Generating...' : 'Generate Assessment'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>Frontend Developer</CardTitle>
                  <CardDescription>30 min assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">CSS</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">8 questions including technical and behavioral components</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Use Template</Button>
                </CardFooter>
              </Card>
              
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>Backend Engineer</CardTitle>
                  <CardDescription>45 min assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">Python</Badge>
                    <Badge variant="secondary">SQL</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">10 questions focused on system design and algorithms</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Use Template</Button>
                </CardFooter>
              </Card>
              
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>Product Manager</CardTitle>
                  <CardDescription>60 min assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    <Badge variant="secondary">Strategy</Badge>
                    <Badge variant="secondary">UX</Badge>
                    <Badge variant="secondary">Analytics</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">12 questions covering product strategy and leadership</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Use Template</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter your first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter your last name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter your phone number" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="currentPosition">Current Position</Label>
                <Input id="currentPosition" placeholder="Enter your current job title" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="linkedIn">LinkedIn URL (optional)</Label>
                <Input id="linkedIn" placeholder="Enter your LinkedIn profile URL" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Resume Upload</CardTitle>
            <CardDescription>Upload your resume or CV</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Drag & drop your file here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Supported formats: PDF, DOCX, RTF (Max 5MB)</p>
              </div>
              <Button variant="outline" size="sm">Browse Files</Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Video Cover Letter</CardTitle>
            <CardDescription>Record a brief introduction about yourself (max 2 minutes)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-video bg-black/5 rounded-lg overflow-hidden mb-4">
              {videoRecording ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse mb-2"></div>
                    <p className="text-sm font-medium">Recording...</p>
                    <p className="text-xs text-muted-foreground">00:34 / 02:00</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <VideoIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Your video will appear here</p>
                    <p className="text-xs text-muted-foreground">Click record to start</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center gap-4 mb-6">
              <Button 
                variant={videoRecording ? "destructive" : "default"}
                size="sm"
                onClick={toggleVideoRecording}
              >
                {videoRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={!videoRecording}
              >
                Pause
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={videoRecording}
              >
                Review
              </Button>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Suggested talking points:</h3>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                    <li>Briefly introduce yourself and your current role</li>
                    <li>Highlight your most relevant experience for this position</li>
                    <li>Explain why you're interested in this opportunity</li>
                    <li>Share what makes you a unique candidate</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 4 && assessment && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{assessment.title}</CardTitle>
                  <CardDescription>{assessment.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{assessment.maxDuration} minutes</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {assessment.questions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <div className="font-medium">Question {index + 1}</div>
                      <Badge variant="outline">{question.type}</Badge>
                    </div>
                    <p className="mb-4">{question.text}</p>
                    
                    {question.type === QuestionType.TEXT ? (
                      <Textarea placeholder="Type your answer here..." className="min-h-[100px]" />
                    ) : question.type === QuestionType.AUDIO ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 h-16 border rounded-md p-3">
                          {audioRecording ? (
                            <div className="flex items-center gap-3 w-full">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-sm">Recording...</span>
                              </div>
                              <div className="flex-1 flex justify-center">
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
                              <span className="text-sm text-muted-foreground">0:17</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-muted-foreground w-full justify-center">
                              <MicIcon className="h-5 w-5" />
                              <span>Click to record audio response</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant={audioRecording ? "destructive" : "default"} 
                            size="sm"
                            className="gap-2"
                            onClick={toggleAudioRecording}
                          >
                            <MicIcon className="h-4 w-4" />
                            {audioRecording ? "Stop Recording" : "Record Answer"}
                          </Button>
                          <Button variant="outline" size="sm" disabled={!audioRecording}>
                            Pause
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {['A', 'B', 'C', 'D'].map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <input type="radio" id={`q${index}option${option}`} name={`question${index}`} />
                            <Label htmlFor={`q${index}option${option}`}>Option {option}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button>Submit Assessment</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
