import React, { useState, useEffect, useMemo } from 'react';
import { SearchResult } from '../types/search';
import { navigationService } from '../services/navigationService';
import { ShellHeader } from './ShellHeader';
import { Assistant } from './Assistant';
import { ContextDisplay } from './ContextDisplay';
import { ConnectionStatus } from './ConnectionStatus';
import { ShellContext } from '../context/ShellContext';
import '../styles/ipad-fixes.css';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showContextDisplay, setShowContextDisplay] = useState(true);

  const handleSearchResult = (result: SearchResult) => {
    navigationService.navigateTo(result.type, result.id);
  };

  const toggleAssistant = () => {
    setIsAssistantOpen(prevState => !prevState);
  };

  // Add keyboard shortcut to toggle assistant
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Shift+Space
      if (event.shiftKey && event.key === ' ') {
        event.preventDefault(); // Prevent any default behavior
        toggleAssistant();
      }
      
      // Toggle context display with cmd+shift+c
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'c') {
        event.preventDefault();
        setShowContextDisplay(prevState => !prevState);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const shellContextValue = useMemo(() => ({
    onAssistantClick: toggleAssistant,
    isAssistantOpen
  }), [isAssistantOpen]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <ShellHeader 
        onSearchResult={handleSearchResult}
        onMobileMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onAssistantClick={toggleAssistant}
        isAssistantOpen={isAssistantOpen}
      />
      
      <ShellContext.Provider value={shellContextValue}>
        {/* Main Content - No scrolling at this level */}
        <div className="flex-1 overflow-hidden">
          <main className={`h-full max-w-[1600px] mx-auto w-full px-1 sm:px-2 py-6 transition-all duration-300 ${
            isAssistantOpen ? 'mr-96' : ''
          }`}>
            {children}
          </main>
        </div>
      </ShellContext.Provider>

      {/* Footer - Fixed at bottom */}
      <footer className="bg-white border-t border-gray-200 py-2 px-4 flex-shrink-0 w-full ipad-footer-fix">
        <div className="max-w-[1600px] mx-auto w-full flex justify-end items-center space-x-4">
          <ConnectionStatus />
          <a 
            href="https://github.com/petrarca/healthrecords-playground" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-1"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            GitHub
          </a>
        </div>
      </footer>

      {/* Chat Component */}
      <Assistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
      
      {/* Context Display */}
      {showContextDisplay && <ContextDisplay />}

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-20 sm:hidden">
          <button 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 border-0 cursor-pointer" 
            onClick={() => setIsSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsSidebarOpen(false);
              }
            }}
            aria-label="Close sidebar"
          />
          <dialog 
            open
            className="fixed inset-y-0 right-0 m-0 w-64 bg-white shadow-lg"
            aria-labelledby="sidebar-title"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h2 id="sidebar-title" className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};
