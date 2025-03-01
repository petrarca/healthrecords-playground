import React, { useState, useEffect } from 'react';
import { contextService, Patient, ViewType, useAppContext } from '../services/contextService';
import ContextDisplay from './ContextDisplay';
import Chat from './Chat';
import IntentExplorer from './IntentExplorer';

// Demo patient for testing
const demoPatient: Patient = {
  patientId: 'P12345',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1980-01-15',
  gender: 'Male'
};

// Main App component
const App = () => {
  const appContext = useAppContext();
  const [showIntentExplorer, setShowIntentExplorer] = useState(true);
  
  // Set up a demo patient for testing
  useEffect(() => {
    // Set up a demo patient for context
    contextService.setCurrentPatient(demoPatient);
    contextService.setCurrentView('summary');
    
    // No need for subscription as we're using useAppContext hook
  }, []);
  
  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newView = e.target.value as ViewType;
    
    // If changing from landing to another view, ensure a patient is set
    if (appContext.currentView === 'landing' && newView !== 'landing' && !appContext.currentPatient) {
      // Set the demo patient first, then change the view
      contextService.setCurrentPatient(demoPatient);
      contextService.setCurrentView(newView);
    } else {
      // Just change the view
      contextService.setCurrentView(newView);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-2 py-4 h-screen flex flex-col">
      <header className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-blue-600">Thea - HealthRecords Assistant</h1>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 bg-white border border-gray-300 rounded text-sm"
            onChange={handleViewChange}
            value={appContext.currentView}
          >
            <option value="landing">Landing</option>
            <option value="summary">Patient Summary</option>
            <option value="timeline">Timeline</option>
            <option value="demographics">Demographics</option>
            <option value="profile">Profile</option>
            <option value="vitals">Vitals</option>
          </select>
          <button 
            onClick={() => setShowIntentExplorer(!showIntentExplorer)}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded text-sm font-medium hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showIntentExplorer ? 'Hide Intent Explorer' : 'Show Intent Explorer'}
          </button>
          <button
            className={`px-4 py-2 rounded-md ${appContext.debugMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => contextService.toggleDebugMode()}
          >
            {appContext.debugMode ? 'Disable Debug' : 'Enable Debug'}
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row gap-2 overflow-hidden px-0">
        <div className={showIntentExplorer ? "md:w-2/5" : "flex-1"}>
          <Chat />
        </div>
        {showIntentExplorer && (
          <div className="md:w-3/5">
            <IntentExplorer />
          </div>
        )}
      </main>
       
      {/* Context display (toggle with Cmd+Shift+C) */}
      <ContextDisplay />
      
      <footer className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Thea - HealthRecords Assistant Intent Recognition</p>
        <p className="mt-1">Press Cmd+Shift+C to toggle context display</p>
      </footer>
    </div>
  );
};

export default App;
