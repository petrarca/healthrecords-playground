import React, { useState } from 'react';
import { FieldRenderer } from './index';
import { FieldMetaData } from '../../../types/medicalRecord';

/**
 * Demo component for showcasing field renderers
 */
export const FieldRenderersDemo: React.FC = () => {
  const [selectedRenderer, setSelectedRenderer] = useState<string>('labComponents');

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

  // Sample field metadata
  const fieldMetadata: Record<string, FieldMetaData> = {
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
  };

  // Data to render based on selected renderer
  const renderData = selectedRenderer === 'labComponents' ? labComponentsData : jsonData;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Field Renderers Demo</h1>
      
      <div className="mb-6">
        <label htmlFor="renderer-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Renderer
        </label>
        <select 
          id="renderer-select"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={selectedRenderer}
          onChange={(e) => setSelectedRenderer(e.target.value)}
        >
          <option value="labComponents">Lab Components Renderer</option>
          <option value="json">JSON Renderer</option>
        </select>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {fieldMetadata[selectedRenderer].label}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {fieldMetadata[selectedRenderer].description}
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <FieldRenderer
            data={renderData}
            fieldName={selectedRenderer}
            fieldMeta={fieldMetadata[selectedRenderer]}
          />
        </div>
      </div>
      
      <div className="mt-8 bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-2">How to Use Custom Renderers</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Define a renderer component that implements the FieldRendererProps interface</li>
          <li>Register your renderer using the registerRenderer function</li>
          <li>Set the rendererType property in your field metadata</li>
          <li>Use the FieldRenderer component to render your data</li>
        </ol>
        <pre className="mt-4 bg-gray-800 text-white p-4 rounded-md overflow-auto text-sm">
{`// Example registration
import { registerRenderer } from './utils';
import { MyCustomRenderer } from './MyCustomRenderer';

registerRenderer('myCustomType', MyCustomRenderer);

// Example metadata
{
  "myField": {
    "label": "My Field",
    "description": "Field description",
    "type": "json",
    "rendererType": "myCustomType"
  }
}`}
        </pre>
      </div>
    </div>
  );
};
