import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

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
      return NextResponse.json({ error: "Not authorized to view stats" }, { status: 403 });
    }
    
    // Get assessment stats
    const totalAssessments = await db.assessment.count({
      where: { createdBy: userId }
    });
    
    const activeAssessments = await db.assessment.count({
      where: {
        createdBy: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] }
      }
    });
    
    const completedAssessments = await db.assessment.count({
      where: {
        createdBy: userId,
        status: { in: ['COMPLETED', 'REVIEWED'] }
      }
    });
    
    // Get candidate stats
    const totalCandidates = await db.candidate.count();
    
    // Get responses stats
    const pendingResponses = await db.question.count({
      where: {
        assessment: { createdBy: userId },
        videoResponse: null,
        audioResponse: null,
      }
    });
    
    return NextResponse.json({
      totalAssessments,
      activeAssessments,
      completedAssessments,
      totalCandidates,
      pendingResponses
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
} 