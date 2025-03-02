import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

export interface JsonRendererProps {
  data: unknown;
  initialExpanded?: boolean;
  depth?: number;
  maxDepth?: number;
  showCopyButton?: boolean;
  className?: string;
}

// Helper function to ensure all nested objects are properly parsed
const ensureProperJsonObjects = (data: unknown): unknown => {
  // Base case: if data is null or undefined, return as is
  if (data === null || data === undefined) {
    return data;
  }
  
  // If data is a string, try to parse it
  if (typeof data === 'string') {
    try {
      // Try to parse it as JSON
      return ensureProperJsonObjects(JSON.parse(data));
    } catch (_e) {
      // If it's not valid JSON, return the original string
      return data;
    }
  }
  
  // If data is an array, recursively process each element
  if (Array.isArray(data)) {
    return data.map(item => ensureProperJsonObjects(item));
  }
  
  // If data is an object, recursively process each property
  if (typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const key in data) {
      if (Object.hasOwn(data, key)) {
        result[key] = ensureProperJsonObjects((data as Record<string, unknown>)[key]);
      }
    }
    return result;
  }
  
  // For primitive values (number, boolean), return as is
  return data;
};

// Extract the object/array rendering to a separate component
const ObjectArrayRenderer: React.FC<{
  parsedData: Record<string, unknown> | unknown[];
  isArray: boolean;
  depth: number;
  maxDepth: number;
  initialExpanded: boolean;
  showCopyButton: boolean;
  className: string;
}> = ({ 
  parsedData, 
  isArray, 
  depth, 
  maxDepth, 
  initialExpanded,
  showCopyButton,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded && depth < maxDepth);
  const [copied, setCopied] = useState(false);
  
  // Copy to clipboard functionality
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };
  
  const renderCopyButton = () => {
    if (!showCopyButton) return null;
    return (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          copyToClipboard();
        }}
        className="ml-2 text-gray-400 hover:text-gray-600"
        aria-label="Copy to clipboard"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </button>
    );
  };
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  return (
    <div className={`ml-1 ${className}`}>
      <div 
        className={`flex items-center cursor-pointer ${isExpanded ? '' : 'ml-4'} bg-transparent p-0 text-left`} 
        onClick={toggleExpand}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpand();
          }
        }}
      >
        {isExpanded ? 
          <ChevronDown className="h-3 w-3 text-gray-500" /> : 
          <ChevronRight className="h-3 w-3 text-gray-500" />
        }
        <span className="text-gray-700 font-medium ml-1">
          {isArray ? `Array(${parsedData.length})` : `Object(${Object.keys(parsedData).length})`}
        </span>
        {renderCopyButton()}
      </div>
      
      {isExpanded && (
        <div className="pl-4 border-l border-gray-200 ml-1">
          {isArray ? (
            // Render array items
            (parsedData as unknown[]).map((item, index) => {
              // Create a more stable key by including the data type
              const itemType = typeof item;
              const itemKey = `item-${itemType}-${index}-${depth}`;
              return (
                <div key={itemKey} className="my-1">
                  <span className="text-gray-500 mr-2">{index}:</span>
                  <JsonRenderer 
                    data={item} 
                    depth={depth + 1} 
                    maxDepth={maxDepth}
                    initialExpanded={initialExpanded}
                  />
                </div>
              );
            })
          ) : (
            // Render object properties
            Object.entries(parsedData).map(([key, value]) => (
              <div key={`prop-${key}`} className="my-1">
                <span className="text-purple-600 mr-2">"{key}":</span>
                <JsonRenderer 
                  data={value} 
                  depth={depth + 1} 
                  maxDepth={maxDepth}
                  initialExpanded={initialExpanded}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Extract primitive value rendering to a separate component
const PrimitiveRenderer: React.FC<{
  parsedData: unknown;
  dataType: string;
}> = ({ parsedData, dataType }) => {
  if (parsedData === null) return <span className="text-gray-500">null</span>;
  if (parsedData === undefined) return <span className="text-gray-500">undefined</span>;
  
  if (dataType === 'boolean') 
    return <span className="text-blue-600">{parsedData ? 'true' : 'false'}</span>;
  
  if (dataType === 'number') 
    return <span className="text-green-600">{String(parsedData)}</span>;
  
  if (dataType === 'string') {
    const stringValue = parsedData as string;
    // Check if string is a URL
    const urlRegex = /^(https?:\/\/|www\.)/i;
    const match = urlRegex.exec(stringValue);
    if (match) {
      return <a href={stringValue} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{stringValue}</a>;
    }
    return <span className="text-amber-600">"{stringValue}"</span>;
  }
  
  return <span className="text-gray-500">unknown</span>;
};

// Main JsonRenderer component with reduced complexity
export const JsonRenderer: React.FC<JsonRendererProps> = ({ 
  data, 
  initialExpanded = true, 
  depth = 0, 
  maxDepth = 3,
  showCopyButton = false,
  className = ''
}) => {
  // Ensure we're working with properly parsed data
  const parsedData = ensureProperJsonObjects(data);
  const dataType = typeof parsedData;
  const isArray = Array.isArray(parsedData);
  
  // Handle objects and arrays
  if (dataType === 'object' && parsedData !== null) {
    return (
      <ObjectArrayRenderer 
        parsedData={parsedData as Record<string, unknown> | unknown[]}
        isArray={isArray}
        depth={depth}
        maxDepth={maxDepth}
        initialExpanded={initialExpanded}
        showCopyButton={showCopyButton}
        className={className}
      />
    );
  }
  
  // Handle primitive values
  return <PrimitiveRenderer parsedData={parsedData} dataType={dataType} />;
};

// Wrapper component with styling
export const JsonDisplay: React.FC<Omit<JsonRendererProps, 'depth' | 'maxDepth'> & {
  title?: string;
  compact?: boolean;
}> = ({ 
  data, 
  initialExpanded = true,
  showCopyButton = true,
  title,
  compact = false,
  className = ''
}) => {
  // Force the data to be properly serialized and deserialized
  // This ensures we break any reference issues and get a clean object
  let cleanData;
  try {
    // First convert to a JSON string
    const jsonString = JSON.stringify(data);
    
    // Then parse it back to an object
    cleanData = JSON.parse(jsonString);
  } catch (_e) {
    cleanData = data; // Fallback to original data if there's an error
  }

  return (
    <div className={`${compact ? '' : 'bg-gray-50 p-3 rounded'} overflow-auto ${className}`}>
      {title && <div className="text-sm font-medium mb-2">{title}</div>}
      <div className="font-mono text-sm">
        <JsonRenderer 
          data={cleanData} 
          initialExpanded={initialExpanded}
          showCopyButton={showCopyButton}
        />
      </div>
    </div>
  );
};
