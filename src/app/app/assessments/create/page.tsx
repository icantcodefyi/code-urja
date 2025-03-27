'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { 
  Plus, Minus, Video, AudioLines, AlignLeft, Clock, Save, 
  Sparkles, RotateCcw, Send, FileQuestion, PlusCircle, Copy,
  Mail, CheckCircle, Link as LinkIcon, Share2
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

// API response types for AI generation
interface ApiError {
  error: string;
  details?: unknown;
}

type ApiResponse = {
  title: string;
  description: string;
  maxDuration: number;
  questions: Array<{
    text: string;
    type: QuestionType;
    expectedAnswer?: string;
  }>;
} | ApiError;

// Question types
type QuestionType = 'VIDEO' | 'AUDIO' | 'TEXT';

// Question interface
interface Question {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
  expectedAnswer?: string;
}

export default function CreateAssessment() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxDuration, setMaxDuration] = useState('60');
  const [passingScore, setPassingScore] = useState('70');
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(true);
  const [isTemplate, setIsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', type: 'VIDEO', order: 1, expectedAnswer: '' }
  ]);
  const [activeTab, setActiveTab] = useState("custom");
  
  // AI Generation state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generatedAssessment, setGeneratedAssessment] = useState<ApiResponse | null>(null);
  
  // Handle form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [assessmentLink, setAssessmentLink] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [sentEmails, setSentEmails] = useState<string[]>([]);
  const [inviteError, setInviteError] = useState<string | null>(null);
  
  // Add a new question
  const addQuestion = () => {
    const newQuestion: Question = {
      id: String(questions.length + 1),
      text: '',
      type: 'VIDEO',
      order: questions.length + 1,
      expectedAnswer: ''
    };
    setQuestions([...questions, newQuestion]);
  };
  
  // Remove a question
  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter(q => q.id !== id).map((q, idx) => ({
        ...q,
        order: idx + 1
      }));
      setQuestions(updatedQuestions);
    }
  };
  
  // Update question text
  const updateQuestionText = (id: string, text: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, text } : q
    );
    setQuestions(updatedQuestions);
  };
  
  // Update question type
  const updateQuestionType = (id: string, type: QuestionType) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, type } : q
    );
    setQuestions(updatedQuestions);
  };
  
  // Update expected answer
  const updateExpectedAnswer = (id: string, expectedAnswer: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, expectedAnswer } : q
    );
    setQuestions(updatedQuestions);
  };
  
  // Handle AI assessment generation
  const handleAIGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError(null);

    const formData = new FormData(e.currentTarget);
    const input = {
      jobTitle: formData.get('jobTitle') as string,
      experienceLevel: formData.get('experienceLevel') as string,
      requiredSkills: (formData.get('requiredSkills') as string).split(',').map(s => s.trim()),
      companyContext: formData.get('companyContext') as string,
      assessmentType: formData.get('assessmentType') as 'TECHNICAL' | 'BEHAVIORAL' | 'MIXED',
      numberOfQuestions: Number(formData.get('numberOfQuestions')),
      preferredDuration: Number(formData.get('preferredDuration')),
      includeExpectedAnswers: true,
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

      // Success - update the title, description, and questions with AI-generated content
      setGeneratedAssessment(data);
      
      // Set the title and description
      if ('title' in data) {
        setTitle(data.title);
        setDescription(data.description);
        setMaxDuration(data.maxDuration.toString());
        
        // Set the questions
        if (data.questions && data.questions.length > 0) {
          const formattedQuestions = data.questions.map((q, index) => ({
            id: String(index + 1),
            text: q.text,
            type: q.type,
            order: index + 1,
            expectedAnswer: q.expectedAnswer ?? ''
          }));
          setQuestions(formattedQuestions);
        }
        
        // Switch to custom tab to show the generated assessment
        setActiveTab('custom');
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to generate assessment');
    } finally {
      setAiLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const payload = {
        title,
        description,
        maxDuration: parseInt(maxDuration),
        passingScore: parseInt(passingScore),
        aiAnalysisEnabled,
        isTemplate,
        templateName: isTemplate ? templateName : undefined,
        questions
      };
      
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json() as { error: string };
        throw new Error(errorData.error ?? 'Failed to create assessment');
      }
      
      const data = await response.json() as { assessment: unknown; assessmentLink: string };
      setSubmitSuccess(true);
      setAssessmentLink(data.assessmentLink);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error creating assessment:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle sending invitation
  const handleSendInvite = async () => {
    if (!inviteEmail?.includes('@')) {
      setInviteError('Please enter a valid email address');
      return;
    }
    
    setInviteError(null);
    setInviteSent(true);
    
    try {
      // In a real implementation, you would call an API endpoint to send the invitation
      // This is just a placeholder for the UI demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add to sent emails list
      setSentEmails(prev => [...prev, inviteEmail]);
      setInviteEmail('');
    } catch (error) {
      setInviteError('Failed to send invitation. Please try again.');
    } finally {
      setInviteSent(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Assessment</h1>
        <p className="text-muted-foreground">Design a new assessment for candidates with video and audio questions</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Custom Assessment
          </TabsTrigger>
          <TabsTrigger value="template" className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            From Template
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="custom">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Assessment Details</CardTitle>
                <CardDescription>Basic information about your assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="title" className="text-sm font-medium mb-1 block">
                      Assessment Title
                    </label>
                    <Input 
                      id="title"
                      placeholder="e.g., Frontend Developer Assessment"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="text-sm font-medium mb-1 block">
                      Description
                    </label>
                    <Textarea 
                      id="description"
                      placeholder="Describe the purpose of this assessment"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="maxDuration" className="text-sm font-medium mb-1 block">
                        Maximum Duration (minutes)
                      </label>
                      <Input 
                        id="maxDuration"
                        type="number"
                        min="5"
                        max="180"
                        value={maxDuration}
                        onChange={(e) => setMaxDuration(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="passingScore" className="text-sm font-medium mb-1 block">
                        Passing Score (%)
                      </label>
                      <Input 
                        id="passingScore"
                        type="number"
                        min="0"
                        max="100"
                        value={passingScore}
                        onChange={(e) => setPassingScore(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">AI Analysis</h4>
                        <p className="text-xs text-muted-foreground">
                          Enable AI-powered analysis of candidate responses
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={aiAnalysisEnabled}
                      onCheckedChange={setAiAnalysisEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-start gap-2">
                      <Save className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Save as Template</h4>
                        <p className="text-xs text-muted-foreground">
                          Save this assessment as a reusable template
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={isTemplate}
                      onCheckedChange={setIsTemplate}
                    />
                  </div>
                  
                  {isTemplate && (
                    <div>
                      <label htmlFor="templateName" className="text-sm font-medium mb-1 block">
                        Template Name
                      </label>
                      <Input 
                        id="templateName"
                        placeholder="e.g., Standard Frontend Interview"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        required={isTemplate}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Assessment Questions</CardTitle>
                <CardDescription>Create questions for candidates to answer via video or audio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-md p-4 relative">
                    <div className="absolute -top-3 left-3 bg-background px-2 text-xs font-medium text-muted-foreground">
                      Question {question.order}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          type="button"
                          size="sm"
                          variant={question.type === 'VIDEO' ? 'default' : 'outline'}
                          onClick={() => updateQuestionType(question.id, 'VIDEO')}
                          className="gap-1"
                        >
                          <Video className="h-4 w-4" />
                          Video
                        </Button>
                        <Button 
                          type="button"
                          size="sm"
                          variant={question.type === 'AUDIO' ? 'default' : 'outline'}
                          onClick={() => updateQuestionType(question.id, 'AUDIO')}
                          className="gap-1"
                        >
                          <AudioLines className="h-4 w-4" />
                          Audio
                        </Button>
                        <Button 
                          type="button"
                          size="sm"
                          variant={question.type === 'TEXT' ? 'default' : 'outline'}
                          onClick={() => updateQuestionType(question.id, 'TEXT')}
                          className="gap-1"
                        >
                          <AlignLeft className="h-4 w-4" />
                          Text
                        </Button>
                      </div>
                      
                      <Textarea 
                        placeholder={`Enter your ${question.type.toLowerCase()} question here...`}
                        value={question.text}
                        onChange={(e) => updateQuestionText(question.id, e.target.value)}
                        rows={3}
                        required
                      />
                      
                      <div className="relative">
                        <div className="absolute -top-3 left-3 bg-background px-2 text-xs font-medium text-muted-foreground">
                          Expected Answer
                        </div>
                        <Textarea 
                          placeholder="Enter the expected answer (for grading purposes)..."
                          value={question.expectedAnswer ?? ''}
                          onChange={(e) => updateExpectedAnswer(question.id, e.target.value)}
                          rows={2}
                          className="border rounded-md p-4"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                          disabled={questions.length <= 1}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Minus className="h-4 w-4 mr-1" />
                          Remove Question
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addQuestion}
                    className="w-full max-w-md"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Question
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button type="button" variant="outline">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset Form
              </Button>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-1" />
                      Create Assessment
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {submitError && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
                {submitError}
              </div>
            )}
          </form>
        </TabsContent>
        
        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle>Choose Assessment Template</CardTitle>
              <CardDescription>Select from pre-defined templates to speed up assessment creation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">No templates available yet. Create assessments and save them as templates to see them here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Assessment</CardTitle>
              <CardDescription>
                Generate an assessment using AI based on job requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="aiAssessmentForm" onSubmit={handleAIGenerate} className="space-y-4">
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-700">AI-powered generation</h4>
                      <p className="text-xs text-blue-600">
                        Our AI will generate relevant questions with expected answers for better candidate evaluation.
                      </p>
                    </div>
                  </div>
                </div>

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
                
                {aiError && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                    {aiError}
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="aiAssessmentForm"
                disabled={aiLoading} 
                className="w-full"
              >
                {aiLoading ? 'Generating...' : 'Generate Assessment with AI'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Assessment Created Successfully!
            </DialogTitle>
            <DialogDescription>
              Your assessment is ready to be shared with candidates.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="assessment-link" className="text-sm font-medium">
                Assessment Link
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="assessment-link"
                  value={`${window.location.origin}${assessmentLink}`}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  size="sm"
                  className="shrink-0 cursor-pointer hover:bg-gray-700"
                  onClick={() => {
                    void navigator.clipboard.writeText(`${window.location.origin}${assessmentLink}`);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="candidate-email" className="text-sm font-medium">
                Send Invitation
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="candidate-email"
                  type="email"
                  placeholder="candidate@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  className="shrink-0"
                  onClick={handleSendInvite}
                  disabled={inviteSent || !inviteEmail}
                >
                  {inviteSent ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-1" />
                      Send
                    </>
                  )}
                </Button>
              </div>
              
              {inviteError && (
                <p className="text-sm text-red-500 mt-1">{inviteError}</p>
              )}
              
              {sentEmails.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Invitations sent:</p>
                  <div className="max-h-20 overflow-y-auto">
                    {sentEmails.map((email, index) => (
                      <div key={index} className="flex items-center text-sm text-green-600 gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>{email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="mb-2 sm:mb-0"
              onClick={() => setShowSuccessDialog(false)}
            >
              Close
            </Button>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  window.location.href = `/app/assessments/${assessmentLink.split('/').pop()}`;
                }}
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                View Assessment
              </Button>
              
              <Button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    void navigator.share({
                      title: title,
                      text: `Join my assessment: ${title}`,
                      url: `${window.location.origin}${assessmentLink}`
                    });
                  } else {
                    void navigator.clipboard.writeText(`${window.location.origin}${assessmentLink}`);
                    // In a real app, you might show a toast notification here
                  }
                }}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
