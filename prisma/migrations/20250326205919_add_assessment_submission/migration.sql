/*
  Warnings:

  - You are about to drop the column `candidateId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Assessment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionId,submissionId]` on the table `AudioResponse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[questionId,submissionId]` on the table `TextResponse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[questionId,submissionId]` on the table `VideoResponse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `submissionId` to the `AudioResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionId` to the `TextResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionId` to the `VideoResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_candidateId_fkey";

-- DropIndex
DROP INDEX "AudioResponse_questionId_candidateId_key";

-- DropIndex
DROP INDEX "TextResponse_questionId_candidateId_key";

-- DropIndex
DROP INDEX "VideoResponse_questionId_candidateId_key";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "candidateId",
DROP COLUMN "status";

-- CreateTable
CREATE TABLE "assessment_submission" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "assessment_submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assessment_submission_assessmentId_candidateId_key" ON "assessment_submission"("assessmentId", "candidateId");

-- Create default submissions for existing responses
-- First for video responses
INSERT INTO "assessment_submission" ("id", "assessmentId", "candidateId", "status")
SELECT 
  'default-sub-' || "candidateId" || '-' || "Question"."assessmentId", 
  "Question"."assessmentId", 
  "VideoResponse"."candidateId", 
  'COMPLETED'
FROM "VideoResponse"
JOIN "Question" ON "VideoResponse"."questionId" = "Question"."id"
GROUP BY "Question"."assessmentId", "VideoResponse"."candidateId"
ON CONFLICT DO NOTHING;

-- Then for audio responses
INSERT INTO "assessment_submission" ("id", "assessmentId", "candidateId", "status")
SELECT 
  'default-sub-' || "candidateId" || '-' || "Question"."assessmentId", 
  "Question"."assessmentId", 
  "AudioResponse"."candidateId", 
  'COMPLETED'
FROM "AudioResponse"
JOIN "Question" ON "AudioResponse"."questionId" = "Question"."id"
GROUP BY "Question"."assessmentId", "AudioResponse"."candidateId"
ON CONFLICT DO NOTHING;

-- Finally for text responses
INSERT INTO "assessment_submission" ("id", "assessmentId", "candidateId", "status")
SELECT 
  'default-sub-' || "candidateId" || '-' || "Question"."assessmentId", 
  "Question"."assessmentId", 
  "TextResponse"."candidateId", 
  'COMPLETED'
FROM "TextResponse"
JOIN "Question" ON "TextResponse"."questionId" = "Question"."id"
GROUP BY "Question"."assessmentId", "TextResponse"."candidateId"
ON CONFLICT DO NOTHING;

-- Now add the submissionId column to response tables
-- First add the column as nullable
ALTER TABLE "VideoResponse" ADD COLUMN "submissionId" TEXT;
ALTER TABLE "AudioResponse" ADD COLUMN "submissionId" TEXT;
ALTER TABLE "TextResponse" ADD COLUMN "submissionId" TEXT;

-- Update existing records with their default submission IDs
UPDATE "VideoResponse"
SET "submissionId" = 'default-sub-' || "candidateId" || '-' || "Question"."assessmentId"
FROM "Question"
WHERE "VideoResponse"."questionId" = "Question"."id";

UPDATE "AudioResponse"
SET "submissionId" = 'default-sub-' || "candidateId" || '-' || "Question"."assessmentId"
FROM "Question"
WHERE "AudioResponse"."questionId" = "Question"."id";

UPDATE "TextResponse"
SET "submissionId" = 'default-sub-' || "candidateId" || '-' || "Question"."assessmentId"
FROM "Question"
WHERE "TextResponse"."questionId" = "Question"."id";

-- Now make the column NOT NULL
ALTER TABLE "VideoResponse" ALTER COLUMN "submissionId" SET NOT NULL;
ALTER TABLE "AudioResponse" ALTER COLUMN "submissionId" SET NOT NULL;
ALTER TABLE "TextResponse" ALTER COLUMN "submissionId" SET NOT NULL;

-- Add unique constraints
CREATE UNIQUE INDEX "AudioResponse_questionId_submissionId_key" ON "AudioResponse"("questionId", "submissionId");
CREATE UNIQUE INDEX "TextResponse_questionId_submissionId_key" ON "TextResponse"("questionId", "submissionId");
CREATE UNIQUE INDEX "VideoResponse_questionId_submissionId_key" ON "VideoResponse"("questionId", "submissionId");

-- Add foreign keys
ALTER TABLE "VideoResponse" ADD CONSTRAINT "VideoResponse_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "assessment_submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AudioResponse" ADD CONSTRAINT "AudioResponse_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "assessment_submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TextResponse" ADD CONSTRAINT "TextResponse_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "assessment_submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign keys for assessment submission
ALTER TABLE "assessment_submission" ADD CONSTRAINT "assessment_submission_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "assessment_submission" ADD CONSTRAINT "assessment_submission_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
