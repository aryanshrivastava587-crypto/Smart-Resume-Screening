
import React from 'react';

interface ProgressBarProps {
  score: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ score }) => {
  const scoreColor = score > 75 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-brand-dark">Match Score</span>
        <span className="text-sm font-medium text-brand-dark">{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`${scoreColor} h-4 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
