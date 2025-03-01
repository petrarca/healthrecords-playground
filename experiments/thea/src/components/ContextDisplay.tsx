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
        <div>
          <span className="font-medium">Debug Mode:</span>{' '}
          <span className={`px-1.5 py-0.5 rounded text-xs ${context.debugMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {context.debugMode ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Press Cmd+Shift+C to toggle
      </div>
    </div>
  );
};

export default ContextDisplay;
