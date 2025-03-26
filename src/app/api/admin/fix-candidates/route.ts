import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

/**
 * Administrative endpoint to fix users with "Dummy Candidate" name
 * This will update candidates who have assessments but have dummy names
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Check if user is ADMIN
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Not authorized to perform this action" }, { status: 403 });
    }
    
    // Get candidate update data from request 
    // (Optional: allows specifying which candidates to update and with what info)
    let updateData: {
      candidateId?: string;
      newName?: string;
      newEmail?: string;
      fixAll?: boolean;
    } = {};
    
    try {
      updateData = await req.json();
    } catch (e) {
      // Default to fix all if no specific data provided
      updateData = { fixAll: true };
    }
    
    // Find candidates with "Dummy Candidate" name
    const dummyCandidates = await db.user.findMany({
      where: {
        name: { 
          contains: "Dummy Candidate",
          mode: "insensitive"
        },
        ...(updateData.candidateId ? {
          candidate: {
            id: updateData.candidateId
          }
        } : {}),
      },
      include: {
        candidate: {
          include: {
            assessments: {
              select: {
                id: true,
                title: true,
              }
            }
          }
        }
      }
    });
    
    const updates = [];
    
    // Fix the dummy candidates by extracting real names from assessment titles or using provided values
    for (const dummyUser of dummyCandidates) {
      if (!dummyUser.candidate) continue;
      
      const assessmentTitle = dummyUser.candidate.assessments[0]?.title ?? '';
      
      // Extract candidate name from assessment title if possible
      let newName = updateData.newName;
      let newEmail = updateData.newEmail;
      
      if (!newName) {
        // Try to extract a name from the title
        const match = assessmentTitle.match(/(.*?)\s+Technical Assessment/i);
        if (match && match[1]) {
          newName = match[1].trim();
        } else {
          // Default to a more meaningful generic name
          newName = `Candidate ${dummyUser.candidate.id.substring(0, 6)}`;
        }
      }
      
      if (!newEmail && dummyUser.email.includes('dummy')) {
        // Create a more professional generic email if current one is dummy
        newEmail = `candidate-${dummyUser.candidate.id.substring(0, 6)}@example.com`;
      }
      
      // Update the user if we have new values
      if (newName || newEmail) {
        await db.user.update({
          where: { id: dummyUser.id },
          data: {
            ...(newName ? { name: newName } : {}),
            ...(newEmail ? { email: newEmail } : {})
          }
        });
        
        updates.push({
          candidateId: dummyUser.candidate.id,
          oldName: dummyUser.name,
          newName: newName ?? dummyUser.name,
          oldEmail: dummyUser.email,
          newEmail: newEmail ?? dummyUser.email
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Fixed ${updates.length} dummy candidates`,
      updates
    });
  } catch (error) {
    console.error("Error fixing dummy candidates:", error);
    return NextResponse.json({ error: "Failed to fix dummy candidates" }, { status: 500 });
  }
}

/**
 * GET method to check which candidates have dummy names
 */
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
      return NextResponse.json({ error: "Not authorized to view this data" }, { status: 403 });
    }
    
    // Find all candidates with "Dummy" in the name
    const dummyCandidates = await db.user.findMany({
      where: {
        name: { 
          contains: "Dummy",
          mode: "insensitive"
        }
      },
      include: {
        candidate: {
          include: {
            assessments: {
              select: {
                id: true,
                title: true,
                status: true
              }
            },
            analysis: {
              select: {
                id: true,
                overallScore: true
              }
            }
          }
        }
      }
    });
    
    // Format the response
    const formattedCandidates = dummyCandidates.map(user => ({
      userId: user.id,
      candidateId: user.candidate?.id,
      name: user.name,
      email: user.email,
      hasAnalysis: !!user.candidate?.analysis,
      analysisScore: user.candidate?.analysis?.overallScore ?? null,
      assessments: user.candidate?.assessments.map(a => ({
        id: a.id,
        title: a.title,
        status: a.status
      })) ?? []
    }));
    
    return NextResponse.json({
      count: formattedCandidates.length,
      candidates: formattedCandidates
    });
  } catch (error) {
    console.error("Error checking dummy candidates:", error);
    return NextResponse.json({ error: "Failed to check dummy candidates" }, { status: 500 });
  }
} 