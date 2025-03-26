import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { db } from "~/server/db";
import { transcribeMedia, type TranscriptionOptions } from "~/server/gemini/transcription";
import { extractTextFromResume } from "~/server/resume/parser";
import { analyzeAssessment } from "~/server/openai/analysis";
import { sendAssessmentCompletionEmail } from "~/server/email/send-email";

// Create a PrismaClient fallback in case the imported one is undefined
const prisma = db || new PrismaClient();

interface AssessmentSubmissionPayload {
  assessmentId: string;
  candidateName: string;
  candidateEmail: string;
  resumeUrl: string;
  responses: Record<string, {
    type: 'VIDEO' | 'AUDIO' | 'TEXT';
    content: string;         // Text response or media URL
    questionId: string;
    questionText: string;
  }>;
}

export async function POST(req: Request) {
  try {
    const {
      assessmentId,
      candidateName,
      candidateEmail: rawCandidateEmail,
      resumeUrl,
      responses
    } = await req.json() as AssessmentSubmissionPayload;
    
    // Check if the email is a dummy email and reject it
    const isDummyEmail = rawCandidateEmail.includes('dummy-') && rawCandidateEmail.includes('@example.com');
    const candidateEmail = isDummyEmail ? '' : rawCandidateEmail;
    
    // Validate required fields
    if (!assessmentId || !candidateName || !candidateEmail || !resumeUrl) {
      return NextResponse.json(
        { error: "Missing required fields or using dummy email" },
        { status: 400 }
      );
    }
    
    // Find the assessment
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: true,
      },
    });
    
    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }
    
    // Get or create candidate
    let candidate;
    let submissionId: string | null = null;
    
    // Look up candidate by email first
    const user = await prisma.user.findUnique({
      where: { email: candidateEmail },
      include: { candidate: true },
    });
    
    if (user?.candidate) {
      candidate = user.candidate;
      
      // Always update with the latest name from the form
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          name: candidateName,
          // We don't update email here because it's used as the lookup field
        }
      });
    } else {
      // Create a new candidate if not found
      const newUser = await prisma.user.create({
        data: {
          name: candidateName,
          email: candidateEmail,
          role: 'CANDIDATE',
          candidate: {
            create: {
              resumeUrl: resumeUrl,
            },
          },
        },
        include: { candidate: true },
      });
      candidate = newUser.candidate!;
    }

    // Check if there's an existing submission for this candidate and assessment
    let submission = await prisma.assessmentSubmission.findUnique({
      where: {
        assessmentId_candidateId: {
          assessmentId: assessmentId,
          candidateId: candidate.id
        }
      }
    });
    
    if (submission) {
      // Update the existing submission
      submission = await prisma.assessmentSubmission.update({
        where: { id: submission.id },
        data: { 
          status: 'IN_PROGRESS',
        }
      });
      submissionId = submission.id;
    } else {
      // Create a new submission
      submission = await prisma.assessmentSubmission.create({
        data: {
          assessmentId: assessmentId,
          candidateId: candidate.id,
          status: 'IN_PROGRESS',
        }
      });
      submissionId = submission.id;
    }
    
    // Update resume URL if provided
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: { resumeUrl }
    });
    
    // Extract text from resume
    let resumeText = "";
    try {
      // Check if this is a blob URL (which can't be directly processed)
      if (resumeUrl.startsWith('blob:')) {
        console.log('Warning: Resume URL is a blob URL which cannot be processed server-side');
        resumeText = "The resume was uploaded as a blob URL which cannot be processed server-side. Please upload the resume to a proper storage service for analysis.";
      } else {
        // For uploadthing URLs, ensure they're properly formatted
        let processedResumeUrl = resumeUrl;
        if (resumeUrl.includes('utfs.io') && !resumeUrl.startsWith('http')) {
          processedResumeUrl = `https://${resumeUrl}`;
        }
        
        resumeText = await extractTextFromResume(processedResumeUrl);
        console.log("Resume text extracted successfully");
      }
    } catch (error) {
      console.error("Error extracting resume text:", error);
      resumeText = "Failed to extract text from resume. Please ensure the resume file is a valid PDF or DOCX document.";
    }
    
    // Process each response - handle transcriptions for video/audio
    const processedResponses = await Promise.all(
      Object.values(responses).map(async (response) => {
        // For video and audio, transcribe the content
        if (response.type === 'VIDEO' || response.type === 'AUDIO') {
          try {
            // Check if this is a blob URL
            if (response.content.startsWith('blob:')) {
              console.log(`Warning: ${response.type} URL is a blob URL which cannot be processed server-side`);
              
              // Create a placeholder transcription but still record the response
              const placeholder = `[This ${response.type.toLowerCase()} was uploaded as a blob URL which cannot be fully processed server-side. The content was saved but not transcribed.]`;
              
              // Record the media response with placeholder
              if (response.type === 'VIDEO') {
                // Check if there's an existing video response for this candidate and question
                const existingResponse = await prisma.videoResponse.findFirst({
                  where: {
                    questionId: response.questionId,
                    submissionId: submissionId
                  }
                });
                
                if (existingResponse) {
                  // Update existing response
                  await prisma.videoResponse.update({
                    where: { id: existingResponse.id },
                    data: { 
                      videoUrl: response.content,
                      transcription: placeholder
                    }
                  });
                } else {
                  // Create new response
                  await prisma.videoResponse.create({
                    data: {
                      candidateId: candidate.id,
                      questionId: response.questionId,
                      submissionId: submissionId,
                      videoUrl: response.content,
                      transcription: placeholder,
                      duration: 0, // Unknown duration
                    }
                  });
                }
              } else {
                // Check if there's an existing audio response for this candidate and question
                const existingResponse = await prisma.audioResponse.findFirst({
                  where: {
                    questionId: response.questionId,
                    submissionId: submissionId
                  }
                });
                
                if (existingResponse) {
                  // Update existing response
                  await prisma.audioResponse.update({
                    where: { id: existingResponse.id },
                    data: { 
                      audioUrl: response.content,
                      transcription: placeholder
                    }
                  });
                } else {
                  // Create new response
                  await prisma.audioResponse.create({
                    data: {
                      candidateId: candidate.id,
                      questionId: response.questionId,
                      submissionId: submissionId,
                      audioUrl: response.content,
                      transcription: placeholder,
                      duration: 0, // Unknown duration
                    }
                  });
                }
              }
              
              return {
                ...response,
                transcription: placeholder,
              };
            }
            
            // Prepare transcription options
            const transcriptionOptions: TranscriptionOptions = {
              questionId: response.questionId,
              candidateId: candidate.id,
              mediaType: response.type,
              // Duration would ideally be extracted from the media file
              // For now, use a placeholder value
              duration: 60, // Default to 60 seconds if not known
            };
            
            // Ensure media URL is properly formatted
            let processedMediaUrl = response.content;
            if (response.content.includes('utfs.io') && !response.content.startsWith('http')) {
              processedMediaUrl = `https://${response.content}`;
            }
            
            const transcription = await transcribeMedia(processedMediaUrl, transcriptionOptions);
            return {
              ...response,
              transcription,
            };
          } catch (error) {
            console.error(`Error transcribing ${response.type}:`, error);
            const errorMessage = `[Failed to transcribe ${response.type}: ${error instanceof Error ? error.message : 'Unknown error'}]`;
            
            return {
              ...response,
              transcription: errorMessage,
            };
          }
        }
        
        if (response.type === 'TEXT') {
          try {
            // Check if there's an existing text response for this submission and question
            const existingResponse = await prisma.textResponse.findFirst({
              where: {
                questionId: response.questionId,
                submissionId: submissionId
              }
            });
            
            if (existingResponse) {
              // Update existing response
              await prisma.textResponse.update({
                where: { id: existingResponse.id },
                data: { 
                  content: response.content
                }
              });
            } else {
              // Create new response
              await prisma.textResponse.create({
                data: {
                  candidateId: candidate.id,
                  questionId: response.questionId,
                  submissionId: submissionId,
                  content: response.content
                }
              });
            }
          } catch (error) {
            console.error(`Error saving text response:`, error);
          }
        }
        
        return {
          ...response,
          transcription: response.content, // For text, the transcription is just the content
        };
      })
    );
    
    // Update submission status to COMPLETED
    await prisma.assessmentSubmission.update({
      where: { id: submissionId },
      data: { 
        status: 'COMPLETED',
        completedAt: new Date()
      },
    });
    
    // Format data for analysis - use the validated email
    const analysisData = {
      title: assessment.title,
      description: assessment.description ?? "",
      candidateName,
      candidateEmail, // Using our validated email
      candidateId: candidate.id, // Add candidate ID for database operations
      submissionId,
      questions: processedResponses.map(r => ({
        id: r.questionId,
        text: r.questionText,
        type: r.type,
        response: r.transcription,
      })),
      resumeText,
    };
    
    // Run the analysis asynchronously - don't await the result
    void runAnalysisAsync(analysisData, assessmentId, submissionId);
    
    // Return immediate success response to the user
    return NextResponse.json({
      success: true,
      message: "Assessment submitted successfully. Analysis in progress.",
      candidateDetails: {
        name: candidateName,
        email: candidateEmail, // Using our validated email
        resumeUrl,
      },
      processedResponses,
    });
    
  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json(
      { error: "Failed to submit assessment" },
      { status: 500 }
    );
  }
}

/**
 * Run analysis asynchronously and store the result in the database
 */
async function runAnalysisAsync(
  analysisData: Parameters<typeof analyzeAssessment>[0], 
  assessmentId: string,
  submissionId: string,
): Promise<void> {
  try {
    // Run the analysis - the function now handles saving to the database
    const analysis = await analyzeAssessment(analysisData);
    console.log("Assessment analyzed successfully");

    // Fetch the assessment with HR user details for email notification
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        hrUser: true,
      }
    });

    if (assessment?.hrUser?.email) {
      // Prepare strengths array from analysis
      const strengths = analysis.strengths || [];
      
      // Generate dashboard link for HR to view results
      const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/assessments/${assessmentId}`;
      
      // Send email notification to HR
      await sendAssessmentCompletionEmail({
        toEmail: assessment.hrUser.email,
        candidateName: analysisData.candidateName,
        positionName: assessment.title ?? 'Open Position',
        companyName: assessment.hrUser.name ?? 'Your Company',
        assessmentId,
        assessmentDate: new Date().toISOString(),
        dashboardLink,
        overallScore: analysis.overallScore,
        skillScore: analysis.skillMatch,
        experienceScore: Math.round((analysis.technicalScore + analysis.communicationScore) / 2),
        intentScore: analysis.recommendation === 'STRONG_HIRE' || analysis.recommendation === 'HIRE' ? 85 : 60,
        strengths: strengths.length > 0 ? strengths : undefined,
      });
      
      console.log(`Email notification sent to HR: ${assessment.hrUser.email}`);
    } else {
      console.log("Could not send email: Missing HR user email or assessment data");
    }
    
    console.log(`Analysis for candidate ${analysisData.candidateName} completed and stored successfully`);
  } catch (error) {
    console.error("Error analyzing assessment:", error);
    // Error handling is done in the analyzeAssessment function
  }
} 