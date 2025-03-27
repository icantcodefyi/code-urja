/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

// Google Cloud Speech-to-Text client
import { SpeechClient } from '@google-cloud/speech';

// Create a client using environment variables for authentication
const speechClient = new SpeechClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

interface TranscriptionRequest {
  mediaType: 'video' | 'audio';
  mediaId: string;
  mediaUrl: string;
  // Optional base64 content for blob URLs
  mediaContent?: string;
}

export async function POST(req: Request) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Parse request body
    const body = await req.json() as TranscriptionRequest;
    const { mediaType, mediaId, mediaUrl, mediaContent } = body;
    
    if (!mediaType || !mediaId || (!mediaUrl && !mediaContent)) {
      return NextResponse.json({ 
        error: "Missing required fields: mediaType, mediaId, and either mediaUrl or mediaContent" 
      }, { status: 400 });
    }
    
    // Check if media type is valid
    if (mediaType !== 'video' && mediaType !== 'audio') {
      return NextResponse.json({ 
        error: "Invalid media type. Must be 'video' or 'audio'" 
      }, { status: 400 });
    }
    
    try {
      // Determine how to get audio content based on URL protocol or if content was provided
      let audioContent: string;
      
      // If mediaContent was provided directly (for blob URLs), use it
      if (mediaContent) {
        audioContent = mediaContent;
      } 
      // Handle blob: URLs or other unsupported protocols
      else if (mediaUrl.startsWith('blob:') || !mediaUrl.startsWith('http')) {
        return NextResponse.json({ 
          error: "URLs with 'blob:' protocol cannot be accessed directly by the server. Please provide the media content as base64 in the 'mediaContent' field." 
        }, { status: 400 });
      } 
      // Handle http/https URLs using fetch
      else {
        const response = await fetch(mediaUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch media from URL: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        audioContent = buffer.toString('base64');
      }
      
      // Configure the request to Google Cloud Speech-to-Text with correct typing
      const request = {
        audio: {
          content: audioContent,
        },
        config: {
          encoding: 'LINEAR16' as const,
          // Only specify sample rate for video, let it be auto-detected for audio
          ...(mediaType === 'video' ? { sampleRateHertz: 16000 } : {}),
          languageCode: 'en-US',
          enableAutomaticPunctuation: true,
          model: 'default',
        },
      };
      
      console.log(`Using Speech-to-Text config for ${mediaType}:`, request.config);
      
      // Perform the transcription with proper error handling
      const [response] = await speechClient.recognize(request);

      console.log("Transcription response:", response);
      
      // Log more detailed information about the results
      if (response?.results) {
        console.log("Number of results:", response.results.length);
        response.results.forEach((result, index) => {
          console.log(`Result ${index + 1}:`, {
            alternatives: result.alternatives,
            channelTag: result.channelTag,
            resultEndTime: result.resultEndTime,
            languageCode: result.languageCode
          });
          
          if (result.alternatives && result.alternatives.length > 0) {
            console.log(`Transcription text ${index + 1}:`, result.alternatives[0]?.transcript);
          }
        });
        
        if (response.totalBilledTime) {
          console.log("Total billed time:", response.totalBilledTime);
        }
        
        if (response.requestId) {
          console.log("Request ID:", response.requestId);
        }
      }
      
      // Extract transcription text safely
      let transcription = '';
      
      if (response?.results) {
        transcription = response.results
          .map(result => {
            if (result.alternatives?.[0]?.transcript) {
              return String(result.alternatives[0].transcript);
            }
            return '';
          })
          .filter(Boolean)
          .join('\n');
      }
      
      // Update the database with the transcription
      if (mediaType === 'video') {
        await db.videoResponse.update({
          where: { id: mediaId },
          data: { transcription },
        });
      } else { // mediaType === 'audio'
        await db.audioResponse.update({
          where: { id: mediaId },
          data: { transcription },
        });
      }
      
      return NextResponse.json({ 
        success: true,
        transcription,
      });
    } catch (speechError) {
      console.error("Google Speech-to-Text error:", speechError);
      return NextResponse.json({ 
        error: "Speech-to-Text processing failed", 
        details: speechError instanceof Error ? speechError.message : String(speechError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json({ 
      error: "Failed to process transcription", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}