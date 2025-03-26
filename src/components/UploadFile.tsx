"use client";

import { UploadButton } from "~/utils/uploadthing";

interface UploadFileProps {
    onUploadComplete: (files: { url: string; name: string; type: string }[]) => void;
    onUploadError?: (error: Error) => void;
}

export default function UploadFile({ onUploadComplete, onUploadError }: UploadFileProps) {
    return (
        <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
                onUploadComplete(res);
            }}
            onUploadError={(error: Error) => {
                if (onUploadError) {
                    onUploadError(error);
                } else {
                    console.error("Upload error:", error);
                }
            }}
        />
    );
}
