"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Users,
  Clock,
  Video,
  AudioLines,
  AlignLeft,
  Link as LinkIcon,
  Copy,
  Edit,
  Download,
  CircleCheck,
  Hourglass,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";

interface AssessmentDetail {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  maxDuration?: number;
  passingScore?: number;
  aiAnalysisEnabled: boolean;
  uniqueLink: string;
  status: string;
  questionCount: number;
  candidatesInvited: number;
  responsesReceived: number;
}

interface Question {
  id: string;
  text: string;
  type: "VIDEO" | "AUDIO" | "TEXT";
  order: number;
}

interface Submission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  status: string;
  startedAt: string;
  completedAt?: string;
}

interface AssessmentApiResponse {
  assessment: AssessmentDetail;
  questions: Question[];
  submissions: Submission[];
}

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAssessmentDetails = async () => {
      try {
        // In a real implementation, you'd fetch from your API
        const response = await fetch(`/api/assessments/${id}`);

        if (response.ok) {
          const data = (await response.json()) as AssessmentApiResponse;
          setAssessment(data.assessment);
          setQuestions(data.questions ?? []);
          setSubmissions(data.submissions ?? []);
        } else {
          // For demo purposes, using placeholder data
          setAssessment({
            id,
            title: "Frontend Developer Assessment",
            description:
              "Skills assessment for frontend developer role with focus on React and TypeScript",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            maxDuration: 60,
            passingScore: 70,
            aiAnalysisEnabled: true,
            uniqueLink: `assessment-${id}`,
            status: "IN_PROGRESS",
            questionCount: 5,
            candidatesInvited: 8,
            responsesReceived: 3,
          });

          setQuestions([
            {
              id: "q1",
              text: "Describe your experience with React",
              type: "VIDEO",
              order: 1,
            },
            {
              id: "q2",
              text: "How would you optimize a web application?",
              type: "AUDIO",
              order: 2,
            },
            {
              id: "q3",
              text: "What are your strengths as a developer?",
              type: "TEXT",
              order: 3,
            },
            {
              id: "q4",
              text: "Explain your approach to responsive design",
              type: "VIDEO",
              order: 4,
            },
            {
              id: "q5",
              text: "Describe a challenging project",
              type: "TEXT",
              order: 5,
            },
          ]);

          setSubmissions([
            {
              id: "sub1",
              candidateName: "Jane Smith",
              candidateEmail: "jane@example.com",
              status: "COMPLETED",
              startedAt: "2023-06-15T14:00:00Z",
              completedAt: "2023-06-15T14:45:00Z",
            },
            {
              id: "sub2",
              candidateName: "John Doe",
              candidateEmail: "john@example.com",
              status: "IN_PROGRESS",
              startedAt: "2023-06-16T10:30:00Z",
            },
            {
              id: "sub3",
              candidateName: "Alice Johnson",
              candidateEmail: "alice@example.com",
              status: "PENDING",
              startedAt: "2023-06-14T09:15:00Z",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching assessment details:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchAssessmentDetails();
  }, [id]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "REVIEWED":
        return {
          label: "Completed",
          icon: <CircleCheck className="h-3 w-3" />,
          className: "bg-green-100 text-green-700",
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          icon: <Clock className="h-3 w-3" />,
          className: "bg-primary/10 text-primary",
        };
      case "PENDING":
      default:
        return {
          label: "Pending",
          icon: <Hourglass className="h-3 w-3" />,
          className: "bg-primary/10 text-primary",
        };
    }
  };

  const copyAssessmentLink = () => {
    if (!assessment) return;

    const link = `${window.location.origin}/assessment/${assessment.uniqueLink}`;
    void navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "AUDIO":
        return <AudioLines className="h-4 w-4 text-purple-500" />;
      case "TEXT":
        return <AlignLeft className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading assessment details...</div>;
  }

  if (!assessment) {
    return (
      <div className="p-6 text-center">
        <h2 className="mb-4 text-xl font-semibold">Assessment not found</h2>
        <Button asChild>
          <Link href="/app/assessments">Back to Assessments</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <h1 className="text-2xl font-bold">{assessment.title}</h1>

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusDisplay(assessment.status).icon}
              <span className="text-lg font-medium">
                {getStatusDisplay(assessment.status).label}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground h-4 w-4" />
              <span className="text-lg font-medium">
                {assessment.candidatesInvited} invited
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              {assessment.responsesReceived} responses received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span className="text-lg font-medium">
                {assessment.maxDuration
                  ? `${assessment.maxDuration} minutes`
                  : "No time limit"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assessment Link</CardTitle>
          <CardDescription>
            Share this link with candidates to complete the assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="bg-muted flex-1 truncate rounded-l-md p-2">
              <code className="text-sm">
                {window.location.origin}/assessment/{assessment.uniqueLink}
              </code>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-l-none"
              onClick={copyAssessmentLink}
            >
              {copied ? (
                <CircleCheck className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="questions" className="mb-6">
        <TabsList>
          <TabsTrigger value="questions">
            <FileText className="mr-2 h-4 w-4" />
            Questions ({questions.length})
          </TabsTrigger>
          <TabsTrigger value="submissions">
            <Users className="mr-2 h-4 w-4" />
            Submissions ({submissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Assessment Questions</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/app/assessments/${id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Questions
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center">
                  No questions added to this assessment yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div key={question.id} className="rounded-md border p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getQuestionTypeIcon(question.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{question.text}</p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            Question {question.order} •{" "}
                            {question.type.charAt(0) +
                              question.type.slice(1).toLowerCase()}{" "}
                            Response
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Candidate Submissions</CardTitle>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center">
                  No submissions received yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => {
                    const status = getStatusDisplay(submission.status);
                    return (
                      <div
                        key={submission.id}
                        className="rounded-md border p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">
                              {submission.candidateName}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {submission.candidateEmail}
                            </p>
                          </div>
                          <div
                            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${status.className}`}
                          >
                            {status.icon}
                            <span>{status.label}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-muted-foreground text-xs">
                            Started:{" "}
                            {new Date(submission.startedAt).toLocaleString()}
                            {submission.completedAt &&
                              ` • Completed: ${new Date(submission.completedAt).toLocaleString()}`}
                          </div>
                          {submission.status === "COMPLETED" && (
                            <Button size="sm" asChild>
                              <Link href={`/app/submissions/${submission.id}`}>
                                View Responses
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" asChild>
          <Link href={`/app/assessments/${id}/invite`}>
            <Users className="mr-2 h-4 w-4" />
            Invite Candidates
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/app/assessments/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Assessment
          </Link>
        </Button>
      </div>
    </div>
  );
}
