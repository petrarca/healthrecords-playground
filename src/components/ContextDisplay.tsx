import React from 'react';
import { useAppContext } from '../hooks/useAppContext';

export const ContextDisplay: React.FC = () => {
  const { state } = useAppContext();
  
  return (
    <div className="fixed bottom-0 right-0 bg-blue-100 text-blue-800 p-2 rounded-tl-md text-xs z-50 shadow-md">
      <div className="font-semibold mb-1">Context Information:</div>
      <div>Current View: {state.currentView}</div>
      <div>
        Current Patient: {state.currentPatient 
          ? `${state.currentPatient.firstName} ${state.currentPatient.lastName}` 
          : 'None'}
      </div>
      {state.currentRecordId && (
        <div>Current Record: {state.currentRecordId}</div>
      )}
    </div>
  );
};
