'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { FileText, Users, Video, ChevronRight, CircleCheck, Clock, Hourglass } from "lucide-react";
import Link from 'next/link';

interface DashboardStats {
  totalAssessments: number;
  activeAssessments: number;
  completedAssessments: number;
  totalCandidates: number;
  pendingResponses: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssessments: 0,
    activeAssessments: 0,
    completedAssessments: 0,
    totalCandidates: 0,
    pendingResponses: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    void fetchStats();
  }, []);
  
  // For demo purposes, simulate some data if the API isn't ready yet
  useEffect(() => {
    if (loading) {
      // Simulate API response after 1 second for demo
      const timer = setTimeout(() => {
        setStats({
          totalAssessments: 8,
          activeAssessments: 5,
          completedAssessments: 3,
          totalCandidates: 12,
          pendingResponses: 7
        });
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your HR assessment platform</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssessments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeAssessments} active, {stats.completedAssessments} completed
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" className="w-full" size="sm">
              <Link href="/app/assessments/active" className="flex items-center justify-between">
                <span>View all assessments</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingResponses} waiting for responses
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" className="w-full" size="sm">
              <Link href="/app/candidates" className="flex items-center justify-between">
                <span>Manage candidates</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Responses</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingResponses}</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" className="w-full" size="sm">
              <Link href="/app/media" className="flex items-center justify-between">
                <span>Review responses</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Assessments</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader className="py-4">
              <div className="flex justify-between items-center">
                <CardTitle>Frontend Developer Skills Assessment</CardTitle>
                <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  <Clock className="h-3 w-3" />
                  <span>In Progress</span>
                </div>
              </div>
              <CardDescription>
                5 candidates invited • 3 responses received
              </CardDescription>
            </CardHeader>
            <CardFooter className="py-3 border-t">
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/assessments/active">View Details</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <div className="flex justify-between items-center">
                <CardTitle>Product Manager Interview</CardTitle>
                <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  <Hourglass className="h-3 w-3" />
                  <span>Pending</span>
                </div>
              </div>
              <CardDescription>
                2 candidates invited • 0 responses received
              </CardDescription>
            </CardHeader>
            <CardFooter className="py-3 border-t">
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/assessments/active">View Details</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <div className="flex justify-between items-center">
                <CardTitle>UX Designer Technical Assessment</CardTitle>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  <CircleCheck className="h-3 w-3" />
                  <span>Completed</span>
                </div>
              </div>
              <CardDescription>
                3 candidates invited • 3 responses received
              </CardDescription>
            </CardHeader>
            <CardFooter className="py-3 border-t">
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/assessments/active">View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button asChild>
          <Link href="/app/assessments/create">Create New Assessment</Link>
        </Button>
      </div>
    </div>
  );
} 