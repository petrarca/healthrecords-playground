import React from 'react';
import { FieldRendererProps } from './types';

/**
 * Renderer for lab components data
 * Displays lab test results in a tabular format
 */
export const LabComponentsRenderer: React.FC<FieldRendererProps> = ({ 
  data, 
}) => {
  // If data is not an array or is empty, return a message
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-500 italic">No lab components data available</div>;
  }

  return (
    <div className="components-table">
      <style>
        {`
        .components-table table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        .components-table th {
          text-align: left;
          padding: 0.5rem;
          background-color: #f3f4f6;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
        }
        .components-table td {
          padding: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .components-table tr:last-child td {
          border-bottom: none;
        }
        .components-table .value-cell {
          font-weight: 500;
        }
        .components-table .unit-cell {
          color: #6b7280;
        }
        .components-table .reference-cell {
          color: #6b7280;
          font-size: 0.75rem;
        }
        `}
      </style>
      <table>
        <thead>
          <tr>
            <th>Test</th>
            <th>Result</th>
            <th>Reference Range</th>
          </tr>
        </thead>
        <tbody>
          {data.map((component, index) => (
            <tr key={`lab-component-${component.test_name || index}`}>
              <td>{component.test_name}</td>
              <td className="value-cell">
                {component.value}
                {component.unit && <span className="unit-cell"> {component.unit}</span>}
              </td>
              <td className="reference-cell">{component.reference_range}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
