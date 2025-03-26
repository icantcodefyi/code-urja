import { NextResponse } from "next/server";
import { db } from "~/server/db";

interface AssessmentSubmissionPayload {
  assessmentId: string;
  candidateName: string;
  candidateEmail: string;
  resumeUrl: string;
  responses: Record<string, unknown>;
}

export async function POST(req: Request) {
  try {
    const {
      assessmentId,
      candidateName,
      candidateEmail,
      resumeUrl,
      responses
    } = await req.json() as AssessmentSubmissionPayload;
    
    // Validate required fields
    if (!assessmentId || !candidateName || !candidateEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Find the assessment
    const assessment = await db.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        candidate: true,
      },
    });
    
    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }
    
    // In a real application, you would:
    // 1. Create or update a user with the candidate information
    // 2. Store the resume file (e.g. in S3 or similar cloud storage)
    // 3. Store each response according to its type (video/audio/text)
    
    // For demo purposes, we're just returning a success response
    return NextResponse.json({
      success: true,
      message: "Assessment submitted successfully",
    });
    
    // Example of what you might do with video/audio responses in a real app:
    /*
    // For each video response
    for (const questionId in responses) {
      const question = await db.question.findUnique({
        where: { id: questionId },
      });
      
      if (!question) continue;
      
      if (question.type === 'VIDEO') {
        await db.videoResponse.create({
          data: {
            candidateId: assessment.candidate.id,
            questionId,
            videoUrl: responses[questionId].videoUrl,
            transcription: responses[questionId].transcription,
            duration: responses[questionId].duration,
          },
        });
      } else if (question.type === 'AUDIO') {
        await db.audioResponse.create({
          data: {
            candidateId: assessment.candidate.id,
            questionId,
            audioUrl: responses[questionId].audioUrl,
            transcription: responses[questionId].transcription,
            duration: responses[questionId].duration,
          },
        });
      }
      // Handle text responses as needed
    }
    */
  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json(
      { error: "Failed to submit assessment" },
      { status: 500 }
    );
  }
} 