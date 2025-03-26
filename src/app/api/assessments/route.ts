/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { nanoid } from "nanoid";
import type { QuestionType } from "@prisma/client";

interface CreateAssessmentPayload {
  title: string;
  description: string;
  maxDuration: string;
  passingScore: string;
  aiAnalysisEnabled: boolean;
  isTemplate: boolean;
  templateName?: string;
  questions: Array<{
    id: string;
    text: string;
    type: QuestionType;
    order: number;
  }>;
}

export async function POST(req: Request) {
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
      return NextResponse.json({ error: "Not authorized to create assessments" }, { status: 403 });
    }
    
    const data = await req.json() as CreateAssessmentPayload;
    const { title, description, maxDuration, passingScore, aiAnalysisEnabled, isTemplate, templateName, questions } = data;
    
    // Generate a unique link
    const uniqueLink = nanoid(10);
    
    // Create assessment
    const assessment = await db.assessment.create({
      data: {
        title,
        description,
        maxDuration: parseInt(maxDuration || "0"),
        passingScore: parseFloat(passingScore || "0"),
        aiAnalysisEnabled,
        isTemplate: isTemplate ?? false,
        templateName: isTemplate ? templateName : null,
        createdBy: userId, // Connect to the HR user who created it
        uniqueLink,
        questions: {
          create: questions.map((q) => ({
            text: q.text,
            type: q.type,
            order: q.order,
          })),
        },
      },
      include: {
        questions: true,
      },
    });
    
    return NextResponse.json({
      assessment,
      assessmentLink: `/assessments/${uniqueLink}`
    });
  } catch (error) {
    console.error("Error creating assessment:", error);
    return NextResponse.json({ error: "Failed to create assessment" }, { status: 500 });
  }
} 