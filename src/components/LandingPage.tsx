import React, { useEffect } from 'react';
import { contextService } from '../services/contextService';

export const LandingPage: React.FC = () => {
  // Update context when landing page is loaded
  useEffect(() => {
    contextService.setCurrentPatient(null);
    contextService.setCurrentView('landing');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to HealthRecords
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Powerful search capabilities at your fingertips
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Voice Search */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4 text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Voice Search</h3>
            <p className="text-gray-600">Use voice commands to search for patients and navigate records</p>
          </div>

          {/* Natural Language */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4 text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Natural Language</h3>
            <p className="text-gray-600">Search using everyday language and get intelligent results</p>
          </div>

          {/* Advanced Filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4 text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Advanced Filters</h3>
            <p className="text-gray-600">Filter by date, department, status and more</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm">
          <div className="flex items-center text-gray-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search by name, ID, or condition</span>
          </div>
          <div className="flex items-center text-gray-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Real-time search results</span>
          </div>
          <div className="flex items-center text-gray-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure and private</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 text-center px-4 py-3 bg-blue-50 rounded-lg max-w-2xl mx-auto">
        <p className="text-sm text-blue-800">
          ⚠️ This is a demonstration application containing test data only. Not for clinical use.
        </p>
      </div>
    </div>
  );
};
