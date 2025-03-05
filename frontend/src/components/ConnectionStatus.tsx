import React, { useState, useEffect, useRef } from 'react';
import { getClient } from '../lib/supabase';

export const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [showEnvVars, setShowEnvVars] = useState(false);
  const [loading, setLoading] = useState(true);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const checkConnection = async () => {
    try {
      const client = getClient();
      const { error } = await client.from('versions').select('version').limit(1);
      setIsOnline(!error);
    } catch {
      setIsOnline(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEnvVars && 
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowEnvVars(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEnvVars]);

  const envVars = {
    'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL || 'Not set',
    'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY ? '********' : 'Not set',
    'NODE_ENV': import.meta.env.MODE || 'Not set'
  };

  const getStatusColor = () => {
    if (loading) return 'bg-yellow-400';
    return isOnline ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = () => {
    if (loading) return 'Checking...';
    return isOnline ? 'Online' : 'Offline';
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowEnvVars(!showEnvVars)}
        className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100"
        aria-label="Connection Status"
      >
        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()}`} />
        <span className="text-xs text-gray-600">{getStatusText()}</span>
      </button>

      {showEnvVars && (
        <div 
          ref={popupRef}
          className="absolute right-0 bottom-full mb-2 w-[32rem] bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Environment Variables</h3>
            <div className="space-y-2">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="text-xs break-all">
                  <span className="font-mono text-gray-600">{key}:</span>
                  <span className="ml-2 font-mono text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
