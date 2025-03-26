import { NextResponse } from "next/server";
import { sendAssessmentCompletionEmail } from "~/server/email/send-email";
import { db } from "~/server/db";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { assessmentId?: string };
    const { assessmentId } = body;
    
    if (!assessmentId) {
      return NextResponse.json(
        { error: "Missing assessment ID" },
        { status: 400 }
      );
    }
    
    // Fetch the assessment with all necessary data
    const assessment = await db.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        hrUser: true,
        submissions: {
          include: {
            candidate: {
              include: {
                user: true,
                analysis: true,
              }
            }
          }
        }
      }
    });
    
    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }
    
    if (!assessment.hrUser?.email) {
      return NextResponse.json(
        { error: "HR user email not found" },
        { status: 404 }
      );
    }
    
    // Get the completed submission (assuming we want to email about a completed assessment)
    const completedSubmission = assessment.submissions.find(
      submission => submission.status === "COMPLETED" || submission.status === "REVIEWED"
    );
    
    if (!completedSubmission) {
      return NextResponse.json(
        { error: "No completed assessment submission found" },
        { status: 404 }
      );
    }
    
    // Get the candidate details
    const candidateName = completedSubmission.candidate?.user?.name ?? "Candidate";
    const candidateAnalysis = completedSubmission.candidate?.analysis;
    
    if (!candidateAnalysis) {
      return NextResponse.json(
        { error: "Candidate analysis not found" },
        { status: 404 }
      );
    }
    
    // Extract strengths from analysis
    const strengths = candidateAnalysis.strengths ?? [];
    
    // Generate dashboard link
    const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/assessments/${assessmentId}`;
    
    // Send email
    const result = await sendAssessmentCompletionEmail({
      toEmail: assessment.hrUser.email,
      candidateName,
      positionName: assessment.title,
      companyName: assessment.hrUser.name ?? "Your Company",
      assessmentId,
      assessmentDate: assessment.updatedAt.toISOString(),
      dashboardLink,
      overallScore: candidateAnalysis.overallScore,
      skillScore: candidateAnalysis.skillScore,
      experienceScore: candidateAnalysis.experienceScore,
      intentScore: candidateAnalysis.intentToJoin,
      strengths: strengths.length > 0 ? strengths : undefined,
    });
    
    if (result?.success === false) {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Email sent to ${assessment.hrUser.email}`,
    });
    
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
} 