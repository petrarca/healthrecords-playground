import React from 'react';
import { FieldRenderer } from '@petrarca-sonnet/frontend/src/components/ui/fieldRenderers';
import { FieldMetaData } from '@petrarca-sonnet/frontend/src/types';

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
  const [selectedRenderer, setSelectedRenderer] = React.useState<string>('labComponents');
  const [parsedData, setParsedData] = React.useState<Record<string, unknown>>(labComponentsData as unknown as Record<string, unknown>);
  const [previewData, setPreviewData] = React.useState<Record<string, unknown>>(labComponentsData as unknown as Record<string, unknown>);
  const [customData, setCustomData] = React.useState<string>(JSON.stringify(labComponentsData, null, 2));
  const [hasDataChanged, setHasDataChanged] = React.useState<boolean>(false);
  const [isValidJson, setIsValidJson] = React.useState<boolean>(true);
  const [events, setEvents] = React.useState<EventLog[]>([]);

  // Sample field metadata
  const fieldMetadata = React.useMemo<Record<string, FieldMetaData>>(() => ({
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

  React.useEffect(() => {
    // Log initial state only once when component mounts
    logEvent('INITIALIZE', {
      renderer: selectedRenderer,
      data: parsedData,
      metadata: fieldMetadata[selectedRenderer]
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setPreviewData(newData as Record<string, unknown>);
    setIsValidJson(true);
    setHasDataChanged(false);
    
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
      JSON.parse(newData);
      setIsValidJson(true);
      // Once data is changed, keep the button enabled
      setHasDataChanged(true);
    } catch (_error) {
      setIsValidJson(false);
    }
  };

  const handleUpdateData = () => {
    try {
      const parsed = JSON.parse(customData);
      setParsedData(parsed);
      setPreviewData(parsed);
      setIsValidJson(true);
      setHasDataChanged(false);
      logEvent('DATA_UPDATED', { data: parsed });
    } catch (_error) {
      setIsValidJson(false);
      logEvent('DATA_INVALID', { data: customData, error: (_error as Error).message });
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
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
  const currentFieldMeta = fieldMetadata[selectedRenderer];

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
                  <div className="mt-2 flex justify-between items-center">
                    {!isValidJson && (
                      <p className="text-red-500 text-sm">Invalid JSON format</p>
                    )}
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 ml-auto"
                      onClick={handleUpdateData}
                      disabled={!isValidJson || !hasDataChanged}
                    >
                      Update Data
                    </button>
                  </div>
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
                          data={previewData}
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
              <p className="mb-4">
                View the source code for this demo component on GitHub: 
                <a 
                  href="https://github.com/petrarca/sonnet/blob/main/frontend/developer/src/components/demo/FieldRenderersDemo.tsx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  FieldRenderersDemo.tsx
                </a>
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold mb-3">Creating Custom Renderers</h3>
              <p className="text-sm text-gray-700 mb-3">
                To create a custom renderer, implement a React component that accepts FieldRendererProps and register it.
                See the example in the GitHub repository for a complete implementation:
              </p>
              <p className="mb-4">
                <a 
                  href="https://github.com/petrarca/sonnet/blob/main/frontend/developer/src/components/demo/FieldRenderersDemo.tsx#L67-L103" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Custom Renderer Example
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
                      <span className="text-gray-500">{formatTimestamp(log.timestamp.getTime())}</span>
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
