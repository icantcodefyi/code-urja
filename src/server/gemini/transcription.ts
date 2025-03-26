import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import fs from 'fs';
import fetch from 'node-fetch';
import { tmpdir } from 'os';
import { join } from 'path';

async function transcribeMedia(mediaUrl: string): Promise<string> {
    // Download the media file to a temporary location
    const response = await fetch(mediaUrl);
    if (!response.ok) {
        throw new Error(`Failed to download media file: ${response.statusText}`);
    }

    // Create a temporary file with appropriate extension
    const fileExtension = mediaUrl.split('.').pop() || 'mp3';
    const tempFilePath = join(tmpdir(), `transcription-${Date.now()}.${fileExtension}`);

    // Save the file temporarily
    const buffer = await response.buffer();
    fs.writeFileSync(tempFilePath, buffer);

    try {
        // Read the media file
        const mediaBuffer = fs.readFileSync(tempFilePath);

        const result = await generateText({
            model: google('gemini-2.0-flash-001'),
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Please transcribe this audio/video file into text. Provide only the transcription without any additional commentary.',
                        },
                        {
                            type: 'file',
                            data: mediaBuffer,
                            // Adjust mimeType based on file type (audio/video)
                            mimeType: mediaUrl.endsWith('.mp4') ? 'video/mp4' :
                                mediaUrl.endsWith('.mp3') ? 'audio/mp3' :
                                    'application/octet-stream',
                        },
                    ],
                },
            ],
        });

        return result.text;
    } finally {
        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);
    }
}

export { transcribeMedia };