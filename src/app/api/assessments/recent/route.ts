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
      return NextResponse.json({ error: "Not authorized to view assessments" }, { status: 403 });
    }
    
    // Fetch recent assessments created by this HR user
    const assessments = await db.assessment.findMany({
      where: {
        createdBy: userId,
      },
      select: {
        id: true,
        title: true,
        status: true,
        candidate: {
          select: {
            id: true,
          }
        },
        questions: {
          select: {
            id: true,
            videoResponse: {
              select: { id: true }
            },
            audioResponse: {
              select: { id: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3 // Limit to 3 most recent assessments
    });
    
    // Transform the data for the frontend
    const formattedAssessments = assessments.map(assessment => {
      // Count responses received
      const responsesReceived = assessment.questions.reduce((count, question) => {
        const hasResponse = question.videoResponse !== null || question.audioResponse !== null;
        return count + (hasResponse ? 1 : 0);
      }, 0);
      
      return {
        id: assessment.id,
        title: assessment.title,
        status: assessment.status,
        candidatesInvited: assessment.candidate !== null ? 1 : 0, // If this is individual assessment
        responsesReceived
      };
    });
    
    return NextResponse.json({
      assessments: formattedAssessments
    });
  } catch (error) {
    console.error("Error fetching recent assessments:", error);
    return NextResponse.json({ error: "Failed to fetch recent assessments" }, { status: 500 });
  }
} 