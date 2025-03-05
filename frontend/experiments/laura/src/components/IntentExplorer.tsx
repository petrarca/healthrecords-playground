import React, { useState, useEffect } from 'react';
import { useAppContext } from '../services/contextService';
import { intents } from '../utils/intentUtils';
import { setStatusCallback, getLoadingStatus, getLastIntentResult } from '../services/tensorflowService';
import { IntentMatch, Entity } from '../types/intents';

/**
 * IntentExplorer component for exploring and testing intents
 */
const IntentExplorer: React.FC = () => {
  const appContext = useAppContext();
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState({ message: "Not started", percentage: 0 });
  const [lastResult, setLastResult] = useState<{
    text: string;
    intents: IntentMatch[];
    topIntent: IntentMatch | null;
    entities: Entity[];
  } | null>(null);

  // Set up status callback and check model status
  useEffect(() => {
    setStatusCallback(setLoadingStatus);
    
    const checkModelStatus = () => {
      const status = getLoadingStatus();
      setLoadingStatus(status);
      
      if (status.percentage === 100) {
        setIsModelLoaded(true);
      }
    };
    
    // Check status immediately
    checkModelStatus();
    
    // Set up interval to check status periodically
    const interval = setInterval(checkModelStatus, 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Check for last intent result periodically
  useEffect(() => {
    const checkLastResult = () => {
      const result = getLastIntentResult();
      if (result && (!lastResult || JSON.stringify(result) !== JSON.stringify(lastResult))) {
        setLastResult(result);
      }
    };
    
    // Check immediately
    checkLastResult();
    
    // Set up interval to check periodically
    const interval = setInterval(checkLastResult, 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [lastResult]);

  // Handle intent selection
  const handleIntentSelect = (intentName: string) => {
    setSelectedIntent(intentName === selectedIntent ? null : intentName);
  };

  // Check if an intent is relevant to the current context
  const isIntentRelevantToContext = (intentName: string): boolean => {
    const intent = intents.find(i => i.name === intentName);
    if (!intent || !intent.contextRelevance) return false;
    
    const { contextRelevance } = intent;
    
    // Check view relevance
    if (contextRelevance.views) {
      if (contextRelevance.views.includes('*') || 
          contextRelevance.views.includes(appContext.currentView)) {
        return true;
      }
    }
    
    // Check if intent requires patient and we have one
    if (contextRelevance.requiresPatient && appContext.currentPatient) {
      return true;
    }
    
    // Check if intent requires record and we have one
    if (contextRelevance.requiresRecord && appContext.currentRecordId) {
      return true;
    }
    
    return false;
  };

  // Get examples for the selected intent
  const getExamplesForIntent = (): string[] => {
    if (!selectedIntent) return [];
    
    const intent = intents.find(i => i.name === selectedIntent);
    if (!intent) return [];
    
    // Return examples, potentially personalized with patient info
    return intent.examples.map(example => {
      if (appContext.currentPatient && example.includes('[patient]')) {
        return example.replace('[patient]', `${appContext.currentPatient.firstName} ${appContext.currentPatient.lastName}`);
      }
      return example;
    });
  };

  // Format confidence score as percentage
  const formatConfidence = (score: number): string => {
    return (score * 100).toFixed(1) + '%';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 h-full flex flex-col text-xs">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-lg font-medium">Intent Explorer</h2>
        <div className="flex items-center gap-4">
          {appContext.currentPatient ? (
            <div className="text-xs text-blue-600">
              Patient: {appContext.currentPatient.firstName} {appContext.currentPatient.lastName}
            </div>
          ) : (
            <div className="text-xs text-blue-600">
              No patient selected
            </div>
          )}
          <div className={`text-xs px-2 py-1 rounded-full ${isModelLoaded ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
            {isModelLoaded ? 'Ready' : `Loading... ${loadingStatus.percentage}%`}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
        {/* Left Column: Last Intent Recognition */}
        <div className="flex flex-col h-full overflow-hidden">
          <h3 className="font-medium mb-2 text-xs">Last Intent Recognition</h3>
          <div className="border border-gray-200 rounded-lg p-3 overflow-y-auto flex-1" style={{ height: 'calc(100vh - 250px)' }}>
            {lastResult ? (
              <div>
                <h4 className="font-medium text-sm text-gray-500">Text</h4>
                <p className="text-gray-800">{lastResult.text}</p>
                
                <h4 className="font-medium text-sm text-gray-500">Top Intent</h4>
                {lastResult.topIntent ? (
                  <div className="flex items-center">
                    <span className="font-medium">{lastResult.topIntent.intent}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      ({formatConfidence(lastResult.topIntent.combinedScore)})
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-600">No intent detected</p>
                )}
                
                <h4 className="font-medium text-sm text-gray-500">Entities</h4>
                {lastResult.entities.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {lastResult.entities.map((entity, index) => (
                      <li key={index} className="text-gray-800">
                        <span className="font-medium">{entity.type}</span>: {entity.value}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No entities detected</p>
                )}
                
                <h4 className="font-medium text-sm text-gray-500">All Intents</h4>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-1">Intent</th>
                      <th className="text-left py-1">Score</th>
                      <th className="text-left py-1">Context</th>
                      <th className="text-left py-1">Combined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastResult.intents.map((intent, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                        <td className="py-1">{intent.intent}</td>
                        <td className="py-1">{formatConfidence(intent.score)}</td>
                        <td className="py-1">{formatConfidence(intent.contextRelevance)}</td>
                        <td className="py-1">{formatConfidence(intent.combinedScore)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No recognition results yet. Try using the chat to test intents.
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column: Available Intents and Examples */}
        <div className="flex flex-col gap-4 h-full overflow-hidden">
          {/* Available Intents Section */}
          <div className="flex flex-col h-1/2 overflow-hidden">
            <h3 className="font-medium mb-2">Available Intents</h3>
            <div className="border border-gray-200 rounded-lg p-3 overflow-y-auto flex-1">
              <div className="space-y-1">
                {intents.map(intent => {
                  const isContextRelevant = isIntentRelevantToContext(intent.name);
                  return (
                    <button
                      key={intent.name}
                      onClick={() => handleIntentSelect(intent.name)}
                      className={`w-full text-left px-3 py-2 rounded ${
                        selectedIntent === intent.name
                          ? 'bg-blue-100 text-blue-700'
                          : isContextRelevant
                          ? 'bg-blue-50 hover:bg-blue-100'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{intent.name}</span>
                        {isContextRelevant && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                            Context
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Examples Section */}
          <div className="flex flex-col h-1/2 overflow-hidden">
            <h3 className="font-medium mb-2">Examples</h3>
            <div className="border border-gray-200 rounded-lg p-3 overflow-y-auto flex-1">
              {selectedIntent ? (
                <>
                  <h4 className="font-medium mb-2 text-xs">Examples for "{selectedIntent}"</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    {getExamplesForIntent().map((example, index) => (
                      <li key={index}>
                        {example}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select an intent to see examples
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntentExplorer;
