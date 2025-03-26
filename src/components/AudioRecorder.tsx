"use client";

import { useState, useRef, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Button } from "~/components/ui/button";
import { Mic, StopCircle, RotateCw, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AudioRecorderProps {
  onRecordingComplete: (audioUrl: string) => void;
  onError?: (error: Error) => void;
  maxDuration?: number; // in seconds
}

export default function AudioRecorder({
  onRecordingComplete,
  onError,
  maxDuration = 120, // default 2 minutes
}: AudioRecorderProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Set up react-media-recorder
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    video: false,
    blobPropertyBag: { type: 'audio/mp3' },
    // @ts-expect-error - onError is not in the type definition but works in practice
    onError: (error: unknown) => {
      console.error("Recording error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setRecordingError(`Error recording: ${errorMessage}`);
      if (onError && error instanceof Error) onError(error);
    }
  });

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
  };
  
  // Confirm the recording
  const confirmRecording = () => {
    if (mediaBlobUrl) {
      setIsConfirmed(true);
      onRecordingComplete(mediaBlobUrl);
      // Show toast notification about transcription
      toast.info("Audio recorded", {
        description: "Your audio will be transcribed when you submit the assessment."
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
        return 'Accessing microphone...';
      default:
        return 'Preparing...';
    }
  };
  
  // Check if recording is in progress
  const isRecording = status === 'recording';
  
  // Check if media is available
  const hasMedia = Boolean(mediaBlobUrl);

  return (
    <div className="flex flex-col gap-4">
      {/* Status indicator */}
      <div className="rounded-md bg-muted h-12 flex items-center justify-center">
        {isRecording ? (
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-red-500">●</span>
            <span>Recording... {formatTime(recordingTime)}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">
            {getStatusMessage()}
          </span>
        )}
      </div>
      
      {/* Error message */}
      {recordingError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {recordingError}
        </div>
      )}
      
      {/* Audio preview */}
      {mediaBlobUrl && (
        <div className="border border-primary p-3 rounded-md bg-primary/5">
          <p className="text-sm mb-2 font-medium">Your recording:</p>
          <audio 
            ref={audioRef} 
            className="w-full" 
            controls 
            src={mediaBlobUrl}
            preload="auto"
            onError={(e) => {
              console.error("Audio error:", e);
              setRecordingError("Error playing audio. Please try recording again.");
            }}
          />
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
            <Mic className="mr-2 h-4 w-4" />
            {status === 'acquiring_media' ? 'Preparing...' : 'Start Recording'}
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
              onClick={confirmRecording}
              variant="default"
              className="flex-1"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Use This Recording
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
        </div>
      )}
    </div>
  );
} 