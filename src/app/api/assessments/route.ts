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
    
    // Find or create a candidate
    let candidate = await db.candidate.findFirst({
      where: { user: { role: 'CANDIDATE' } },
      select: { id: true },
    });
    
    // If no candidate exists, create a dummy candidate
    if (!candidate) {
      // First create a dummy candidate user
      const dummyUser = await db.user.create({
        data: {
          name: "Dummy Candidate",
          email: `dummy-${Date.now()}@example.com`,
          role: 'CANDIDATE',
        }
      });
      
      // Then create a candidate profile linked to this user
      candidate = await db.candidate.create({
        data: {
          userId: dummyUser.id,
        },
        select: { id: true },
      });
    }
    
    // Generate a unique link
    const uniqueLink = nanoid(10);
    
    // Create assessment
    const assessment = await db.assessment.create({
      data: {
        title,
        description,
        maxDuration: parseInt(maxDuration || ""),
        passingScore: parseFloat(passingScore || ""),
        aiAnalysisEnabled,
        isTemplate: isTemplate ?? false,
        templateName: isTemplate ? templateName : null,
        candidate: { connect: { id: candidate.id } },
        hrUser: { connect: { id: userId } },
        uniqueLink,
        status: 'PENDING',
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