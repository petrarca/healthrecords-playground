import React, { useState } from 'react';
import { SearchResult } from '../types/search';
import { navigationService } from '../services/navigationService';
import { ShellHeader } from './ShellHeader';
import { Assistant } from './Assistant';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const handleSearchResult = (result: SearchResult) => {
    navigationService.navigateTo(result.type, result.id);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <ShellHeader 
        onSearchResult={handleSearchResult}
        onMobileMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onAssistantClick={() => setIsAssistantOpen(!isAssistantOpen)}
        isAssistantOpen={isAssistantOpen}
      />
      
      {/* Main Content */}
      <main className={`flex-1 overflow-hidden max-w-[1600px] mx-auto w-full px-1 sm:px-2 py-6 transition-all duration-300 ${
        isAssistantOpen ? 'mr-96' : ''
      }`}>
        {children}
      </main>

      {/* Chat Component */}
      <Assistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-20 sm:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
