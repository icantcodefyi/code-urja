'use client';

import { useState, useEffect } from 'react';
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

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  currentPosition: string;
  appliedPosition: string;
  appliedDate: string;
  status: string;
  score: number;
  hasVideo: boolean;
  hasAudio: boolean;
}

interface PaginationInfo {
  totalCandidates: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface CandidatesResponse {
  candidates: Candidate[];
  pagination: PaginationInfo;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Shortlisted':
    case 'SHORTLISTED': 
      return 'bg-green-100 text-green-800';
    case 'Rejected':
    case 'REJECTED': 
      return 'bg-red-100 text-red-800';
    case 'Reviewed':
    case 'REVIEWED': 
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
    case 'COMPLETED': 
      return 'bg-purple-100 text-purple-800';
    case 'In Progress':
    case 'IN_PROGRESS': 
      return 'bg-yellow-100 text-yellow-800';
    case 'Pending':
    case 'PENDING': 
      return 'bg-gray-100 text-gray-800';
    default: 
      return 'bg-gray-100 text-gray-800';
  }
};

export default function CandidatesList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalCandidates: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  
  // Fetch candidates when filters, sort, or pagination changes
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      
      try {
        // Build the query string
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (statusFilter !== 'All') params.append('status', statusFilter);
        params.append('sort', sortOrder);
        params.append('page', currentPage.toString());
        params.append('limit', pagination.limit.toString());
        
        const response = await fetch(`/api/candidates?${params.toString()}`);
        
        if (response.ok) {
          const data = await response.json() as CandidatesResponse;
          setCandidates(data.candidates);
          setPagination(data.pagination);
        } else {
          console.error('Failed to fetch candidates:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    void fetchCandidates();
  }, [searchQuery, statusFilter, sortOrder, currentPage, pagination.limit]);
  
  // Navigation handlers
  const goToNextPage = () => {
    setCurrentPage(prevPage => 
      prevPage === pagination.totalPages ? prevPage : prevPage + 1
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REVIEWED">Reviewed</SelectItem>
                  <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
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
          {loading ? (
            <div className="p-8 text-center">Loading candidates...</div>
          ) : candidates.length === 0 ? (
            <div className="p-8 text-center">No candidates found. Try adjusting your filters.</div>
          ) : candidates.map((candidate) => (
            <div key={candidate.id} className="p-3 bg-card hover:bg-muted/20 transition-colors">
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={getAvatarUrlFromName(`${candidate.firstName} ${candidate.lastName}`)}
                      size="md"
                    />
                    <div>
                      <div className="font-medium">{candidate.firstName} {candidate.lastName}</div>
                      <div className="text-sm text-muted-foreground">{candidate.email}</div>
                      <div className="text-xs text-muted-foreground mt-1">{candidate.currentPosition}</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 text-sm">{candidate.appliedPosition}</div>
                
                <div className="col-span-1 text-center">
                  {candidate.status === 'PENDING' || candidate.status === 'IN_PROGRESS' ? (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="mb-1 text-sm font-medium">{candidate.score}/100</span>
                      <Progress 
                        value={candidate.score}
                        className={`h-1.5 w-12 ${
                          candidate.score >= 80 ? "bg-green-100" :
                          candidate.score >= 60 ? "bg-yellow-100" :
                          "bg-red-100"
                        }`}
                      />
                    </div>
                  )}
                </div>
                
                <div className="col-span-2 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(candidate.status)}`}>
                    {candidate.status.replace(/_/g, ' ').toLowerCase()
                      .replace(/\b\w/g, char => char.toUpperCase())}
                  </span>
                </div>
                
                <div className="col-span-1">
                  <div className="flex space-x-1">
                    {candidate.hasVideo && (
                      <Video className="h-4 w-4 text-blue-500" />
                    )}
                    {candidate.hasAudio && (
                      <AudioLines className="h-4 w-4 text-purple-500" />
                    )}
                  </div>
                </div>
                
                <div className="col-span-2 text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon" asChild title="View Profile">
                      <Link href={`/app/candidates/${candidate.id}`}>
                        <User className="h-4 w-4" />
                      </Link>
                    </Button>
                    {candidate.status === 'COMPLETED' && (
                      <Button variant="ghost" size="icon" className="text-green-600" title="Shortlist">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {candidate.status === 'COMPLETED' && (
                      <Button variant="ghost" size="icon" className="text-red-600" title="Reject">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-gray-500" title="More Options">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{candidates.length}</span> of <span className="font-medium">{pagination.totalCandidates}</span> candidates
          </div>
          
          <Pagination>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="flex items-center mx-2">
              <span className="text-sm">Page {currentPage} of {pagination.totalPages}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextPage}
              disabled={currentPage === pagination.totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Pagination>
        </div>
      )}
    </div>
  );
}