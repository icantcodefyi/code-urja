import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    const candidateId = params.id;
    
    if (!candidateId) {
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 });
    }
    
    // Check if user is HR or ADMIN
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    if (!user || (user.role !== 'HR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Not authorized to view candidate analysis" }, { status: 403 });
    }
    
    // Fetch candidate with their analysis
    const candidate = await db.candidate.findUnique({
      where: { id: candidateId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        analysis: true,
        submissions: {
          include: {
            assessment: {
              select: {
                id: true,
                title: true,
              }
            }
          }
        }
      },
    });
    
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }
    
    // Prepare response
    const response = {
      candidateId: candidate.id,
      name: candidate.user?.name ?? 'Unknown',
      email: candidate.user?.email ?? 'Unknown',
      analysis: candidate.analysis ?? null,
      assessment: candidate.submissions[0]?.assessment ?? null
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching candidate analysis:", error);
    return NextResponse.json({ error: "Failed to fetch candidate analysis" }, { status: 500 });
  }
} 