"use client";

import { useState, useRef, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Button } from "~/components/ui/button";
import { Camera, StopCircle, RotateCw, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useUploadThing } from "~/utils/uploadthing";

interface VideoRecorderProps {
  onRecordingComplete: (videoUrl: string, serverUrl?: string) => void;
  onError?: (error: Error) => void;
  maxDuration?: number; // in seconds
}

export default function VideoRecorder({
  onRecordingComplete,
  onError,
  maxDuration = 120, // default 2 minutes
}: VideoRecorderProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Use the uploadthing hook
  const { startUpload, isUploading: isUploadingFile } = useUploadThing("videoUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0 && res[0]?.url) {
        const uploadedUrl = res[0].url;
        setServerUrl(uploadedUrl);
        
        // Update the parent with the server URL
        onRecordingComplete(uploadedUrl);
        
        console.log("Video uploaded to server:", uploadedUrl);
      }
      setIsUploading(false);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      setRecordingError(`Error uploading video: ${error.message}`);
      if (onError) onError(error);
      setIsUploading(false);
    }
  });

  // Set up react-media-recorder
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
    previewStream
  } = useReactMediaRecorder({
    video: true,
    audio: true,
    blobPropertyBag: { type: 'video/mp4' },
    // @ts-expect-error - onError is not in the type definition but works in practice
    onError: (error: unknown) => {
      console.error("Recording error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setRecordingError(`Error recording: ${errorMessage}`);
      if (onError && error instanceof Error) onError(error);
    }
  });

  // Connect preview stream to video element
  useEffect(() => {
    if (liveVideoRef.current && previewStream) {
      liveVideoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  // Update isUploading state when the uploadthing status changes
  useEffect(() => {
    setIsUploading(isUploadingFile);
  }, [isUploadingFile]);

  // Handle recording timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (status === 'recording') {
      // Start timer
      setRecordingTime(0);
      intervalId = setInterval(() => {
        setRecordingTime((prev) => {
          // Check if max duration reached
          if (prev + 1 >= maxDuration) {
            // Use the most recent version of stopRecording by calling it directly
            // without adding it to the dependency array
            stopRecording();
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
      
      // Store timeout ID
      timeoutIdRef.current = intervalId;
    } else if (timeoutIdRef.current) {
      // Clear timer when not recording
      clearInterval(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    
    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (timeoutIdRef.current) {
        clearInterval(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
    // Deliberately exclude stopRecording from deps to avoid the infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, maxDuration]);
  
  // Reset recording
  const resetRecording = () => {
    setIsConfirmed(false);
    setRecordingTime(0);
    clearBlobUrl();
    setRecordingError(null);
    setServerUrl(null);
  };
  
  // Utility to convert blob to File
  const blobToFile = async (blobUrl: string, fileName: string): Promise<File> => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: 'video/mp4' });
  };

  // Upload video file to server
  const uploadToServer = async (blobUrl: string): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // Convert blob to File
      const file = await blobToFile(blobUrl, `video-recording-${Date.now()}.mp4`);
      
      // Use uploadthing to upload the file
      void startUpload([file]);
      
      // The result will be handled in the onClientUploadComplete callback
      return null;
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setRecordingError(`Error uploading video: ${errorMessage}`);
      if (onError && error instanceof Error) onError(error);
      return null;
    }
  };
  
  // Confirm the recording
  const confirmRecording = async () => {
    if (mediaBlobUrl) {
      setIsConfirmed(true);
      
      if (serverUrl) {
        // If we already have the server URL, use it as the content
        onRecordingComplete(serverUrl);
      } else {
        // If no server URL yet, start upload and use local URL temporarily
        onRecordingComplete(mediaBlobUrl);
        // Initiate upload in the background
        void uploadToServer(mediaBlobUrl);
      }
      
      // Show toast notification
      toast.info("Video recorded", {
        description: "Your video will be transcribed when you submit the assessment."
      });
    }
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };
  
  // Check if recording is in progress
  const isRecording = status === 'recording';
  
  // Check if media is available
  const hasMedia = Boolean(mediaBlobUrl);

  // Get human-readable status
  const getStatusMessage = () => {
    switch (status) {
      case 'recording':
        return 'Recording...';
      case 'idle':
        return mediaBlobUrl ? 'Review your recording' : 'Ready to record';
      case 'stopped':
        return 'Recording complete';
      case 'acquiring_media':
        return 'Accessing camera...';
      default:
        return 'Preparing...';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full rounded-md overflow-hidden bg-muted aspect-video">
        {/* Show the preview stream during setup and recording */}
        {!mediaBlobUrl && (
          <video
            ref={liveVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted // Mute to prevent feedback
          />
        )}
        
        {/* Show recorded video after recording */}
        {mediaBlobUrl && (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={mediaBlobUrl}
            controls
            playsInline
          />
        )}
        
        {isRecording && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md flex items-center gap-1">
            <span className="animate-pulse">●</span>
            <span>{formatTime(recordingTime)}</span>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded-md flex items-center gap-1">
            <span className="animate-pulse">●</span>
            <span>Uploading...</span>
          </div>
        )}
        
        {status === 'acquiring_media' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            <p>Getting camera access...</p>
          </div>
        )}

        {!isRecording && !mediaBlobUrl && status !== 'acquiring_media' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
            <p>{getStatusMessage()}</p>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {recordingError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {recordingError}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        {!isRecording && !hasMedia && (
          <Button 
            onClick={startRecording}
            className="w-full"
            variant="default"
            disabled={status === 'acquiring_media'}
          >
            <Camera className="mr-2 h-4 w-4" />
            {status === 'acquiring_media' ? 'Preparing Camera...' : 'Start Recording'}
          </Button>
        )}
        
        {isRecording && (
          <Button 
            onClick={stopRecording}
            className="w-full"
            variant="destructive"
          >
            <StopCircle className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        )}
        
        {hasMedia && !isConfirmed && (
          <div className="flex w-full gap-2">
            <Button 
              onClick={resetRecording}
              variant="outline"
              size="sm"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Record Again
            </Button>
            
            <Button
              onClick={() => void confirmRecording()}
              variant="default"
              className="flex-1"
              disabled={isUploading}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Use This Recording'}
            </Button>
          </div>
        )}
        
        {isConfirmed && (
          <Button 
            onClick={resetRecording}
            variant="outline"
            size="sm"
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Record Again
          </Button>
        )}
      </div>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground mt-2 border-t pt-2">
          <p>Status: {status}</p>
          {mediaBlobUrl && <p>Media URL: {mediaBlobUrl.substring(0, 30)}...</p>}
          {serverUrl && <p>Server URL: {serverUrl.substring(0, 30)}...</p>}
        </div>
      )}
    </div>
  );
}