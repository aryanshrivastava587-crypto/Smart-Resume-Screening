import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, SuggestedJob } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 representing how well the resume matches the job description. Higher is better.",
    },
    summary: {
        type: Type.STRING,
        description: "A concise, 2-3 sentence summary of the candidate's suitability for the role based on their resume.",
    },
    missingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of important skills or keywords from the job description that are missing or weakly represented in the resume."
    },
    suggestedImprovements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of actionable suggestions for the candidate to improve their resume for this specific job application."
    }
  },
  required: ["matchScore", "summary", "missingKeywords", "suggestedImprovements"],
};

const jobSuggestionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      jobTitle: {
        type: Type.STRING,
        description: "A specific and clear job title that matches the candidate's profile.",
      },
      rationale: {
        type: Type.STRING,
        description: "A 2-3 sentence explanation of why this job is a good fit, referencing the resume.",
      },
      keySkills: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of 3-5 key skills from the resume relevant to this job title.",
      },
    },
    required: ['jobTitle', 'rationale', 'keySkills'],
  },
};


export async function analyzeResume(resumeFile: File, jobDescription: string): Promise<AnalysisResult> {
  try {
    const base64Resume = await fileToBase64(resumeFile);

    const resumePart = {
      inlineData: {
        mimeType: resumeFile.type,
        data: base64Resume,
      },
    };

    const textPart = {
      text: `
        Job Description:
        ---
        ${jobDescription}
        ---
        Please analyze the attached resume against the provided job description. Evaluate the resume for relevant skills, experience, and qualifications. Provide a match score, a summary, a list of missing keywords, and suggestions for improvement.
      `,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [resumePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Validate the result
    if (
      typeof result.matchScore !== 'number' ||
      typeof result.summary !== 'string' ||
      !Array.isArray(result.missingKeywords) ||
      !Array.isArray(result.suggestedImprovements)
    ) {
      throw new Error("Invalid response format from API");
    }

    return result as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to get analysis from the AI. Please check the console for more details.");
  }
}

export async function findMatchingJobs(resumeFile: File): Promise<SuggestedJob[]> {
  try {
    const base64Resume = await fileToBase64(resumeFile);

    const resumePart = {
      inlineData: {
        mimeType: resumeFile.type,
        data: base64Resume,
      },
    };

    const textPart = {
      text: `
        You are an expert career coach and professional recruiter. Your task is to analyze the provided resume and suggest suitable job roles.

        Based on the skills, experience, and qualifications outlined in the resume, please identify and suggest 3-5 specific job titles that would be a strong match for this candidate.

        For each job suggestion, provide:
        1. A clear job title.
        2. A concise 2-3 sentence rationale explaining why the candidate is a good fit for this role, referencing specific details from their resume.
        3. A list of the top 3-5 key skills from the resume that are most relevant to the suggested job.

        Return the result in the specified JSON format.
      `,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [resumePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: jobSuggestionSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // Basic validation
    if (!Array.isArray(result) || result.some(item => typeof item.jobTitle !== 'string' || typeof item.rationale !== 'string' || !Array.isArray(item.keySkills))) {
        throw new Error("Invalid response format from API for job suggestions.");
    }

    return result as SuggestedJob[];

  } catch (error) {
    console.error("Error finding matching jobs:", error);
    throw new Error("Failed to get job suggestions from the AI. Please check the console for more details.");
  }
}
