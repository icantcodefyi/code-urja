'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatarr";
import { 
  Search, Filter, ChevronRight, FileText, Users, 
  Clock, Calendar, BarChart, Award, CheckCircle2
} from "lucide-react";
import { cn } from "~/lib/utils";

// Custom Badge component with variant support
const CustomBadge = ({ 
  children, 
  variant = 'default',
  className, 
  ...props 
}: React.ComponentProps<"div"> & { 
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}) => {
  return (
    <div
      className={cn(
        "w-fit px-3 text-sm py-1 rounded-lg gap-2 border font-medium",
        variant === 'secondary' && "bg-secondary text-secondary-foreground",
        variant === 'destructive' && "bg-destructive text-destructive-foreground",
        variant === 'outline' && "border-input bg-background",
        variant === 'default' && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Mock data for active assessments
const activeAssessments = [
  {
    id: "a1",
    title: "Frontend Developer Assessment",
    description: "Technical assessment for React, TypeScript, and UI/UX skills",
    status: "IN_PROGRESS",
    candidatesTotal: 12,
    candidatesCompleted: 7,
    questionsCount: 5,
    createdAt: "2023-10-05T10:00:00Z",
    expiresAt: "2023-11-05T10:00:00Z",
    averageScore: 78.5,
    highestScore: 92,
    topCandidates: [
      { name: "Jane Doe", score: 92, email: "jane@example.com" },
      { name: "John Smith", score: 88, email: "john@example.com" },
      { name: "Emily Wong", score: 85, email: "emily@example.com" },
    ]
  },
  {
    id: "a2",
    title: "Product Manager Interview",
    description: "Assessment for product vision, strategy, and execution",
    status: "IN_PROGRESS",
    candidatesTotal: 8,
    candidatesCompleted: 3,
    questionsCount: 6,
    createdAt: "2023-10-10T14:00:00Z",
    expiresAt: "2023-11-10T14:00:00Z",
    averageScore: 71.2,
    highestScore: 85,
    topCandidates: [
      { name: "David Chen", score: 85, email: "david@example.com" },
      { name: "Sarah Jackson", score: 79, email: "sarah@example.com" },
      { name: "Michael Brown", score: 76, email: "michael@example.com" },
    ]
  },
  {
    id: "a3",
    title: "Full-Stack Developer Assessment",
    description: "Comprehensive evaluation of full-stack development skills",
    status: "IN_PROGRESS",
    candidatesTotal: 15,
    candidatesCompleted: 9,
    questionsCount: 8,
    createdAt: "2023-10-01T09:00:00Z",
    expiresAt: "2023-11-01T09:00:00Z",
    averageScore: 75.8,
    highestScore: 90,
    topCandidates: [
      { name: "Alex Rivera", score: 90, email: "alex@example.com" },
      { name: "Priya Patel", score: 87, email: "priya@example.com" },
      { name: "James Wilson", score: 84, email: "james@example.com" },
    ]
  }
];

// Function to generate avatar URL using DiceBear API
const getAvatarUrl = (email: string) => {
  // Create a hash from email for consistent avatar generation
  const emailHash = btoa(email).substring(0, 10);
  
  // Using DiceBear Avatars API (https://www.dicebear.com/styles/avataaars)
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${emailHash}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

export default function ActiveAssessments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState("all");
  
  // Filter assessments based on search and tab
  const filteredAssessments = activeAssessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (tabValue === "all") return matchesSearch;
    if (tabValue === "recent") {
      // Show assessments created in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return matchesSearch && new Date(assessment.createdAt) >= sevenDaysAgo;
    }
    if (tabValue === "expiring") {
      // Show assessments expiring in the next 7 days
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      return matchesSearch && new Date(assessment.expiresAt) <= sevenDaysFromNow;
    }
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Active Assessments</h1>
        <p className="text-muted-foreground">Monitor and manage your ongoing candidate assessments</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find assessments by title or description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Status: Active</span>
            </div>
            
            <div className="flex justify-end">
              <Button>
                Create Assessment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={tabValue} onValueChange={setTabValue} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Active</TabsTrigger>
          <TabsTrigger value="recent">Recently Created</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssessments.length > 0 ? (
          filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{assessment.title}</CardTitle>
                    <CardDescription className="mt-1">{assessment.description}</CardDescription>
                  </div>
                  <CustomBadge variant="secondary" className="ml-2">
                    {assessment.status === "IN_PROGRESS" ? "In Progress" : assessment.status}
                  </CustomBadge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 pb-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center">
                    <Users className="h-5 w-5 text-muted-foreground mb-1" />
                    <div className="text-xl font-semibold">
                      {assessment.candidatesCompleted}/{assessment.candidatesTotal}
                    </div>
                    <div className="text-xs text-muted-foreground">Candidates</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <FileText className="h-5 w-5 text-muted-foreground mb-1" />
                    <div className="text-xl font-semibold">
                      {assessment.questionsCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Questions</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mb-1" />
                    <div className="text-xl font-semibold">
                      {Math.floor((new Date(assessment.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-xs text-muted-foreground">Days Left</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <BarChart className="h-5 w-5 text-muted-foreground mb-1" />
                    <div className="text-xl font-semibold">
                      {assessment.averageScore.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Avg. Score</div>
                  </div>
                </div>
                
                <div className="border-t pt-4 pb-2">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    Top Performing Candidates
                  </h4>
                  
                  <div className="space-y-2">
                    {assessment.topCandidates.map((candidate, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={getAvatarUrl(candidate.email)} alt={candidate.name} />
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{candidate.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{candidate.score}%</span>
                          {index === 0 && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2 pb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Created {assessment.createdAt ? new Date(assessment.createdAt).toISOString().split('T')[0].replace(/-/g, '/') : 'N/A'}
                  </span>
                </div>
                
                <Button variant="outline" size="sm" className="gap-1">
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No active assessments found</h3>
            <p className="text-muted-foreground mb-4">Create your first assessment to start evaluating candidates</p>
            <Button>Create Assessment</Button>
          </div>
        )}
      </div>
    </div>
  );
}
