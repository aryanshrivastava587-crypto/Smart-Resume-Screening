import React, { useState, useCallback } from 'react';
import { analyzeResume, findMatchingJobs } from '../services/geminiService';
import type { AnalysisResult, SuggestedJob } from '../types';
import FileUpload from '../components/FileUpload';
import ResultsDisplay from '../components/ResultsDisplay';
import JobSuggestionsDisplay from '../components/JobSuggestionsDisplay';
import Spinner from '../components/Spinner';

type Tab = 'screener' | 'finder';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('screener');
  
  // Shared state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  // Screener state
  const [jobDescription, setJobDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [screenerError, setScreenerError] = useState<string | null>(null);

  // Finder state
  const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJob[] | null>(null);
  const [isFinding, setIsFinding] = useState<boolean>(false);
  const [finderError, setFinderError] = useState<string | null>(null);


  const handleFileSelect = useCallback((file: File) => {
    setResumeFile(file);
    setResumeFileName(file.name);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setScreenerError('Please upload a resume and provide a job description.');
      return;
    }
    setScreenerError(null);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(resumeFile, jobDescription);
      setAnalysisResult(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setScreenerError(e.message);
      } else {
        setScreenerError('An unknown error occurred.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFindJobsClick = async () => {
    if (!resumeFile) {
      setFinderError('Please upload a resume to find matching jobs.');
      return;
    }
    setFinderError(null);
    setIsFinding(true);
    setSuggestedJobs(null);

    try {
      const result = await findMatchingJobs(resumeFile);
      setSuggestedJobs(result);
    } catch(e: unknown) {
      if (e instanceof Error) {
        setFinderError(e.message);
      } else {
        setFinderError('An unknown error occurred.');
      }
    } finally {
      setIsFinding(false);
    }
  };
  
  const handleReset = () => {
      setResumeFile(null);
      setResumeFileName(null);
      setJobDescription('');
      setAnalysisResult(null);
      setScreenerError(null);
      setIsAnalyzing(false);
      setSuggestedJobs(null);
      setFinderError(null);
      setIsFinding(false);
  };

  const renderTabs = () => {
    const commonTabStyles = "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors";
    const activeTabStyles = "border-brand-accent text-brand-accent";
    const inactiveTabStyles = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

    return (
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('screener')}
              className={`${commonTabStyles} ${activeTab === 'screener' ? activeTabStyles : inactiveTabStyles}`}
              aria-current={activeTab === 'screener' ? 'page' : undefined}
            >
              Resume Screener
            </button>
            <button
              onClick={() => setActiveTab('finder')}
              className={`${commonTabStyles} ${activeTab === 'finder' ? activeTabStyles : inactiveTabStyles}`}
              aria-current={activeTab === 'finder' ? 'page' : undefined}
            >
              Job Finder
            </button>
          </nav>
        </div>
      </div>
    );
  };
  
  const renderScreener = () => {
    const isButtonDisabled = !resumeFile || !jobDescription.trim() || isAnalyzing;

    if (analysisResult) {
      return (
        <div className="max-w-3xl mx-auto">
            <ResultsDisplay result={analysisResult} />
            <div className="text-center mt-8">
                <button
                    onClick={handleReset}
                    className="text-white bg-brand-accent hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-md px-6 py-2.5 text-center transition-colors"
                >
                    Analyze Another
                </button>
            </div>
          </div>
      )
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <label htmlFor="resume-screener" className="block text-lg font-semibold mb-2 text-brand-dark">
            1. Upload Resume
          </label>
          <FileUpload onFileSelect={handleFileSelect} fileName={resumeFileName} />
        </div>

        <div>
          <label htmlFor="job-description" className="block text-lg font-semibold mb-2 text-brand-dark">
            2. Paste Job Description
          </label>
          <textarea
            id="job-description"
            rows={10}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>
        
        <div className="pt-4">
          <button
            onClick={handleAnalyzeClick}
            disabled={isButtonDisabled}
            className="w-full text-white bg-brand-dark hover:bg-black focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-3 text-center transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </div>

        {isAnalyzing && <Spinner />}

        {screenerError && (
          <div className="mt-6 p-4 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg">
            <strong>Error:</strong> {screenerError}
          </div>
        )}
      </div>
    );
  };

  const renderFinder = () => {
    const isButtonDisabled = !resumeFile || isFinding;

     if (suggestedJobs) {
      return (
        <div className="max-w-3xl mx-auto">
            <JobSuggestionsDisplay jobs={suggestedJobs} />
            <div className="text-center mt-8">
                <button
                    onClick={handleReset}
                    className="text-white bg-brand-accent hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-md px-6 py-2.5 text-center transition-colors"
                >
                    Start Over
                </button>
            </div>
          </div>
      )
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <label htmlFor="resume-finder" className="block text-lg font-semibold mb-2 text-brand-dark">
            Upload Your Resume
          </label>
           <p className="text-sm text-gray-500 mb-4">We'll analyze your resume to find the best job matches for you.</p>
          <FileUpload onFileSelect={handleFileSelect} fileName={resumeFileName} />
        </div>
        
        <div className="pt-4">
          <button
            onClick={handleFindJobsClick}
            disabled={isButtonDisabled}
            className="w-full text-white bg-brand-dark hover:bg-black focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-3 text-center transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isFinding ? 'Finding Jobs...' : 'Find Matching Jobs'}
          </button>
        </div>

        {isFinding && <Spinner />}

        {finderError && (
          <div className="mt-6 p-4 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg">
            <strong>Error:</strong> {finderError}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderTabs()}
      
      {activeTab === 'screener' && renderScreener()}
      {activeTab === 'finder' && renderFinder()}
    </div>
  );
};

export default DashboardPage;
