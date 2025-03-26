'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Progress } from "~/components/ui/progress";
import { 
  BarChart2, Users, CheckCircle, XCircle, Clock, Video, AudioLines, 
  FileText, ChevronUp, ChevronDown, Bell, Download
} from "lucide-react";
import { getAvatarUrl } from "~/utils/avatar";

// Mock analytics data
const analyticsData = {
  overview: {
    totalCandidates: 42,
    assessmentsCompleted: 36,
    averageScore: 78,
    shortlisted: 12,
    rejected: 8,
    pendingReview: 16,
    averageCompletionTime: 42, // minutes
  },
  performanceBySkill: [
    { skill: "React", average: 82 },
    { skill: "TypeScript", average: 76 },
    { skill: "CSS", average: 68 },
    { skill: "Node.js", average: 72 },
    { skill: "Testing", average: 65 },
  ],
  responseTypes: {
    video: 28,
    audio: 34,
    text: 42,
  },
  candidateDistribution: {
    shortlisted: 12,
    underReview: 16,
    rejected: 8,
    inProgress: 6,
  },
  recentActivity: [
    {
      id: "a1",
      type: "completed",
      candidateName: "John Doe",
      position: "Lead Frontend Developer",
      time: "2 hours ago",
      score: 87,
    },
    {
      id: "a2",
      type: "shortlisted",
      candidateName: "Emily Brown",
      position: "Lead Frontend Developer",
      time: "5 hours ago",
      score: 95,
    },
    {
      id: "a3",
      type: "rejected",
      candidateName: "David Wilson",
      position: "Lead Frontend Developer",
      time: "6 hours ago",
      score: 65,
    },
    {
      id: "a4",
      type: "started",
      candidateName: "Sarah Miller",
      position: "Lead Frontend Developer",
      time: "1 day ago",
      score: null,
    },
  ],
  monthlyCandidates: [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 8 },
    { month: "Mar", count: 15 },
    { month: "Apr", count: 10 },
    { month: "May", count: 8 },
    { month: "Jun", count: 12 },
    { month: "Jul", count: 18 },
    { month: "Aug", count: 22 },
    { month: "Sep", count: 28 },
    { month: "Oct", count: 42 },
    { month: "Nov", count: 0 },
    { month: "Dec", count: 0 },
  ],
  scoreDistribution: {
    "90-100": 8,
    "80-89": 14,
    "70-79": 6,
    "60-69": 4,
    "Below 60": 4,
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'completed':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'shortlisted':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'started':
      return <Bell className="h-4 w-4 text-yellow-500" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function AnalyticsDashboard() {
  // Calculate the maximum value for the monthly chart
  const maxMonthlyCandidates = Math.max(...analyticsData.monthlyCandidates.map(item => item.count));
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Overview of assessment performance and candidate metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Candidates</p>
                <div className="text-2xl font-bold">{analyticsData.overview.totalCandidates}</div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-green-600">
              <ChevronUp className="h-3.5 w-3.5" />
              <span>21% increase</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Score</p>
                <div className="text-2xl font-bold">{analyticsData.overview.averageScore}%</div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-red-600">
              <ChevronDown className="h-3.5 w-3.5" />
              <span>3% decrease</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Shortlisted</p>
                <div className="text-2xl font-bold">{analyticsData.overview.shortlisted}</div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <span className="font-medium">{Math.round((analyticsData.overview.shortlisted / analyticsData.overview.totalCandidates) * 100)}%</span> of total candidates
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Completion Time</p>
                <div className="text-2xl font-bold">{analyticsData.overview.averageCompletionTime} min</div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-green-600">
              <ChevronUp className="h-3.5 w-3.5" />
              <span>8% improvement</span>
              <span className="text-muted-foreground ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Response types and candidate distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Response Types</CardTitle>
            <CardDescription>Distribution of response types across assessments</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-blue-500" />
                    <span>Video Responses</span>
                  </div>
                  <span className="font-medium">{analyticsData.responseTypes.video}</span>
                </div>
                <Progress value={(analyticsData.responseTypes.video / (analyticsData.responseTypes.video + analyticsData.responseTypes.audio + analyticsData.responseTypes.text)) * 100} className="h-2 bg-muted" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <AudioLines className="h-4 w-4 text-purple-500" />
                    <span>Audio Responses</span>
                  </div>
                  <span className="font-medium">{analyticsData.responseTypes.audio}</span>
                </div>
                <Progress value={(analyticsData.responseTypes.audio / (analyticsData.responseTypes.video + analyticsData.responseTypes.audio + analyticsData.responseTypes.text)) * 100} className="h-2 bg-muted" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <span>Text Responses</span>
                  </div>
                  <span className="font-medium">{analyticsData.responseTypes.text}</span>
                </div>
                <Progress value={(analyticsData.responseTypes.text / (analyticsData.responseTypes.video + analyticsData.responseTypes.audio + analyticsData.responseTypes.text)) * 100} className="h-2 bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Candidate Distribution</CardTitle>
            <CardDescription>Current status of all candidates</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-green-50">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-xl font-bold">{analyticsData.candidateDistribution.shortlisted}</div>
                <div className="text-sm text-muted-foreground">Shortlisted</div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-blue-50">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-xl font-bold">{analyticsData.candidateDistribution.underReview}</div>
                <div className="text-sm text-muted-foreground">Under Review</div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-red-50">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-xl font-bold">{analyticsData.candidateDistribution.rejected}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-yellow-50">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-xl font-bold">{analyticsData.candidateDistribution.inProgress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance by skill and monthly candidates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance by Skill</CardTitle>
            <CardDescription>Average scores by skill category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.performanceBySkill.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{skill.skill}</span>
                    <span className="font-medium">{skill.average}%</span>
                  </div>
                  <Progress 
                    value={skill.average} 
                    className={`h-2 ${
                      skill.average >= 80 ? 'bg-green-100' :
                      skill.average >= 70 ? 'bg-blue-100' :
                      skill.average >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                    }`} 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Candidates</CardTitle>
            <CardDescription>Number of candidates per month in 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] flex items-end justify-between">
              {analyticsData.monthlyCandidates.map((month, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-primary/80 rounded-t-sm"
                    style={{
                      height: month.count > 0 
                        ? `${(month.count / maxMonthlyCandidates) * 180}px` 
                        : '0px'
                    }}
                  ></div>
                  <div className="text-xs mt-2 text-muted-foreground">{month.month}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest candidate assessment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img 
                      src={getAvatarUrl(activity.id, activity.candidateName)}
                      alt={activity.candidateName}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{activity.candidateName}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {activity.type === 'completed' && 'Completed assessment with '}
                      {activity.type === 'shortlisted' && 'Shortlisted for '}
                      {activity.type === 'rejected' && 'Rejected for '}
                      {activity.type === 'started' && 'Started assessment for '}
                      <span className="font-medium">{activity.position}</span>
                      {activity.score && ` - Score: ${activity.score}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Candidate scores breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analyticsData.scoreDistribution).map(([range, count], index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{range}%</span>
                    <span className="font-medium">{count} candidates</span>
                  </div>
                  <Progress 
                    value={(count / analyticsData.overview.assessmentsCompleted) * 100} 
                    className={`h-2 ${
                      range === '90-100' ? 'bg-green-500' :
                      range === '80-89' ? 'bg-blue-500' :
                      range === '70-79' ? 'bg-yellow-500' :
                      range === '60-69' ? 'bg-orange-500' : 'bg-red-500'
                    }`} 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 