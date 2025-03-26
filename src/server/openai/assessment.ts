import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { QuestionType } from '../types';
import type { CreateAssessmentInput, CreateQuestionInput } from '../types';

// Schema for AI-generated assessment
const AssessmentGenerationSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(
    z.object({
      text: z.string(),
      type: z.nativeEnum(QuestionType),
      order: z.number(),
      expectedDuration: z.number().nullable(), // Changed from optional to nullable
      difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
      category: z.string(),
      skills: z.array(z.string()),
    })
  ),
  maxDuration: z.number(),
  passingScore: z.number(),
  aiAnalysisEnabled: z.boolean(),
});

type AssessmentGenerationInput = {
  jobTitle: string;
  experienceLevel: string;
  requiredSkills: string[];
  companyContext?: string;
  assessmentType: 'TECHNICAL' | 'BEHAVIORAL' | 'MIXED';
  numberOfQuestions?: number;
  preferredDuration?: number; // in minutes
};

export async function generateAssessment(input: AssessmentGenerationInput): Promise<CreateAssessmentInput> {
  const prompt = `Generate a comprehensive ${input.assessmentType.toLowerCase()} assessment for a ${input.experienceLevel} ${input.jobTitle} position.
${input.companyContext ? `Company Context: ${input.companyContext}\n` : ''}
Required Skills: ${input.requiredSkills.join(', ')}
${input.numberOfQuestions ? `Number of Questions: ${input.numberOfQuestions}\n` : ''}
${input.preferredDuration ? `Preferred Duration: ${input.preferredDuration} minutes\n` : ''}

Please create a well-structured assessment that includes:
1. A clear title and description
2. A mix of questions that evaluate the candidate's:
   - Technical knowledge (for technical assessments)
   - Problem-solving abilities
   - Communication skills
   - Experience level
3. Questions should be clear, concise, and relevant to the role
4. Include a mix of question types (video, audio, text) where appropriate
5. Set reasonable time limits and passing criteria`;

  const result = await generateObject({
    model: openai('gpt-4o-2024-08-06', {
      structuredOutputs: true,
    }),
    schemaName: 'assessment',
    schemaDescription: 'A comprehensive assessment for job candidates',
    schema: AssessmentGenerationSchema,
    prompt,
  });

  // Transform the AI-generated assessment into our CreateAssessmentInput format
  const generatedAssessment = result.object;
  
  return {
    title: generatedAssessment.title,
    description: generatedAssessment.description,
    maxDuration: generatedAssessment.maxDuration,
    passingScore: generatedAssessment.passingScore,
    aiAnalysisEnabled: generatedAssessment.aiAnalysisEnabled,
    questions: generatedAssessment.questions.map((q, index) => ({
      text: q.text,
      type: q.type,
      order: q.order,
    })),
    // These will need to be set by the calling code
    candidateId: '', // To be set by the caller
    createdBy: '', // To be set by the caller
  };
}

// Helper function to generate specific types of questions
export async function generateQuestionsByType(
  type: QuestionType,
  context: string,
  count = 5
): Promise<CreateQuestionInput[]> {
  const prompt = `Generate ${count} ${type.toLowerCase()} questions for the following context:
${context}

Each question should be:
1. Clear and concise
2. Relevant to the role and context
3. Appropriate for ${type.toLowerCase()} format
4. Include expected duration and difficulty level`;

  const QuestionSchema = z.array(
    z.object({
      text: z.string(),
      type: z.literal(type),
      order: z.number(),
      expectedDuration: z.number(),
      difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    })
  );

  const result = await generateObject({
    model: openai('gpt-4o-2024-08-06', {
      structuredOutputs: true,
    }),
    schemaName: 'questions',
    schemaDescription: `Generate ${type.toLowerCase()} questions`,
    schema: QuestionSchema,
    prompt: prompt,
  });

  return result.object.map((q, index) => ({
    text: q.text,
    type: q.type,
    order: index + 1,
  }));
}