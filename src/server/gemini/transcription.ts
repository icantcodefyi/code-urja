/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import fs from 'fs';
import { mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';

export interface TranscriptionOptions {
  questionId: string;
  candidateId: string;
  mediaType: 'VIDEO' | 'AUDIO';
  duration?: number; // Duration in seconds
}

// Transcription status enum (not stored in DB)
enum TranscriptionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

/**
 * Transcribes audio or video content from a URL and saves it to the database
 * @param mediaUrl URL to the media file (audio or video)
 * @param options Options including questionId, candidateId, and mediaType
 * @returns Transcribed text content
 */
export async function transcribeMedia(
  mediaUrl: string, 
  options: TranscriptionOptions
): Promise<string> {
    try {
        console.log(`Starting transcription for media at: ${mediaUrl}`);
        console.log(`Media type: ${options.mediaType}, Question ID: ${options.questionId}, Candidate ID: ${options.candidateId}`);
        
        // Check if this is a blob URL (which can't be directly fetched server-side)
        if (mediaUrl.startsWith('blob:')) {
            console.log('Detected blob URL. These cannot be accessed server-side.');
            
            // Create a descriptive placeholder that explains why processing failed
            const placeholder = createPlaceholderTranscription(options.mediaType);
            
            // Save placeholder to database
            await saveTranscriptionToDatabase(
                options.questionId,
                options.candidateId,
                mediaUrl,
                placeholder,
                options.mediaType,
                options.duration ?? 0
            );
            
            return placeholder;
        }
        
        // Create temp directory for media processing with a UUID for uniqueness
        const tempDir = path.join(tmpdir(), `media-process-${uuidv4()}`);
        await mkdir(tempDir, { recursive: true });
        
        // Ensure mediaUrl is properly formatted
        if (mediaUrl.includes('utfs.io') && !mediaUrl.startsWith('http')) {
            mediaUrl = `https://${mediaUrl}`;
        }
        
        // Download the media file to a temporary location with proper error handling
        let response;
        try {
            response = await fetch(mediaUrl, { 
                headers: { 'Accept': '*/*' },
                redirect: 'follow'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to download media file: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching media URL:', error);
            const errorMessage = `Failed to download media: ${error instanceof Error ? error.message : String(error)}`;
            await saveTranscriptionToDatabase(
                options.questionId,
                options.candidateId,
                mediaUrl,
                errorMessage,
                options.mediaType,
                options.duration ?? 0
            );
            return errorMessage;
        }

        // Detect content type for appropriate file extension
        const contentType = response.headers.get('content-type') ?? '';
        let fileExtension;
        
        if (contentType.includes('mp4')) {
            fileExtension = 'mp4';
        } else if (contentType.includes('quicktime') || contentType.includes('mov')) {
            fileExtension = 'mov';
        } else if (contentType.includes('mp3')) {
            fileExtension = 'mp3';
        } else if (contentType.includes('wav')) {
            fileExtension = 'wav';
        } else if (contentType.includes('webm')) {
            fileExtension = 'webm';
        } else {
            // Default to mp3 for audio or mp4 for video if type can't be determined
            fileExtension = options.mediaType === 'AUDIO' ? 'mp3' : 'mp4';
        }
        
        const tempFilePath = path.join(tempDir, `transcription-${uuidv4()}.${fileExtension}`);
        console.log(`Saving temporary file to: ${tempFilePath}`);

        // Save the file temporarily with proper error handling
        try {
            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync(tempFilePath, buffer);
            console.log(`Media file saved successfully, size: ${buffer.length} bytes`);
        } catch (writeError) {
            console.error('Error writing media file:', writeError);
            const errorMessage = `Failed to save media file: ${writeError instanceof Error ? writeError.message : String(writeError)}`;
            await saveTranscriptionToDatabase(
                options.questionId,
                options.candidateId,
                mediaUrl,
                errorMessage,
                options.mediaType,
                options.duration ?? 0
            );
            return errorMessage;
        }

        let transcription = '';
        
        try {
            // Read the media file
            const mediaBuffer = fs.readFileSync(tempFilePath);
            console.log(`Media file loaded for transcription, size: ${mediaBuffer.length} bytes`);

            // Determine MIME type for the AI model
            let mimeType: string;
            switch (fileExtension) {
                case 'mp4':
                    mimeType = 'video/mp4';
                    break;
                case 'mov':
                    mimeType = 'video/quicktime';
                    break;
                case 'mp3':
                    mimeType = 'audio/mp3';
                    break;
                case 'wav':
                    mimeType = 'audio/wav';
                    break;
                case 'webm':
                    mimeType = options.mediaType === 'AUDIO' ? 'audio/webm' : 'video/webm';
                    break;
                default:
                    mimeType = options.mediaType === 'AUDIO' ? 'audio/mp3' : 'video/mp4';
            }

            console.log(`Using MIME type: ${mimeType} for transcription`);
            
            // Try OpenAI for audio - it has better transcription quality
            if (options.mediaType === 'AUDIO') {
                try {
                    console.log('Attempting transcription with OpenAI');
                    const result = await generateText({
                        model: openai('gpt-4o'),
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    {
                                        type: 'text',
                                        text: 'Please transcribe this audio file. Provide only the transcription without any additional commentary.',
                                    },
                                    {
                                        type: 'file',
                                        data: mediaBuffer,
                                        mimeType,
                                    },
                                ],
                            },
                        ],
                    });
                    
                    transcription = result.text;
                    console.log('OpenAI transcription completed successfully');
                } catch (openaiError) {
                    console.error('OpenAI transcription failed, falling back to Gemini:', openaiError);
                    // Fall back to Gemini for transcription
                    transcription = await transcribeWithGemini(mediaBuffer, mimeType, options.mediaType);
                }
            } else {
                // For video content, use Gemini which is better at handling video inputs
                transcription = await transcribeWithGemini(mediaBuffer, mimeType, options.mediaType);
            }
            
            // Save the transcription to the database
            await saveTranscriptionToDatabase(
                options.questionId,
                options.candidateId,
                mediaUrl,
                transcription,
                options.mediaType,
                options.duration ?? 0
            );
            
            return transcription;
        } finally {
            // Clean up the temporary files
            try {
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                    console.log(`Temporary file removed: ${tempFilePath}`);
                }
                // Remove the temp directory too
                fs.rmdirSync(tempDir, { recursive: true });
                console.log(`Temporary directory removed: ${tempDir}`);
            } catch (cleanupError) {
                console.error('Error cleaning up temporary files:', cleanupError);
            }
        }
    } catch (error) {
        console.error('Transcription error:', error);
        // Return a fallback error message
        const errorMessage = error instanceof Error 
            ? `[Transcription failed: ${error.message}]`
            : '[Transcription failed due to an unknown error]';
            
        // Still try to save the error to the database
        await saveTranscriptionToDatabase(
            options.questionId,
            options.candidateId,
            mediaUrl,
            errorMessage,
            options.mediaType,
            options.duration ?? 0
        );
        
        return errorMessage;
    }
}

/**
 * Helper function to transcribe media using Gemini
 */
async function transcribeWithGemini(
    mediaBuffer: Buffer, 
    mimeType: string, 
    mediaType: 'VIDEO' | 'AUDIO'
): Promise<string> {
    console.log(`Transcribing ${mediaType.toLowerCase()} with Gemini`);
    const isAudio = mediaType === 'AUDIO';
    
    const result = await generateText({
        model: google('gemini-2.0-flash-001'),
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `Please accurately transcribe this ${isAudio ? 'audio' : 'video'} file. Provide only the transcription without any additional commentary.`,
                    },
                    {
                        type: 'file',
                        data: mediaBuffer,
                        mimeType,
                    },
                ],
            },
        ],
    });

    console.log('Gemini transcription completed successfully');
    return result.text;
}

/**
 * Creates useful placeholder text for when transcription can't be done
 */
function createPlaceholderTranscription(mediaType: 'VIDEO' | 'AUDIO'): string {
    if (mediaType === 'VIDEO') {
        return `[This is a placeholder for a video response that couldn't be transcribed server-side. 
The video was recorded successfully but is stored as a blob URL, which cannot be accessed by the server.
To enable automatic transcription of videos:
1. Configure the video recorder to upload directly to cloud storage
2. Pass the permanent URL to the server instead of a blob URL
3. Use a video upload component that supports server-side processing]`;
    } else {
        return `[This is a placeholder for an audio response that couldn't be transcribed server-side.
The audio was recorded successfully but is stored as a blob URL, which cannot be accessed by the server.
To enable automatic transcription of audio recordings:
1. Configure the audio recorder to upload directly to cloud storage
2. Pass the permanent URL to the server instead of a blob URL
3. Use an audio upload component that supports server-side processing]`;
    }
}

/**
 * Saves transcription to the appropriate database table
 */
async function saveTranscriptionToDatabase(
    questionId: string,
    candidateId: string,
    mediaUrl: string,
    transcription: string,
    mediaType: 'VIDEO' | 'AUDIO',
    duration: number
): Promise<void> {
    try {
        console.log(`Saving ${mediaType.toLowerCase()} transcription to database`);
        
        if (mediaType === 'VIDEO') {
            // Check if there's an existing video response for this candidate and question
            const existingResponse = await db.videoResponse.findFirst({
                where: {
                    questionId,
                    candidateId
                },
            });
            
            if (existingResponse) {
                // Update existing response
                await db.videoResponse.update({
                    where: { id: existingResponse.id },
                    data: {
                        transcription,
                        videoUrl: mediaUrl,
                        duration
                    },
                });
                console.log(`Updated existing video transcription for candidate ${candidateId}, question ${questionId}`);
            } else {
                // Create new response with a unique ID for this candidate
                await db.videoResponse.create({
                    data: {
                        candidateId,
                        questionId,
                        videoUrl: mediaUrl,
                        transcription,
                        duration,
                    },
                });
                console.log(`Created new video response with transcription for candidate ${candidateId}, question ${questionId}`);
            }
        } else if (mediaType === 'AUDIO') {
            // Check if there's an existing audio response for this candidate and question
            const existingResponse = await db.audioResponse.findFirst({
                where: {
                    questionId,
                    candidateId
                },
            });
            
            if (existingResponse) {
                // Update existing response
                await db.audioResponse.update({
                    where: { id: existingResponse.id },
                    data: {
                        transcription,
                        audioUrl: mediaUrl,
                        duration
                    },
                });
                console.log(`Updated existing audio transcription for candidate ${candidateId}, question ${questionId}`);
            } else {
                // Create new response with a unique ID for this candidate
                await db.audioResponse.create({
                    data: {
                        candidateId,
                        questionId,
                        audioUrl: mediaUrl,
                        transcription,
                        duration,
                    },
                });
                console.log(`Created new audio response with transcription for candidate ${candidateId}, question ${questionId}`);
            }
        }
    } catch (dbError) {
        console.error(`Error saving ${mediaType.toLowerCase()} transcription to database:`, dbError);
        // We'll log but not rethrow since we still want to return what transcription we have
    }
}
