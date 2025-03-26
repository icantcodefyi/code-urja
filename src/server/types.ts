import type { Prisma } from '@prisma/client';

// Enums
export enum Role {
  CANDIDATE = 'CANDIDATE',
  HR = 'HR',
  ADMIN = 'ADMIN'
}

export enum AssessmentStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REVIEWED = 'REVIEWED'
}

export enum QuestionType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  TEXT = 'TEXT'
}

// Base Types
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
  candidate?: Candidate;
  hrProfile?: HRProfile;
  createdAssessments?: Assessment[];
}

export interface Candidate {
  id: string;
  userId: string;
  user: User;
  resumeUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  assessments: Assessment[];
  videoResponses: VideoResponse[];
  audioResponses: AudioResponse[];
  analysis?: CandidateAnalysis;
}

export interface HRProfile {
  id: string;
  userId: string;
  user: User;
  companyName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assessment {
  id: string;
  candidateId: string;
  candidate: Candidate;
  title: string;
  description: string | null;
  status: AssessmentStatus;
  createdAt: Date;
  updatedAt: Date;
  questions: Question[];
  createdBy: string;
  hrUser: User;
  uniqueLink: string;
  isTemplate: boolean;
  templateName: string | null;
  maxDuration: number | null;
  passingScore: number | null;
  aiAnalysisEnabled: boolean;
}

export interface Question {
  id: string;
  assessmentId: string;
  assessment: Assessment;
  text: string;
  type: QuestionType;
  order: number;
  videoResponse?: VideoResponse;
  audioResponse?: AudioResponse;
}

export interface VideoResponse {
  id: string;
  candidateId: string;
  candidate: Candidate;
  questionId: string;
  question: Question;
  videoUrl: string;
  transcription: string | null;
  duration: number;
  createdAt: Date;
}

export interface AudioResponse {
  id: string;
  candidateId: string;
  candidate: Candidate;
  questionId: string;
  question: Question;
  audioUrl: string;
  transcription: string | null;
  duration: number;
  createdAt: Date;
}

export interface CandidateAnalysis {
  id: string;
  candidateId: string;
  candidate: Candidate;
  overallScore: number;
  intentToJoin: number;
  skillScore: number;
  experienceScore: number;
  strengths: string[];
  analysisJson: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}

// Input Types for Creating/Updating
export interface CreateAssessmentInput {
  title: string;
  description?: string;
  candidateId: string;
  createdBy: string;
  maxDuration?: number;
  passingScore?: number;
  aiAnalysisEnabled?: boolean;
  questions: CreateQuestionInput[];
}

export interface CreateQuestionInput {
  text: string;
  type: QuestionType;
  order: number;
}

export interface UpdateAssessmentInput {
  title?: string;
  description?: string;
  status?: AssessmentStatus;
  maxDuration?: number;
  passingScore?: number;
  aiAnalysisEnabled?: boolean;
}

export interface CreateVideoResponseInput {
  candidateId: string;
  questionId: string;
  videoUrl: string;
  duration: number;
  transcription?: string;
}

export interface CreateAudioResponseInput {
  candidateId: string;
  questionId: string;
  audioUrl: string;
  duration: number;
  transcription?: string;
}

export interface CreateCandidateAnalysisInput {
  candidateId: string;
  overallScore: number;
  intentToJoin: number;
  skillScore: number;
  experienceScore: number;
  strengths: string[];
  analysisJson?: Prisma.JsonValue;
}
