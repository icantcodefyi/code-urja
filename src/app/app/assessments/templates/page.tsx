'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  SearchIcon, PlusCircle, Copy, FileText, Users, Clock
} from "lucide-react";
import Link from 'next/link';

interface AssessmentTemplate {
  id: string;
  title: string;
  description: string | null;
  questionCount: number;
  maxDuration: number | null;
  createdAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<AssessmentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/assessments/templates');
        
        if (response.ok) {
          const data = await response.json();
          setTemplates(data.templates);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    void fetchTemplates();
  }, []);
  
  // For demo purposes, simulate some data if the API isn't ready yet
  useEffect(() => {
    if (loading) {
      // Simulate API response after 1 second for demo
      const timer = setTimeout(() => {
        setTemplates([
          {
            id: '1',
            title: 'Frontend Developer Assessment Template',
            description: 'A comprehensive assessment for evaluating frontend development skills',
            questionCount: 10,
            maxDuration: 60,
            createdAt: '2023-09-15T10:00:00Z'
          },
          {
            id: '2',
            title: 'Behavioral Interview Template',
            description: 'Standard behavioral questions for all roles',
            questionCount: 8,
            maxDuration: 45,
            createdAt: '2023-09-20T14:30:00Z'
          },
          {
            id: '3',
            title: 'Product Manager Skills Assessment',
            description: 'Template for evaluating product management skills and experience',
            questionCount: 12,
            maxDuration: 90,
            createdAt: '2023-10-05T09:15:00Z'
          }
        ]);
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // Filter templates based on search query
  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Assessment Templates</h1>
          <p className="text-muted-foreground">Reuse your assessments with templates</p>
        </div>
        
        <Button asChild>
          <Link href="/app/assessments/create">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Template
          </Link>
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading templates...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first template by saving an assessment as a template
            </p>
            <Button asChild>
              <Link href="/app/assessments/create">Create Assessment</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{template.questionCount} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{template.maxDuration} Minutes</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <span className="text-xs text-muted-foreground">
                  Created {formatDate(template.createdAt)}
                </span>
                <Button size="sm">
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
