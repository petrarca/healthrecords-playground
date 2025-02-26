import React, { useState, useEffect } from 'react';
import { Search } from './Search';
import { UserMenu } from './UserMenu';
import { SearchResult, SearchResultType } from '../types/search';
import { navigationService } from '../services/navigationService';
import { ConnectionStatus } from './ConnectionStatus';

interface ShellHeaderProps {
  onSearchResult: (result: SearchResult) => void;
  onMobileMenuClick: () => void;
  onAssistantClick: () => void;
  isAssistantOpen: boolean;
}

export const ShellHeader: React.FC<ShellHeaderProps> = ({ 
  onSearchResult, 
  onMobileMenuClick,
  onAssistantClick,
  isAssistantOpen
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <header className="sticky top-0 z-10 bg-blue-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex h-16 items-center justify-between px-2 sm:px-4">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigationService.navigateTo(SearchResultType.LANDING, '')}
              className="flex-shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200"
              aria-label="Go to landing page"
            >
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} 
                  d="M12 4v.01M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" 
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} 
                  d="M3.5 7A3.5 3.5 0 017 3.5h10A3.5 3.5 0 0120.5 7v10a3.5 3.5 0 01-3.5 3.5H7A3.5 3.5 0 013.5 17V7z" 
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} 
                  d="M7 8a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1H8a1 1 0 01-1-1V8z" 
                />
              </svg>
            </button>
            <div className="text-xl font-semibold text-gray-900 tracking-tight hidden sm:block">
              <span className="text-blue-700">Health</span>
              <span className="text-gray-900">Records</span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-3xl px-4">
            <Search onResultSelect={onSearchResult} />
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* DateTime Display */}
            <div className="hidden md:block text-sm text-gray-600">
              {formatDateTime(currentTime)}
            </div>

            {/* Connection Status */}
            <div className="hidden md:block">
              <ConnectionStatus />
            </div>

            {/* Chat Toggle Button */}
            <button
              onClick={onAssistantClick}
              className={`flex items-center justify-center h-10 w-10 rounded-lg transition-colors ${
                isAssistantOpen 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="Toggle Assistant"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                />
              </svg>
            </button>

            {/* User Menu */}
            <div className="hidden sm:block">
              <UserMenu />
            </div>

            {/* Menu button for mobile */}
            <button
              onClick={onMobileMenuClick}
              className="sm:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
