"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Search,
  Filter,
  Clock,
  PlusCircle,
  Copy,
  ExternalLink,
  SlidersHorizontal,
  Hourglass,
  CircleCheck,
} from "lucide-react";
import { cn } from "~/lib/utils";
import Link from 'next/link';
import Badge from "~/components/ui/badgee";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "~/components/ui/table";

interface Assessment {
  id: string;
  title: string;
  description: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED';
  uniqueLink: string;
  createdAt: string;
  candidateName: string;
  candidateEmail: string;
  aiAnalysisEnabled: boolean;
  maxDuration: number | null;
  questionCount: number;
  responsesReceived: number;
}

// Custom Badge component with variant support
const CustomBadge = ({
  children,
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "secondary" | "outline" | "destructive";
}) => {
  return (
    <div
      className={cn(
        "w-fit gap-2 rounded-lg border px-3 py-1 text-sm font-medium",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        variant === "destructive" &&
          "bg-destructive text-destructive-foreground",
        variant === "outline" && "border-input bg-background",
        variant === "default" && "bg-primary text-primary-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default function ActiveAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState("all");

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('/api/assessments/list');
        
        if (response.ok) {
          const data = await response.json();
          setAssessments(data.assessments);
        } else {
          console.error('Failed to fetch assessments');
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    void fetchAssessments();
  }, []);
  
  // Filter assessments based on search and tab
  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase());

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
      return (
        matchesSearch && new Date(assessment.createdAt) <= sevenDaysFromNow
      );
    }
    return matchesSearch;
  });

  // Get status badge
  const getStatusBadge = (status: Assessment['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">
            <Hourglass className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            <CircleCheck className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'REVIEWED':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200">
            <CircleCheck className="h-3 w-3 mr-1" />
            Reviewed
          </Badge>
        );
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Copy assessment link to clipboard
  const copyAssessmentLink = (uniqueLink: string) => {
    const link = `${window.location.origin}/assessments/${uniqueLink}`;
    void navigator.clipboard.writeText(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-[1200px] space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Active Assessments</h1>
          <p className="text-muted-foreground text-lg">
            Monitor and manage your ongoing candidate assessments
          </p>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">Search & Filter</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Find assessments by title, description, or candidate information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assessments..."
                  className="pl-10 w-full bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-3 bg-muted/30 rounded-lg px-4 py-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status: Active</span>
              </div>

              <div className="flex justify-end">
                <Button asChild size="lg" className="w-full md:w-auto">
                  <Link href="/app/assessments/create">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Create Assessment
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="all">All Active</TabsTrigger>
              <TabsTrigger value="recent">Recently Created</TabsTrigger>
              <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <Card>
              <CardContent className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading assessments...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredAssessments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No assessments found</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  Try adjusting your search or filter criteria to find what you&apos;re looking for
                </p>
                <Button asChild size="lg" className="mt-4">
                  <Link href="/app/assessments/create">Create New Assessment</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-hidden rounded-lg border bg-card">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="font-semibold w-[30%]">Assessment</TableHead>
                      <TableHead className="font-semibold w-[15%]">Status</TableHead>
                      <TableHead className="font-semibold w-[15%]">Created</TableHead>
                      <TableHead className="font-semibold w-[20%]">Candidate</TableHead>
                      <TableHead className="font-semibold w-[10%]">Responses</TableHead>
                      <TableHead className="text-right font-semibold w-[10%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssessments.map((assessment) => (
                      <TableRow key={assessment.id} className="hover:bg-muted/50">
                        <TableCell className="max-w-[300px]">
                          <div className="space-y-1">
                            <div className="font-medium truncate">{assessment.title}</div>
                            {assessment.description && (
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {assessment.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatDate(assessment.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 max-w-[200px]">
                            <div className="font-medium truncate">{assessment.candidateName}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {assessment.candidateEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted/50">
                            <span className="font-medium">{assessment.responsesReceived}</span>
                            <span className="text-muted-foreground mx-1">/</span>
                            <span className="font-medium">{assessment.questionCount}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyAssessmentLink(assessment.uniqueLink)}
                              className="hover:bg-muted"
                              title="Copy Assessment Link"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-muted"
                              title="View Assessment"
                              asChild
                            >
                              <Link href={`/assessments/${assessment.uniqueLink}`} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-muted"
                              title="View Details"
                              asChild
                            >
                              <Link href={`/app/assessments/${assessment.id}`}>
                                <span className="sr-only">View Details</span>
                                <SlidersHorizontal className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
