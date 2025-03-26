/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { db } from '../db';
import { type Prisma } from '@prisma/client';

interface AssessmentData {
  title: string;
  description: string;
  candidateName: string;
  candidateEmail: string;
  candidateId: string; // Added candidateId for database operations
  jobDescription?: string;
  questions: Array<{
    id: string;
    text: string;
    type: 'VIDEO' | 'AUDIO' | 'TEXT';
    response: string; // For text responses or transcriptions of video/audio
  }>;
  resumeText?: string; // Extracted text from resume
}

const AnalysisSchema = z.object({
  summary: z.string().describe("A brief but detailed summary of the candidate's overall performance, highlighting key points from the assessment"),
  strengths: z.array(z.string()).describe("The candidate's notable strengths based on their resume and assessment responses"),
  weaknesses: z.array(z.string()).describe("The candidate's areas for improvement based on their assessment responses"),
  skillMatch: z.number().int().describe("A score (0-100) representing how well the candidate's skills match the job requirements"),
  communicationScore: z.number().int().describe("A score (0-100) rating the candidate's communication skills based on their responses"),
  technicalScore: z.number().int().describe("A score (0-100) rating the candidate's technical abilities based on their responses"),
  overallScore: z.number().int().describe("An overall assessment score (0-100) considering all aspects of the candidate's application"),
  recommendation: z.enum(['STRONG_HIRE', 'HIRE', 'CONSIDER', 'REJECT']).describe("A hiring recommendation based on the overall assessment"),
  feedbackPoints: z.array(z.string()).describe("Specific, actionable feedback points to share with the candidate"),
});

type AnalysisResult = z.infer<typeof AnalysisSchema>;

export async function analyzeAssessment(data: AssessmentData): Promise<AnalysisResult> {
  // Handle potentially missing resume text
  const resumeText = data.resumeText ?? "No resume text was provided or could be extracted.";
  
  // Create a more structured prompt for better analysis
  const prompt = `You are an expert HR and technical interviewer tasked with analyzing a candidate's assessment responses.

## Job Information
Title: ${data.title}
Description: ${data.description}
${data.jobDescription ? `Job Description: ${data.jobDescription}` : ''}

## Candidate Information
Name: ${data.candidateName}
Email: ${data.candidateEmail}

## Resume Content
${resumeText}

## Assessment Questions and Responses
${data.questions.map(q => `### Question (${q.type}):\n${q.text}\n\n### Response:\n${q.response || '[No response provided]'}\n`).join('\n')}

Please provide a comprehensive analysis of this candidate based on their resume and responses. Your analysis should:

1. Carefully evaluate how well they answered each question
2. Assess their communication skills, technical knowledge, and overall fit for the position
3. Consider the match between their skills/experience and the job requirements
4. Be fair, thorough, and objective in your assessment

Rate all scores as integers between 0-100, where:
- 0-25: Poor/Inadequate
- 26-50: Below Average
- 51-75: Meets Expectations
- 76-90: Above Average
- 91-100: Exceptional

For the recommendation:
- STRONG_HIRE: Exceptional candidate who exceeds requirements
- HIRE: Solid candidate who meets all requirements
- CONSIDER: Potential candidate with some concerns
- REJECT: Not a good fit for this position

Provide specific feedback points that would be helpful for the candidate's professional development.`;

  try {
    console.log('Starting assessment analysis');
    
    // Use the most capable model for the best analysis
    const result = await generateObject({
      model: openai('gpt-4o', {
        structuredOutputs: true,
      }),
      schemaName: 'candidateAnalysis',
      schemaDescription: 'Comprehensive analysis of a candidate\'s assessment responses',
      schema: AnalysisSchema,
      prompt,
    });

    console.log('Assessment analysis completed successfully');
    
    // Validate scores are within expected range (0-100)
    const validatedResult = {
      ...result.object,
      skillMatch: Math.max(0, Math.min(100, result.object.skillMatch)),
      communicationScore: Math.max(0, Math.min(100, result.object.communicationScore)),
      technicalScore: Math.max(0, Math.min(100, result.object.technicalScore)),
      overallScore: Math.max(0, Math.min(100, result.object.overallScore))
    };
    
    // Save the analysis results to the database
    await saveAnalysisToDatabase(data.candidateId, validatedResult);
    
    return validatedResult;
  } catch (error) {
    console.error('Error in assessment analysis:', error);
    
    // Try a fallback approach with a simpler model if the structured output fails
    try {
      console.log('Attempting fallback analysis without structured output');
      
      // Use a simpler prompt for the fallback
      const fallbackPrompt = `Analyze the assessment responses for a candidate applying for: ${data.title}.
      
Based on their responses and resume, provide an overall assessment score (0-100) and a hiring recommendation (STRONG_HIRE, HIRE, CONSIDER, or REJECT).

Candidate: ${data.candidateName}
Resume: ${resumeText.substring(0, 500)}...
Responses: ${data.questions.map(q => `Q: ${q.text} A: ${q.response?.substring(0, 100) || '[No response]'}...`).join('\n')}`;
      
      const fallbackResult = await generateText({
        model: openai('gpt-4o'),
        prompt: fallbackPrompt,
      });
      
      console.log('Fallback analysis completed');
      
      // Create a simpler default result
      const defaultResult: AnalysisResult = {
        summary: "Analysis was completed using a fallback method due to processing limitations. " + fallbackResult.text.substring(0, 250),
        strengths: ["Technical skills mentioned in resume", "Provided responses to assessment questions"],
        weaknesses: ["Full structured analysis could not be completed"],
        skillMatch: 60,
        communicationScore: 60,
        technicalScore: 60,
        overallScore: 60,
        recommendation: "CONSIDER",
        feedbackPoints: ["We recommend reviewing the assessment with a hiring manager for a more complete evaluation."]
      };
      
      // Save the default result to the database
      await saveAnalysisToDatabase(data.candidateId, defaultResult);
      
      return defaultResult;
    } catch (fallbackError) {
      console.error('Fallback analysis also failed:', fallbackError);
      
      // Provide a generic response if all attempts fail
      const genericResult: AnalysisResult = {
        summary: "Unable to analyze assessment responses due to a technical issue",
        strengths: ["Unable to determine strengths due to processing error"],
        weaknesses: ["Unable to determine weaknesses due to processing error"],
        skillMatch: 50,
        communicationScore: 50,
        technicalScore: 50,
        overallScore: 50,
        recommendation: "CONSIDER",
        feedbackPoints: ["We encountered an error while analyzing the assessment. Please contact support."]
      };
      
      // Still save the generic result to the database
      await saveAnalysisToDatabase(data.candidateId, genericResult);
      
      return genericResult;
    }
  }
}

// Function to save analysis results to the database
async function saveAnalysisToDatabase(candidateId: string, analysis: AnalysisResult): Promise<void> {
  try {
    console.log(`Saving analysis to database for candidate ${candidateId}`);
    
    // Calculate derived scores based on the analysis
    const skillScore = analysis.skillMatch;
    const experienceScore = (analysis.technicalScore + analysis.communicationScore) / 2;
    const intentToJoin = analysis.recommendation === 'STRONG_HIRE' || analysis.recommendation === 'HIRE' ? 85 : 60;
    
    // Prepare analysis JSON for database
    const analysisJson: Prisma.JsonValue = {
      summary: analysis.summary,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      skillMatch: analysis.skillMatch,
      communicationScore: analysis.communicationScore,
      technicalScore: analysis.technicalScore,
      overallScore: analysis.overallScore,
      recommendation: analysis.recommendation,
      feedbackPoints: analysis.feedbackPoints,
      timestamp: new Date().toISOString(), // Add a timestamp for tracking when the analysis was performed
    };
    
    // Check if an analysis already exists for this candidate
    const existingAnalysis = await db.candidateAnalysis.findUnique({
      where: { candidateId },
    });

    if (existingAnalysis) {
      // Update existing analysis
      await db.candidateAnalysis.update({
        where: { candidateId },
        data: {
          overallScore: analysis.overallScore,
          skillScore,
          experienceScore,
          intentToJoin,
          strengths: analysis.strengths,
          analysisJson,
          updatedAt: new Date(),
        },
      });
      console.log(`Updated existing analysis for candidate ${candidateId}`);
    } else {
      // Create new analysis
      await db.candidateAnalysis.create({
        data: {
          candidateId,
          overallScore: analysis.overallScore,
          skillScore,
          experienceScore,
          intentToJoin,
          strengths: analysis.strengths,
          analysisJson,
        },
      });
      console.log(`Created new analysis for candidate ${candidateId}`);
    }
  } catch (error) {
    console.error('Error saving analysis to database:', error);
    throw error;
  }
}

// Analysis of resume text only
export async function analyzeResume(resumeText: string, jobDescription: string): Promise<string> {
  const prompt = `As an expert HR professional, analyze the following resume for a candidate applying for a position:

## Resume Content
${resumeText}

## Job Description
${jobDescription}

Please extract key information from the resume and analyze how well the candidate's background matches the job requirements. Focus on:
1. Education and qualifications
2. Relevant skills and technologies 
3. Experience level and alignment with requirements
4. Potential strengths and weaknesses for this role
5. Overall fit for the position

Provide a structured analysis that summarizes the candidate's background and fit for the role, with specific highlights and areas of concern.`;

  try {
    console.log('Starting resume analysis');
    
    const result = await generateText({
      model: openai('gpt-4o'),
      prompt,
    });
    
    console.log('Resume analysis completed successfully');
    return result.text;
  } catch (error) {
    console.error('Error in resume analysis:', error);
    return "Error analyzing resume. We were unable to process your resume against the job description. Please try again later or contact support for assistance.";
  }
} 