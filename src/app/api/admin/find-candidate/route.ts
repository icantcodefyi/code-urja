import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { type Prisma } from "@prisma/client";

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
      return NextResponse.json({ error: "Not authorized to use admin functions" }, { status: 403 });
    }
    
    // Get search parameters
    const url = new URL(req.url);
    const name = url.searchParams.get('name') ?? '';
    const email = url.searchParams.get('email') ?? '';
    
    if (!name && !email) {
      return NextResponse.json({ error: "Either name or email is required" }, { status: 400 });
    }
    
    // Prepare where clause for user search
    const userCondition: Prisma.UserWhereInput = {};
    
    if (name) {
      userCondition.name = {
        contains: name,
        mode: 'insensitive'
      };
    }
    
    if (email) {
      userCondition.email = {
        contains: email,
        mode: 'insensitive'
      };
    }
    
    // Find candidates matching the search criteria
    const candidates = await db.candidate.findMany({
      where: {
        user: userCondition
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        assessments: {
          select: {
            id: true,
            title: true,
            status: true,
          }
        },
        analysis: {
          select: {
            id: true,
            overallScore: true,
            createdAt: true,
          }
        },
      },
    });
    
    if (candidates.length === 0) {
      return NextResponse.json({ message: "No candidates found", candidates: [] });
    }
    
    // Format the response
    const formattedCandidates = candidates.map(candidate => ({
      id: candidate.id,
      userId: candidate.userId,
      name: candidate.user?.name ?? 'Unknown',
      email: candidate.user?.email ?? 'Unknown',
      hasAnalysis: !!candidate.analysis,
      analysisScore: candidate.analysis?.overallScore ?? null,
      assessments: candidate.assessments.map(a => ({
        id: a.id,
        title: a.title,
        status: a.status,
      })),
      createdAt: candidate.createdAt,
    }));
    
    return NextResponse.json({
      message: `Found ${candidates.length} candidate(s)`,
      candidates: formattedCandidates,
    });
  } catch (error) {
    console.error("Error finding candidate:", error);
    return NextResponse.json({ error: "Failed to find candidate" }, { status: 500 });
  }
} 