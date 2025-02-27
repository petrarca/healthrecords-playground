import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';

interface UserMenuProps {
  userName?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { state, toggleDebugMode } = useAppContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700 ring-4 ring-blue-50">
          {userName ? (
            <span className="text-sm font-semibold">
              {userName.split(' ').map(n => n[0]).join('')}
            </span>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {/* User-specific content */}
          {userName ? (
            <>
              <div className="px-4 py-2 border-b border-gray-200">
                <div className="text-sm font-medium text-gray-900">{userName}</div>
                <div className="text-xs text-gray-500">Healthcare Professional</div>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Preferences
                </button>
              </div>
              <div className="border-t border-gray-200 py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium">
                Sign In
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Create Account
              </button>
            </div>
          )}
          
          {/* Common menu items */}
          <div className={`${userName ? '' : 'border-t border-gray-200'} py-1`}>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Help & Support
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={toggleDebugMode}>
              Debug Mode: {state.debugMode ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
