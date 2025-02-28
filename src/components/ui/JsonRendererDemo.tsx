import React, { useState } from 'react';
import { JsonDisplay } from './jsonRenderer';

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

export const JsonRendererDemo: React.FC = () => {
  const [customJson, setCustomJson] = useState<string>('{\n  "example": "Edit me!",\n  "number": 42,\n  "boolean": true\n}');
  const [isValidJson, setIsValidJson] = useState<boolean>(true);
  const [parsedJson, setParsedJson] = useState<Record<string, unknown>>({ example: "Edit me!", number: 42, boolean: true });

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomJson(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setParsedJson(parsed);
      setIsValidJson(true);
    } catch (_error) {
      setIsValidJson(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-8">
      <h2 className="text-2xl font-bold">JSON Renderer Demo</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium mb-3">Complex Patient Data</h3>
          <JsonDisplay 
            data={sampleData} 
            title="Patient Information" 
          />
        </section>

        <section>
          <h3 className="text-lg font-medium mb-3">Simple Data</h3>
          <JsonDisplay 
            data={simpleData} 
            title="Simple Object" 
            compact={true}
            className="bg-gray-50 p-2 rounded"
          />
        </section>

        <section>
          <h3 className="text-lg font-medium mb-3">Deep Nested Data (max depth demo)</h3>
          <JsonDisplay 
            data={deepNestedData} 
            title="Deep Nested Structure" 
          />
        </section>

        <section>
          <h3 className="text-lg font-medium mb-3">Custom JSON Editor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Edit JSON:</p>
              <textarea
                className={`w-full h-64 p-2 font-mono text-sm border rounded ${!isValidJson ? 'border-red-500' : 'border-gray-300'}`}
                value={customJson}
                onChange={handleJsonChange}
              />
              {!isValidJson && (
                <p className="text-red-500 text-sm mt-1">Invalid JSON format</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              {isValidJson ? (
                <div className="h-64 overflow-auto border border-gray-300 rounded">
                  <JsonDisplay data={parsedJson} />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border border-gray-300 rounded bg-gray-50">
                  <p className="text-red-500">Fix JSON syntax to see preview</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
