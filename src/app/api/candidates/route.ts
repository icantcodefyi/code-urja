import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { type Prisma, AssessmentStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Check if user is HR or ADMIN
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    if (!user || (user.role !== 'HR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Not authorized to view candidates" }, { status: 403 });
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('search') ?? '';
    const statusFilter = url.searchParams.get('status') ?? 'All';
    const sortOrder = url.searchParams.get('sort') ?? 'newest';
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '10'); // Increased to 10 to match the frontend
    
    console.log("DEBUG - API parameters:", { searchQuery, statusFilter, sortOrder, page, limit });
    
    // Prepare base query - For HR users, fetch all candidates
    const whereClause: Prisma.CandidateWhereInput = {};
    
    // Add status filter only if specified
    if (statusFilter !== 'All') {
      whereClause.submissions = {
        some: {
          status: statusFilter as AssessmentStatus,
        }
      };
    }
    
    // Add search filter
    if (searchQuery) {
      whereClause.user = {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } }
        ]
      };
    }
    
    console.log("DEBUG - Database where clause:", JSON.stringify(whereClause));
    
    // Count total candidates for pagination
    const totalCandidates = await db.candidate.count({
      where: whereClause
    });
    
    console.log("DEBUG - Total candidates count:", totalCandidates);
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalCandidates / limit);
    
    // Determine sort order
    let orderBy: Prisma.CandidateOrderByWithRelationInput = {};
    if (sortOrder === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sortOrder === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sortOrder === 'highest') {
      orderBy = { analysis: { overallScore: 'desc' } };
    } else if (sortOrder === 'lowest') {
      orderBy = { analysis: { overallScore: 'asc' } };
    }
    
    // Fetch candidates with filtering, sorting and pagination
    const candidates = await db.candidate.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        submissions: {
          include: {
            assessment: {
              select: {
                id: true,
                title: true,
              }
            }
          }
        },
        analysis: true,
        videoResponses: {
          select: { id: true }
        },
        audioResponses: {
          select: { id: true }
        },
      },
      orderBy,
      skip,
      take: limit,
    });
    
    console.log("DEBUG - Raw candidates count:", candidates.length);
    console.log("DEBUG - First candidate info:", candidates[0] ? { 
      id: candidates[0].id,
      name: candidates[0].user?.name,
      submissions: candidates[0].submissions.length 
    } : "No candidates found");
    
    // Transform data to match frontend expectations
    const formattedCandidates = candidates.map(candidate => {
      const fullName = candidate.user?.name ?? '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.slice(1).join(' ') ?? '';
      
      const latestSubmission = candidate.submissions[0];
      
      return {
        id: candidate.id,
        firstName,
        lastName,
        email: candidate.user?.email ?? '',
        currentPosition: "Unknown",  // This could be added to the candidate model if needed
        appliedPosition: latestSubmission?.assessment.title ?? "Unknown",
        appliedDate: candidate.createdAt.toISOString().split('T')[0],
        status: latestSubmission?.status ?? "PENDING",
        score: candidate.analysis?.overallScore ?? 0,
        hasVideo: candidate.videoResponses.length > 0,
        hasAudio: candidate.audioResponses.length > 0,
      };
    });
    
    console.log("DEBUG - Formatted candidates count:", formattedCandidates.length);
    
    return NextResponse.json({
      candidates: formattedCandidates,
      pagination: {
        totalCandidates,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
} 