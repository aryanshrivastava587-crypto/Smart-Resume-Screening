
import React from 'react';
import type { AnalysisResult } from '../types';
import ProgressBar from './ProgressBar';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<{ title: string; children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex items-center mb-3">
      <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-100 text-brand-accent flex-shrink-0">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-brand-dark">{title}</h3>
    </div>
    {children}
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8 mt-10 animate-fade-in">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <ProgressBar score={result.matchScore} />
        <p className="mt-4 text-gray-600">{result.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <ResultCard 
          title="Missing Keywords"
          icon={<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>}
        >
          <ul className="space-y-2 list-disc list-inside text-gray-600">
            {result.missingKeywords.map((keyword, index) => (
              <li key={index}>{keyword}</li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard 
          title="Improvement Suggestions"
          icon={<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>}
        >
          <ul className="space-y-2 list-disc list-inside text-gray-600">
            {result.suggestedImprovements.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </ResultCard>
      </div>
    </div>
  );
};

export default ResultsDisplay;
