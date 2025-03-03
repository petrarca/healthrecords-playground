import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FieldRenderer } from '../ui/fieldRenderers';
import { FieldMetaData } from '../../types/medicalRecord';
import { CodeExample } from '../ui/codeExample';

interface EventLog {
  type: string;
  message: string;
  timestamp: Date;
}

// Sample lab components data
const labComponentsData = [
  {
    test_name: 'Hemoglobin',
    value: 14.2,
    unit: 'g/dL',
    reference_range: '13.5-17.5 g/dL'
  },
  {
    test_name: 'White Blood Cell Count',
    value: 7.8,
    unit: 'K/uL',
    reference_range: '4.5-11.0 K/uL'
  },
  {
    test_name: 'Platelet Count',
    value: 250,
    unit: 'K/uL',
    reference_range: '150-450 K/uL'
  },
  {
    test_name: 'Glucose',
    value: 95,
    unit: 'mg/dL',
    reference_range: '70-99 mg/dL'
  }
];

// Sample JSON data
const jsonData = {
  patient: {
    id: '12345',
    name: 'John Doe',
    age: 45,
    gender: 'Male'
  },
  visit: {
    date: '2025-02-28',
    reason: 'Annual checkup',
    provider: 'Dr. Smith'
  }
};

/**
 * Demo component for showcasing field renderers
 */
export const FieldRenderersDemo: React.FC = () => {
  const [selectedRenderer, setSelectedRenderer] = useState<string>('labComponents');
  const [parsedData, setParsedData] = useState<Record<string, unknown>>(labComponentsData as unknown as Record<string, unknown>);
  const [customData, setCustomData] = useState<string>(JSON.stringify(labComponentsData, null, 2));
  const [isValidJson, setIsValidJson] = useState<boolean>(true);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [codeExample, setCodeExample] = useState<string>('');

  // Sample field metadata
  const fieldMetadata = useMemo<Record<string, FieldMetaData>>(() => ({
    'labComponents': {
      label: 'Lab Components',
      description: 'Lab test results',
      type: 'json',
      rendererType: 'labComponents'
    },
    'json': {
      label: 'JSON Data',
      description: 'Generic JSON data',
      type: 'json',
      rendererType: 'json'
    }
  }), []);

  // Generate code example
  const generateCodeExample = useCallback((): string => {
    return `import { FieldRenderer } from './components/ui/fieldRenderers';
import { FieldMetaData } from './types/medicalRecord';

const MyComponent = () => {
  // Field metadata
  const fieldMeta: FieldMetaData = ${JSON.stringify(fieldMetadata[selectedRenderer], null, 2)};
  
  // Field data
  const data = ${JSON.stringify(parsedData, null, 2)};
  
  return (
    <FieldRenderer 
      data={data}
      fieldName="${selectedRenderer}"
      fieldMeta={fieldMeta}
    />
  );
};`;
  }, [selectedRenderer, parsedData, fieldMetadata]);

  useEffect(() => {
    // Log initial state
    logEvent('INITIALIZE', {
      renderer: selectedRenderer,
      data: parsedData,
      metadata: fieldMetadata[selectedRenderer]
    });
    
    // Update code example
    setCodeExample(generateCodeExample());
  }, [generateCodeExample, selectedRenderer, parsedData, fieldMetadata]);

  const logEvent = (type: string, message: Record<string, unknown>): void => {
    setEvents(prev => [
      { 
        type, 
        message: JSON.stringify(message), 
        timestamp: new Date() 
      }, 
      ...prev
    ].slice(0, 50)); // Keep only the last 50 logs
  };

  const handleRendererChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRenderer = e.target.value;
    setSelectedRenderer(newRenderer);
    
    let newData;
    if (newRenderer === 'labComponents') {
      newData = labComponentsData;
    } else {
      newData = jsonData;
    }
    
    const jsonString = JSON.stringify(newData, null, 2);
    setCustomData(jsonString);
    setParsedData(newData as Record<string, unknown>);
    setIsValidJson(true);
    
    logEvent('RENDERER_CHANGED', { 
      renderer: newRenderer, 
      data: newData,
      metadata: fieldMetadata[newRenderer]
    });
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newData = e.target.value;
    setCustomData(newData);
    try {
      const parsed = JSON.parse(newData);
      setParsedData(parsed);
      setIsValidJson(true);
      logEvent('DATA_UPDATED', { data: parsed });
    } catch (error) {
      setIsValidJson(false);
      logEvent('DATA_INVALID', { data: newData, error: (error as Error).message });
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
      renderer: selectedRenderer,
      data: parsedData,
      metadata: fieldMetadata[selectedRenderer]
    };
  };

  // Data to render based on selected renderer
  const renderData = parsedData;
  const currentFieldMeta = fieldMetadata[selectedRenderer];

  useEffect(() => {
    // This would typically be done at app initialization, but for demo purposes we do it here
  }, []);

  return (
    <div className="h-screen overflow-auto p-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">Field Renderers Demo</h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Component Overview</h2>
          <p className="text-gray-700 mb-3">
            The FieldRenderer component provides a flexible way to render different types of data fields using specialized renderers.
            It selects the appropriate renderer based on field metadata and can be extended with custom renderers.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> Use the registerRenderer function to add your own custom renderers for specific data types.
              This allows you to create specialized visualizations for different types of data while maintaining a consistent API.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold mb-3">Configuration</h3>
              
              <div className="mb-4">
                <label htmlFor="renderer-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Renderer Type
                </label>
                <select 
                  id="renderer-select"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={selectedRenderer}
                  onChange={handleRendererChange}
                >
                  <option value="labComponents">Lab Components Renderer</option>
                  <option value="json">JSON Renderer</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="field-label" className="block text-sm font-medium text-gray-700 mb-1">
                    Field Label
                  </label>
                  <input
                    id="field-label"
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={currentFieldMeta.label}
                    onChange={(e) => {
                      const newLabel = e.target.value;
                      const newFieldMeta = { ...currentFieldMeta, label: newLabel };
                      fieldMetadata[selectedRenderer] = newFieldMeta;
                    }}
                  />
                </div>
                
                <div>
                  <label htmlFor="field-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Field Description
                  </label>
                  <input
                    id="field-description"
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={currentFieldMeta.description}
                    onChange={(e) => {
                      const newDescription = e.target.value;
                      const newFieldMeta = { ...currentFieldMeta, description: newDescription };
                      fieldMetadata[selectedRenderer] = newFieldMeta;
                    }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="data-editor" className="block text-sm font-medium text-gray-700 mb-1">
                    Edit Data (JSON):
                  </label>
                  <textarea
                    id="data-editor"
                    className={`w-full h-64 p-2 font-mono text-sm border rounded ${!isValidJson ? 'border-red-500' : 'border-gray-300'}`}
                    value={customData}
                    onChange={handleDataChange}
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
                    <div className="h-64 overflow-auto border border-gray-300 rounded bg-white">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">
                          {currentFieldMeta.label}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {currentFieldMeta.description}
                        </p>
                      </div>
                      <div className="p-4">
                        <FieldRenderer
                          data={renderData}
                          fieldName={selectedRenderer}
                          fieldMeta={currentFieldMeta}
                          rendererType={currentFieldMeta.rendererType}
                        />
                      </div>
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
              <CodeExample 
                code={codeExample} 
                language="tsx" 
                className="text-xs w-full" 
                showLineNumbers={true}
                maxHeight="none"
              />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold mb-3">Creating Custom Renderers</h3>
              <p className="text-sm text-gray-700 mb-3">
                To create a custom renderer, implement a React component that accepts FieldRendererProps and register it:
              </p>
              <CodeExample 
                code={`// 1. Import necessary types and functions
import React from 'react';
import { FieldRendererProps } from './components/ui/fieldRenderers/types';
import { registerRenderer } from './components/ui/rendererRegistry';

// 2. Create your custom renderer component
export const MyCustomRenderer: React.FC<FieldRendererProps> = ({ 
  data, 
  fieldName,
  fieldMeta
}) => {
  // Your custom rendering logic here
  return (
    <div className="my-custom-renderer">
      <h3>{fieldMeta.label}</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

// 3. Register your renderer (do this once at app initialization)
registerRenderer('myCustomType', MyCustomRenderer);

// 4. Use it in your components with the registered type
<FieldRenderer
  data={myData}
  fieldName="myField"
  fieldMeta={{
    label: "My Custom Field",
    description: "Field with custom rendering",
    type: "json",
    rendererType: "myCustomType"  // This matches the name used in registerRenderer
  }}
/>`} 
                language="tsx" 
                className="text-xs w-full" 
                showLineNumbers={true}
                maxHeight="none"
              />
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
