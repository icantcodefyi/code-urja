'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Progress } from "~/components/ui/progress";
import { Pagination } from "~/components/ui/pagination"; 
import { 
  User, Search, Filter, ArrowDownUp, MoreHorizontal, CheckCircle, 
  XCircle, DownloadCloud, Video, AudioLines, ChevronLeft, ChevronRight, ArrowLeftRight
} from "lucide-react";
import { getAvatarUrlFromName } from "~/utils/avatar";
import Link from "next/link";
import Avatar from "~/components/ui/avatar";

// Mock data for candidates
const candidatesData = [
  {
    id: "c123",
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    currentPosition: "Senior Frontend Developer",
    appliedPosition: "Lead Frontend Developer",
    appliedDate: "2023-10-15",
    status: "Reviewed",
    score: 87,
    hasVideo: true,
    hasAudio: true,
  },
  {
    id: "c124",
    firstName: "Jane",
    lastName: "Smith",
    email: "janesmith@example.com",
    currentPosition: "Full Stack Developer",
    appliedPosition: "Lead Frontend Developer",
    appliedDate: "2023-10-16",
    status: "Completed",
    score: 92,
    hasVideo: true,
    hasAudio: true,
  },
  {
    id: "c125",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michaelj@example.com",
    currentPosition: "UI/UX Designer",
    appliedPosition: "Lead Frontend Developer",
    appliedDate: "2023-10-17",
    status: "In Progress",
    score: 0,
    hasVideo: false,
    hasAudio: false,
  },
  {
    id: "c126",
    firstName: "Emily",
    lastName: "Brown",
    email: "emilyb@example.com",
    currentPosition: "React Developer",
    appliedPosition: "Lead Frontend Developer",
    appliedDate: "2023-10-18",
    status: "Shortlisted",
    score: 95,
    hasVideo: true,
    hasAudio: true,
  },
  {
    id: "c127",
    firstName: "David",
    lastName: "Wilson",
    email: "davidw@example.com",
    currentPosition: "Frontend Engineer",
    appliedPosition: "Lead Frontend Developer",
    appliedDate: "2023-10-19",
    status: "Rejected",
    score: 65,
    hasVideo: true,
    hasAudio: false,
  },
  {
    id: "c128",
    firstName: "Sarah",
    lastName: "Miller",
    email: "sarahm@example.com",
    currentPosition: "JavaScript Developer",
    appliedPosition: "Lead Frontend Developer",
    appliedDate: "2023-10-20",
    status: "Pending",
    score: 0,
    hasVideo: false,
    hasAudio: false,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Shortlisted': return 'bg-green-100 text-green-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    case 'Reviewed': return 'bg-blue-100 text-blue-800';
    case 'Completed': return 'bg-purple-100 text-purple-800';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800';
    case 'Pending': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function CandidatesList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 4;
  
  // Filter and sort candidates
  const filteredCandidates = candidatesData.filter(candidate => {
    const matchesSearch = 
      candidate.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.currentPosition.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const dateA = new Date(a.appliedDate).getTime();
    const dateB = new Date(b.appliedDate).getTime();
    
    if (sortOrder === 'newest') {
      return dateB - dateA;
    } else if (sortOrder === 'oldest') {
      return dateA - dateB;
    } else if (sortOrder === 'highest') {
      return b.score - a.score;
    } else {
      return a.score - b.score;
    }
  });

  // Calculate pagination
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);

  // Navigation handlers
  const goToNextPage = () => {
    setCurrentPage(prevPage => 
      prevPage === totalPages ? prevPage : prevPage + 1
    );
  };

  const goToPrevPage = () => {
    setCurrentPage(prevPage => 
      prevPage === 1 ? prevPage : prevPage - 1
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Candidates</h1>
        <p className="text-muted-foreground">Manage and review job applicants</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Candidate Search & Filter</CardTitle>
          <CardDescription>Find candidates based on various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Reviewed">Reviewed</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={sortOrder} 
                onValueChange={setSortOrder}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Score</SelectItem>
                  <SelectItem value="lowest">Lowest Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="md:justify-self-end">Advanced Filters</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-md border overflow-hidden">
        <div className="bg-muted/50 p-3">
          <div className="grid grid-cols-12 gap-3 text-sm font-medium">
            <div className="col-span-4">Candidate</div>
            <div className="col-span-2">Applied Position</div>
            <div className="col-span-1 text-center">Score</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1">Media</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
        </div>
        
        <div className="divide-y">
          {currentCandidates.map((candidate) => (
            <div key={candidate.id} className="p-3 bg-card hover:bg-muted/20 transition-colors">
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={getAvatarUrlFromName(candidate.id, candidate.firstName, candidate.lastName)} 
                      size="sm"
                    />
                    <div>
                      <Link href={`/app/candidates/${candidate.id}`}>
                        <div className="font-medium hover:text-primary hover:underline">{candidate.firstName} {candidate.lastName}</div>
                      </Link>
                      <div className="text-sm text-muted-foreground">{candidate.email}</div>
                      <div className="text-xs text-muted-foreground">{candidate.currentPosition}</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="text-sm">{candidate.appliedPosition}</div>
                  <div className="text-xs text-muted-foreground">Applied {new Date(candidate.appliedDate).toLocaleDateString('en-GB')}</div>
                </div>
                
                <div className="col-span-1 text-center">
                  {candidate.score > 0 ? (
                    <div className="inline-flex flex-col items-center">
                      <span className={`text-sm font-medium ${candidate.score >= 80 ? 'text-green-600' : candidate.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {candidate.score}%
                      </span>
                      <Progress
                        value={candidate.score}
                        className="h-1 w-12"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Pending</span>
                  )}
                </div>
                
                <div className="col-span-2 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                    {candidate.status === 'Shortlisted' && <CheckCircle className="mr-1 h-3 w-3" />}
                    {candidate.status === 'Rejected' && <XCircle className="mr-1 h-3 w-3" />}
                    {candidate.status}
                  </span>
                </div>
                
                <div className="col-span-1">
                  <div className="flex items-center gap-1">
                    {candidate.hasVideo && (
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <Video className="h-3 w-3 text-blue-600" />
                      </div>
                    )}
                    {candidate.hasAudio && (
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                        <AudioLines className="h-3 w-3 text-purple-600" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/app/candidates/${candidate.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination and navigation */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {indexOfFirstCandidate + 1} to {Math.min(indexOfLastCandidate, filteredCandidates.length)} of {filteredCandidates.length} candidates
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPrevPage} 
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium mx-2">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}