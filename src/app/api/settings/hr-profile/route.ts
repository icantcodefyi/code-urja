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
      select: { 
        role: true,
        hrProfile: true
      },
    });
    
    if (!user || (user.role !== 'HR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Not authorized to access profile" }, { status: 403 });
    }
    
    // Get HR profile
    if (!user.hrProfile) {
      // Create a default profile if one doesn't exist
      const defaultProfile = await db.hRProfile.create({
        data: {
          userId,
          companyName: 'My Company',
        }
      });
      
      return NextResponse.json({ profile: defaultProfile });
    }
    
    return NextResponse.json({ profile: user.hrProfile });
  } catch (error) {
    console.error("Error fetching HR profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Check if user is HR or ADMIN
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { 
        role: true,
        hrProfile: true
      },
    });
    
    if (!user || (user.role !== 'HR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Not authorized to update profile" }, { status: 403 });
    }
    
    const data = await req.json();
    const { companyName, companyWebsite, companyDescription } = data;
    
    // Update the HR profile
    const updatedProfile = await db.hRProfile.upsert({
      where: { 
        userId 
      },
      update: {
        companyName,
        companyWebsite,
        companyDescription
      },
      create: {
        userId,
        companyName,
        companyWebsite,
        companyDescription
      }
    });
    
    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating HR profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
} 