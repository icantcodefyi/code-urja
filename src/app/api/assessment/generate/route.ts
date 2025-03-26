import { NextResponse } from 'next/server';
import { generateAssessment } from '~/server/openai/assessment';
import { z } from 'zod';

const AssessmentRequestSchema = z.object({
  jobTitle: z.string(),
  experienceLevel: z.string(),
  requiredSkills: z.array(z.string()),
  companyContext: z.string().optional(),
  assessmentType: z.enum(['TECHNICAL', 'BEHAVIORAL', 'MIXED']),
  numberOfQuestions: z.number().min(1).max(20).optional(),
  preferredDuration: z.number().min(15).max(180).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = AssessmentRequestSchema.parse(body);

    const assessment = await generateAssessment(validatedData);

    return NextResponse.json(assessment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Assessment generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate assessment' },
      { status: 500 }
    );
  }
} 