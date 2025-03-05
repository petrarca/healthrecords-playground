import React, { useEffect } from 'react';
import { contextService } from '../services/contextService';

interface LandingPageProps {
  onAssistantClick?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAssistantClick }) => {
  // Update context when landing page is loaded
  useEffect(() => {
    contextService.setCurrentPatient(null);
    contextService.setCurrentView('landing');
  }, []);

  return (
    <div className="landing-page-container h-full flex flex-col items-center justify-center py-8 px-4 overflow-hidden w-full">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Sonnet
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Advanced healthcare management with AI-powered assistance
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Medical Professional UI */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4 text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Intuitive Interface</h3>
            <p className="text-gray-600">Designed specifically for medical professionals with clarity and efficiency in mind</p>
          </div>

          {/* AI Medical Assistant */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4 text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Medical Assistant</h3>
            <p className="text-gray-600">Integrated AI assistant <b>Laura</b> to help analyze records, suggest actions, support on tasks, and answer questions</p>
          </div>

          {/* Flexible System */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4 text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Flexible Workflow</h3>
            <p className="text-gray-600">Adapts to your needs and preferences with customizable views and personalized workflows</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm">
          <div className="flex items-center text-gray-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Smart patient search</span>
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

      {/* Assistant Shortcut Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Press <kbd className="mx-1 px-2 py-1 text-xs font-semibold bg-gray-100 border border-gray-300 rounded">Shift</kbd> + <kbd className="mx-1 px-2 py-1 text-xs font-semibold bg-gray-100 border border-gray-300 rounded">Space</kbd> to open the Assistant or click{' '}
          <button
            className="inline-flex items-center justify-center mx-1 p-0 border-0 bg-transparent cursor-pointer hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            onClick={onAssistantClick}
            aria-label="Open Assistant"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
              />
            </svg>
          </button>{' '}
          in the header
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 text-center px-4 py-3 bg-blue-50 rounded-lg max-w-2xl mx-auto">
        <p className="text-sm text-blue-800">
          ⚠️ This is a demonstration application containing test data only. Not for clinical use.
        </p>
      </div>
    </div>
  );
};
