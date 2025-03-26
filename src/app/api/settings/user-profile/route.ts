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
    
    // Get user profile
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
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
    
    const data = await req.json();
    const { name, email } = data;
    
    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await db.user.findUnique({
        where: { email }
      });
      
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
      }
    }
    
    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        email
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true
      }
    });
    
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
} 