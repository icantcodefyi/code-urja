/* eslint-disable @typescript-eslint/only-throw-error */
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const user = auth(req);

            // If you throw, the user will not be able to upload
            if (!user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.ufsUrl);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId };
        }),
        
    // Add support for video file uploads
    videoUploader: f({
        video: {
            maxFileSize: "64MB", // Adjust based on your needs
            maxFileCount: 1,
        },
    })
        .middleware(async ({ req }) => {
            const user = auth(req);
            if (!user) throw new UploadThingError("Unauthorized");
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Video upload complete for userId:", metadata.userId);
            console.log("Video file url", file.ufsUrl);
            return { uploadedBy: metadata.userId, url: file.ufsUrl };
        }),
        
    // Add support for audio file uploads
    audioUploader: f({
        audio: {
            maxFileSize: "16MB", // Adjust based on your needs
            maxFileCount: 1,
        },
    })
        .middleware(async ({ req }) => {
            const user = auth(req);
            if (!user) throw new UploadThingError("Unauthorized");
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Audio upload complete for userId:", metadata.userId);
            console.log("Audio file url", file.ufsUrl);
            return { uploadedBy: metadata.userId, url: file.ufsUrl };
        }),
        
    // Add support for resume file uploads
    resumeUploader: f({
        "application/pdf": {
            maxFileSize: "8MB",
            maxFileCount: 1,
        },
        "application/msword": {
            maxFileSize: "8MB",
            maxFileCount: 1,
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            maxFileSize: "8MB",
            maxFileCount: 1,
        },
    })
        .middleware(async ({ req }) => {
            const user = auth(req);
            if (!user) throw new UploadThingError("Unauthorized");
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Resume upload complete for userId:", metadata.userId);
            console.log("Resume file url", file.ufsUrl);
            return { uploadedBy: metadata.userId, url: file.ufsUrl };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
