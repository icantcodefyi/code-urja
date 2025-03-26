import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

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
      return NextResponse.json({ error: "Not authorized to view templates" }, { status: 403 });
    }
    
    // Get assessment templates created by this user
    const templates = await db.assessment.findMany({
      where: { 
        createdBy: userId,
        isTemplate: true
      },
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transform the data for the frontend
    const templatesList = templates.map(template => {
      return {
        id: template.id,
        title: template.title,
        description: template.description,
        templateName: template.templateName,
        questionCount: template.questions.length,
        maxDuration: template.maxDuration,
        createdAt: template.createdAt.toISOString(),
      };
    });
    
    return NextResponse.json({ templates: templatesList });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
} 