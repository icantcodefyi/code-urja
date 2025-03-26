import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

// Since we don't have a notifications table in the schema,
// we'll use a simple in-memory store for this demo
// In a real app, you would store these in the database
const notificationSettings = new Map<string, {
  assessmentCompleted: boolean;
  newResponseSubmitted: boolean;
  assessmentReminders: boolean;
  marketingEmails: boolean;
}>();

// Default notification settings
const defaultSettings = {
  assessmentCompleted: true,
  newResponseSubmitted: true,
  assessmentReminders: false,
  marketingEmails: false
};

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get notification settings for this user
    let settings = notificationSettings.get(userId);
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = { ...defaultSettings };
      notificationSettings.set(userId, settings);
    }
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
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
    const { 
      assessmentCompleted,
      newResponseSubmitted,
      assessmentReminders,
      marketingEmails
    } = data;
    
    // Update notification settings
    const settings = {
      assessmentCompleted: Boolean(assessmentCompleted),
      newResponseSubmitted: Boolean(newResponseSubmitted),
      assessmentReminders: Boolean(assessmentReminders),
      marketingEmails: Boolean(marketingEmails)
    };
    
    notificationSettings.set(userId, settings);
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
} 