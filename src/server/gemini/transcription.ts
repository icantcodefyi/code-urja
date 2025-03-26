import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import fs from 'fs';

async function transcribeMedia(mediaUrl: string): Promise<string> {
    // Read the media file
    const mediaBuffer = fs.readFileSync(mediaUrl);

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
}

export { transcribeMedia };