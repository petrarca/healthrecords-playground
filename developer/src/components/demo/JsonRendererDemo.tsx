import React, { useState } from 'react';
import { JsonDisplay } from '@src/components/ui/jsonRenderer';

// Sample JSON data for demonstration
const sampleData = {
  patient: {
    id: "P12345",
    name: "John Doe",
    age: 42,
    active: true,
    contact: {
      email: "john.doe@example.com",
      phone: "+1-555-123-4567",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345"
      }
    },
    allergies: ["Penicillin", "Peanuts"],
    vitalSigns: [
      { 
        date: "2023-01-15", 
        heartRate: { value: 72, unit: "bpm" },
        bloodPressure: { value: "120/80", unit: "mmHg" },
        temperature: { value: 37.0, unit: "°C" }
      },
      { 
        date: "2023-02-20", 
        heartRate: { value: 68, unit: "bpm" },
        bloodPressure: { value: "118/78", unit: "mmHg" },
        temperature: { value: 36.8, unit: "°C" }
      }
    ],
    metadata: null
  }
};

// Simple JSON data
const simpleData = {
  name: "Test Object",
  values: [1, 2, 3, 4, 5],
  isValid: true,
  timestamp: "2023-03-15T14:30:00Z"
};

// Deep nested JSON data
const deepNestedData = {
  level1: {
    level2: {
      level3: {
        level4: {
          level5: {
            data: "This is deeply nested",
            array: [1, 2, 3]
          }
        }
      }
    }
  }
};

interface EventLog {
  type: string;
  message: Record<string, unknown>;
  timestamp: Date;
}

export const JsonRendererDemo: React.FC = () => {
  const [customJson, setCustomJson] = useState<string>('{\n  "example": "Edit me!",\n  "number": 42,\n  "boolean": true\n}');
  const [isValidJson, setIsValidJson] = useState<boolean>(true);
  const [parsedJson, setParsedJson] = useState<Record<string, unknown>>({ example: "Edit me!", number: 42, boolean: true });
  const [selectedExample, setSelectedExample] = useState<string>("simple");
  const [maxDepth, setMaxDepth] = useState<number>(3);
  const [initialExpanded, setInitialExpanded] = useState<boolean>(true);
  const [showCopyButton, setShowCopyButton] = useState<boolean>(true);
  const [compact, setCompact] = useState<boolean>(false);
  const [events, setEvents] = useState<EventLog[]>([]);

  const logEvent = (type: string, message: Record<string, unknown>): void => {
    setEvents(prev => [...prev, { type, message, timestamp: new Date() }]);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newJson = e.target.value;
    setCustomJson(newJson);
    try {
      const parsed = JSON.parse(newJson);
      setParsedJson(parsed);
      setIsValidJson(true);
      logEvent('JSON_UPDATED', { json: newJson });
    } catch (error) {
      setIsValidJson(false);
      logEvent('JSON_INVALID', { json: newJson, error: (error as Error).message });
    }
  };

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const example = e.target.value;
    setSelectedExample(example);
    
    let exampleData;
    switch (example) {
      case "simple":
        exampleData = simpleData;
        break;
      case "complex":
        exampleData = sampleData;
        break;
      case "nested":
        exampleData = deepNestedData;
        break;
      default:
        exampleData = simpleData;
    }
    
    const jsonString = JSON.stringify(exampleData, null, 2);
    setCustomJson(jsonString);
    setParsedJson(exampleData);
    setIsValidJson(true);
    logEvent('EXAMPLE_CHANGED', { example, data: exampleData });
  };

  const handleMaxDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const depth = parseInt(e.target.value);
    setMaxDepth(depth);
    logEvent('OPTION_CHANGED', { option: 'maxDepth', value: depth });
  };

  const handleToggleOption = (option: string) => {
    switch (option) {
      case 'expanded':
        setInitialExpanded(!initialExpanded);
        logEvent('OPTION_CHANGED', { option: 'initialExpanded', value: !initialExpanded });
        break;
      case 'copyButton':
        setShowCopyButton(!showCopyButton);
        logEvent('OPTION_CHANGED', { option: 'showCopyButton', value: !showCopyButton });
        break;
      case 'compact':
        setCompact(!compact);
        logEvent('OPTION_CHANGED', { option: 'compact', value: !compact });
        break;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const getCurrentDisplayData = () => {
    return {
      data: parsedJson,
      options: {
        initialExpanded,
        maxDepth,
        showCopyButton,
        compact
      }
    };
  };

  return (
    <div className="h-screen overflow-auto p-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">JSON Renderer Demo</h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Component Overview</h2>
          <p className="text-gray-700 mb-3">
            The JsonRenderer component provides a colorized, interactive way to display JSON data with collapsible tree views, 
            syntax highlighting, and copy functionality. It's useful for debugging, data exploration, and displaying complex 
            structured data to users.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> Use the JsonDisplay wrapper component for most use cases. It provides additional styling 
              and features like titles and copy-to-clipboard functionality.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold mb-3">Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="example-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Example Data
                  </label>
                  <select 
                    id="example-select"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={selectedExample}
                    onChange={handleExampleChange}
                  >
                    <option value="simple">Simple Object</option>
                    <option value="complex">Complex Patient Data</option>
                    <option value="nested">Deep Nested Data</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="max-depth" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Depth: {maxDepth}
                  </label>
                  <input 
                    id="max-depth"
                    type="range" 
                    min="1" 
                    max="10" 
                    value={maxDepth}
                    onChange={handleMaxDepthChange}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={initialExpanded}
                    onChange={() => handleToggleOption('expanded')}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Initially Expanded</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={showCopyButton}
                    onChange={() => handleToggleOption('copyButton')}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Copy Button</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={compact}
                    onChange={() => handleToggleOption('compact')}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Compact Mode</span>
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="json-editor" className="block text-sm font-medium text-gray-700 mb-1">
                    Edit JSON:
                  </label>
                  <textarea
                    id="json-editor"
                    className={`w-full h-64 p-2 font-mono text-sm border rounded ${!isValidJson ? 'border-red-500' : 'border-gray-300'}`}
                    value={customJson}
                    onChange={handleJsonChange}
                  />
                  {!isValidJson && (
                    <p className="text-red-500 text-sm mt-1">Invalid JSON format</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preview:
                  </label>
                  {isValidJson ? (
                    <div className="h-64 overflow-auto border border-gray-300 rounded">
                      <JsonDisplay 
                        data={parsedJson} 
                        initialExpanded={initialExpanded}
                        showCopyButton={showCopyButton}
                        compact={compact}
                      />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center border border-gray-300 rounded bg-gray-50">
                      <p className="text-red-500">Fix JSON syntax to see preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold mb-3">Usage Example</h3>
              <p className="mb-4">
                View the source code for this demo component on GitHub: 
                <a 
                  href="https://github.com/petrarca/healthrecords-playground/blob/main/developer/src/components/demo/JsonRendererDemo.tsx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  JsonRendererDemo.tsx
                </a>
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold mb-2">Current State</h3>
              <div className="bg-gray-50 p-3 rounded border overflow-auto max-h-64">
                <pre className="text-xs">
                  {JSON.stringify(getCurrentDisplayData(), null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold mb-2">Event Log</h3>
              <div className="h-64 overflow-y-auto border rounded p-2">
                {events.map((log, index) => (
                  <div key={index} className="text-xs border-b pb-2 mb-2 last:border-0">
                    <div className="flex justify-between">
                      <span className="font-medium">{log.type}</span>
                      <span className="text-gray-500">{formatTime(log.timestamp)}</span>
                    </div>
                    <pre className="mt-1 text-gray-600 whitespace-pre-wrap">
                      {typeof log.message === 'string' ? log.message : JSON.stringify(log.message, null, 2)}
                    </pre>
                  </div>
                ))}
                {events.length === 0 && (
                  <div className="text-gray-500 text-xs italic">No events recorded yet. Try interacting with the component.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
