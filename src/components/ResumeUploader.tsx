"use client";

import { useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { UploadButton } from "~/utils/uploadthing";
import { FileText, Upload, X, CheckCircle, FileCheck } from "lucide-react";

interface ResumeUploaderProps {
  onUploadComplete: (fileUrl: string) => void;
  onUploadError?: (error: Error) => void;
}

export default function ResumeUploader({
  onUploadComplete,
  onUploadError,
}: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const handleUploadComplete = useCallback(
    (files: { url: string; name: string }[]) => {
      setIsUploading(false);
      if (files && files.length > 0 && files[0]?.url && files[0]?.name) {
        setUploadedFile(files[0].url);
        setFileName(files[0].name);
        onUploadComplete(files[0].url);
      }
    },
    [onUploadComplete]
  );
  
  const handleUploadError = useCallback(
    (error: Error) => {
      setIsUploading(false);
      if (onUploadError) {
        onUploadError(error);
      }
    },
    [onUploadError]
  );
  
  const resetUpload = useCallback(() => {
    setUploadedFile(null);
    setFileName(null);
  }, []);

  return (
    <div className="w-full">
      {!uploadedFile ? (
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 flex flex-col items-center justify-center">
          <FileText className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Upload your resume in PDF, DOC, or DOCX format
          </p>
          
          <UploadButton
            endpoint="resumeUploader"
            content={{
              allowedContent() {
                return (
                  <p className="text-xs text-muted-foreground mt-2">
                    PDF, DOC, or DOCX up to 8MB
                  </p>
                );
              }
            }}
            onClientUploadComplete={(files) => {
              if (files && files.length > 0) {
                handleUploadComplete(files);
              }
            }}
            onUploadError={handleUploadError}
            onUploadBegin={() => setIsUploading(true)}
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-md">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-muted-foreground">
                  Resume uploaded successfully
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={resetUpload}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 