import React, { useState, useEffect } from 'react';
import { contextService, ContextState } from '../services/contextService';

// Context Display component that shows the current context state
const ContextDisplay: React.FC = () => {
  const [context, setContext] = useState<ContextState>(contextService.getState());
  const [visible, setVisible] = useState<boolean>(false);
  
  // Subscribe to context changes
  useEffect(() => {
    const subscription = contextService.subscribe(newContext => {
      setContext(newContext);
    });
    
    // Add keyboard shortcut to toggle visibility (Cmd+Shift+C)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === 'C') {
        setVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Toggle debug mode
  const toggleDebugMode = () => {
    contextService.toggleDebugMode();
  };
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm max-w-xs z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Context State</h3>
        <button 
          onClick={() => setVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1">
        <div>
          <span className="font-medium">Patient:</span>{' '}
          {context.currentPatient ? 
            `${context.currentPatient.firstName} ${context.currentPatient.lastName} (${context.currentPatient.patientId})` : 
            <em className="text-gray-500">None</em>}
        </div>
        <div>
          <span className="font-medium">View:</span>{' '}
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
            {context.currentView}
          </span>
        </div>
        <div>
          <span className="font-medium">Record ID:</span>{' '}
          {context.currentRecordId || <em className="text-gray-500">None</em>}
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Debug Mode:</span>{' '}
          <button
            onClick={toggleDebugMode}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              context.debugMode 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {context.debugMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Press Cmd+Shift+C to toggle display
      </div>
      <div className="mt-1 text-xs text-gray-500">
        TensorFlow debug mode is {context.debugMode ? 'enabled' : 'disabled'}
      </div>
    </div>
  );
};

export default ContextDisplay;
