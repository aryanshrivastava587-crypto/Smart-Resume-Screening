export interface AnalysisResult {
  matchScore: number;
  summary: string;
  missingKeywords: string[];
  suggestedImprovements: string[];
}

export interface SuggestedJob {
  jobTitle: string;
  rationale: string;
  keySkills: string[];
}

export interface User {
  email: string;
  name: string;
}
