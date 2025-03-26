import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const uniqueLink = params.id;
    
    // Find the assessment by its unique link
    const assessment = await db.assessment.findUnique({
      where: { uniqueLink },
      select: {
        id: true,
        title: true,
        description: true,
        maxDuration: true,
        questions: {
          select: {
            id: true,
            text: true,
            type: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    
    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ assessment });
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessment" },
      { status: 500 }
    );
  }
} 