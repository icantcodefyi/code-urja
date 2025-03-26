import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { AssessmentStatus } from "@prisma/client";

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
    
    // Get assessments created by this user
    const assessments = await db.assessment.findMany({
      where: { 
        createdBy: userId
      },
      include: {
        questions: {
          include: {
            videoResponses: true,
            audioResponses: true
          }
        },
        submissions: {
          include: {
            candidate: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transform the data for the frontend
    const assessmentsList = assessments.map(assessment => {
      // Find the candidate information from the first submission if available
      const submission = assessment.submissions[0];
      const candidateName = submission?.candidate?.user?.name ?? 'Unknown';
      const candidateEmail = submission?.candidate?.user?.email ?? 'unknown@example.com';
      
      // Count responses across all questions
      const responsesReceived = assessment.questions.reduce((count, question) => {
        return count + question.videoResponses.length + question.audioResponses.length;
      }, 0);
      
      return {
        id: assessment.id,
        title: assessment.title,
        description: assessment.description,
        status: submission?.status ?? AssessmentStatus.PENDING,
        uniqueLink: assessment.uniqueLink,
        createdAt: assessment.createdAt.toISOString(),
        candidateName,
        candidateEmail,
        aiAnalysisEnabled: assessment.aiAnalysisEnabled,
        maxDuration: assessment.maxDuration,
        questionCount: assessment.questions.length,
        responsesReceived
      };
    });
    
    return NextResponse.json({ assessments: assessmentsList });
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 });
  }
} 