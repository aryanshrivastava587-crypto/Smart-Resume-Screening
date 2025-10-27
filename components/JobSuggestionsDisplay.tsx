import React from 'react';
import type { SuggestedJob } from '../types';

interface JobSuggestionsDisplayProps {
  jobs: SuggestedJob[];
}

const JobSuggestionsDisplay: React.FC<JobSuggestionsDisplayProps> = ({ jobs }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-brand-dark">Top Job Matches for You</h2>
        {jobs.map((job, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md flex flex-col">
                <div className="flex-grow">
                  <div className="flex items-center mb-3">
                      <div className="w-10 h-10 mr-4 inline-flex items-center justify-center rounded-full bg-indigo-100 text-brand-accent flex-shrink-0">
                          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                          </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-brand-dark">{job.jobTitle}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{job.rationale}</p>
                  
                  <div>
                      <h4 className="font-semibold text-brand-dark mb-2">Relevant Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                          {job.keySkills.map((skill, skillIndex) => (
                              <span key={skillIndex} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                  {skill}
                              </span>
                          ))}
                      </div>
                  </div>
                </div>
                <div className="mt-6 text-right">
                  <a
                      href={`https://www.naukri.com/jobs-in-india?k=${encodeURIComponent(job.jobTitle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-white bg-brand-accent hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 transition-colors"
                  >
                      Find Opportunities on Naukri.com
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </div>
            </div>
        ))}
    </div>
  );
};

export default JobSuggestionsDisplay;
