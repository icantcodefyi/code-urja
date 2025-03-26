'use client';

import { useState } from 'react';
import type { CreateAssessmentInput } from '~/server/types';
import { QuestionType } from '~/server/types';

interface ApiError {
  error: string;
  details?: unknown;
}

type ApiResponse = CreateAssessmentInput | ApiError;

export default function AssessmentGenerator() {
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<CreateAssessmentInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const input = {
      jobTitle: formData.get('jobTitle') as string,
      experienceLevel: formData.get('experienceLevel') as string,
      requiredSkills: (formData.get('requiredSkills') as string).split(',').map(s => s.trim()),
      companyContext: formData.get('companyContext') as string,
      assessmentType: formData.get('assessmentType') as 'TECHNICAL' | 'BEHAVIORAL' | 'MIXED',
      numberOfQuestions: Number(formData.get('numberOfQuestions')),
      preferredDuration: Number(formData.get('preferredDuration')),
    };

    try {
      const response = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const data = await response.json() as ApiResponse;

      if (!response.ok) {
        const errorData = data as ApiError;
        throw new Error(errorData.error ?? 'Failed to generate assessment');
      }

      setAssessment(data as CreateAssessmentInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Assessment Generator</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            required
            className="w-full p-2 border rounded"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Experience Level</label>
          <select name="experienceLevel" required className="w-full p-2 border rounded">
            <option value="Junior">Junior</option>
            <option value="Mid">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Required Skills (comma-separated)</label>
          <input
            type="text"
            name="requiredSkills"
            required
            className="w-full p-2 border rounded"
            placeholder="e.g., TypeScript, React, Node.js"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Company Context</label>
          <textarea
            name="companyContext"
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Brief description of your company and culture"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Assessment Type</label>
          <select name="assessmentType" required className="w-full p-2 border rounded">
            <option value="TECHNICAL">Technical</option>
            <option value="BEHAVIORAL">Behavioral</option>
            <option value="MIXED">Mixed</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Number of Questions</label>
            <input
              type="number"
              name="numberOfQuestions"
              min="1"
              max="20"
              defaultValue="5"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
            <input
              type="number"
              name="preferredDuration"
              min="15"
              max="180"
              defaultValue="60"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Generating...' : 'Generate Assessment'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {assessment && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold">Generated Assessment</h2>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{assessment.title}</h3>
            <p className="text-gray-600 mb-4">{assessment.description}</p>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Duration: {assessment.maxDuration} minutes</span>
                <span>Passing Score: {assessment.passingScore}%</span>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Questions</h4>
                <div className="space-y-4">
                  {assessment.questions.map((question, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">Question {index + 1}</span>
                        <span className="text-sm text-gray-500">{question.type}</span>
                      </div>
                      <p>{question.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
