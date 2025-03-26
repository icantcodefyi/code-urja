'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  Search, Plus, Copy, Trash2, Edit, FileQuestion, 
  Video, AudioLines, AlignLeft, Calendar, Clock
} from "lucide-react";
import { cn } from "~/lib/utils";

// Mock template data
const templateData = [
  {
    id: "t1",
    name: "Frontend Developer Interview",
    description: "Comprehensive assessment for React, TypeScript, and UI/UX skills",
    questionCount: 5,
    questionTypes: ['VIDEO', 'AUDIO', 'VIDEO', 'AUDIO', 'VIDEO'],
    duration: 45, // minutes
    createdAt: "2023-09-15T10:00:00Z",
    usage: 12, // times used
  },
  {
    id: "t2",
    name: "Product Manager Assessment",
    description: "Evaluate product vision, strategy, and execution skills",
    questionCount: 6,
    questionTypes: ['VIDEO', 'AUDIO', 'VIDEO', 'TEXT', 'VIDEO', 'AUDIO'],
    duration: 60, // minutes
    createdAt: "2023-09-20T14:30:00Z",
    usage: 8, // times used
  },
  {
    id: "t3",
    name: "Full-Stack Developer Evaluation",
    description: "Technical assessment covering frontend, backend, and DevOps concepts",
    questionCount: 8,
    questionTypes: ['VIDEO', 'AUDIO', 'VIDEO', 'TEXT', 'VIDEO', 'AUDIO', 'VIDEO', 'AUDIO'],
    duration: 75, // minutes
    createdAt: "2023-09-10T09:15:00Z",
    usage: 15, // times used
  },
  {
    id: "t4",
    name: "UX Designer Interview",
    description: "Assessment for user experience design principles and portfolio discussion",
    questionCount: 4,
    questionTypes: ['VIDEO', 'AUDIO', 'VIDEO', 'VIDEO'],
    duration: 40, // minutes
    createdAt: "2023-09-25T11:30:00Z",
    usage: 6, // times used
  },
  {
    id: "t5",
    name: "Data Scientist Evaluation",
    description: "Technical assessment for data science, machine learning, and statistical analysis",
    questionCount: 7,
    questionTypes: ['VIDEO', 'AUDIO', 'TEXT', 'AUDIO', 'VIDEO', 'AUDIO', 'TEXT'],
    duration: 65, // minutes
    createdAt: "2023-09-05T16:45:00Z",
    usage: 10, // times used
  },
  {
    id: "t6",
    name: "Marketing Specialist Assessment",
    description: "Evaluate digital marketing, content creation, and campaign planning skills",
    questionCount: 5,
    questionTypes: ['VIDEO', 'AUDIO', 'TEXT', 'VIDEO', 'AUDIO'],
    duration: 50, // minutes
    createdAt: "2023-09-18T13:20:00Z",
    usage: 7, // times used
  }
];

export default function AssessmentTemplates() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter templates by search query
  const filteredTemplates = templateData.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Function to count question types
  const countQuestionTypes = (types: string[]) => {
    const counts = {
      VIDEO: 0,
      AUDIO: 0,
      TEXT: 0
    };
    
    types.forEach(type => {
      counts[type as keyof typeof counts]++;
    });
    
    return counts;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assessment Templates</h1>
        <p className="text-muted-foreground">Create and manage reusable assessment templates</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="relative w-full md:w-auto md:min-w-[320px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => {
            const questionCounts = countQuestionTypes(template.questionTypes);
            
            return (
              <Card key={template.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{template.name}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </div>
                    <FileQuestion className="h-5 w-5 text-primary shrink-0 mt-1" />
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="border rounded-md p-2 flex flex-col items-center justify-center">
                      <div className="text-xl font-semibold">{template.questionCount}</div>
                      <div className="text-xs text-muted-foreground">Questions</div>
                    </div>
                    
                    <div className="border rounded-md p-2 flex flex-col items-center justify-center">
                      <div className="text-xl font-semibold">{template.duration} min</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{questionCounts.VIDEO} video</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <AudioLines className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{questionCounts.AUDIO} audio</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <AlignLeft className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{questionCounts.TEXT} text</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Created {new Date(template.createdAt).toISOString().split('T')[0]}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Used {template.usage} times</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Use
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg">
            <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "Try a different search term" 
                : "Create your first assessment template to speed up your workflow"}
            </p>
            {searchQuery ? (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            ) : (
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Create Template
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
