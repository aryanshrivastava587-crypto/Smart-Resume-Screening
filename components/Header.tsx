import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="text-center py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-dark">
            Smart Resume Screener
          </h1>
          {user && (
             <p className="mt-2 text-lg text-gray-600">
              Welcome, <span className="font-semibold">{user.name}</span>!
            </p>
          )}
        </div>
        {user && (
          <button
            onClick={logout}
            className="text-white bg-brand-accent hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
          >
            Logout
          </button>
        )}
      </div>
       {!user && (
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a resume and paste a job description to get an AI-powered match analysis.
          </p>
        )}
    </header>
  );
};


export default Header;
