import { Resend } from 'resend';
import EmailTemplate from '~/components/email-template';
import type { ReactElement } from 'react';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendAssessmentEmailParams {
  // Recipient information (not used anymore as we're sending to ourselves)
  toEmail: string;
  
  // Candidate information
  candidateName: string;
  positionName: string;
  companyName: string;
  
  // Assessment details  
  assessmentId: string;
  assessmentDate: string;
  dashboardLink: string;
  
  // Optional analysis results
  overallScore?: number;
  skillScore?: number;
  experienceScore?: number;
  intentScore?: number;
  strengths?: string[];
}

export async function sendAssessmentCompletionEmail({
  toEmail, // No longer used directly
  candidateName,
  positionName,
  companyName,
  assessmentId,
  assessmentDate,
  dashboardLink,
  overallScore,
  skillScore,
  experienceScore,
  intentScore,
  strengths,
}: SendAssessmentEmailParams) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not set. Emails cannot be sent.');
      return null;
    }
    
    // Format the date if needed
    const formattedDate = assessmentDate 
      ? new Date(assessmentDate).toLocaleDateString() 
      : new Date().toLocaleDateString();
    
    // Create the email template as a React element
    const emailContent = EmailTemplate({ 
      candidateName,
      positionName,
      companyName,
      assessmentId,
      assessmentDate: formattedDate,
      dashboardLink,
      overallScore,
      skillScore,
      experienceScore,
      intentScore,
      strengths,
    }) as ReactElement;
    
    // Using Resend's official sender domain and sending to yourself
    const myEmail = "venti.sillly@gmail.com"; // Your personal email
    
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Resend's official sender
      to: [myEmail], // Always send to your personal email
      subject: `Assessment Analysis Complete: ${candidateName} for ${positionName}`,
      react: emailContent,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error as Error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
} 