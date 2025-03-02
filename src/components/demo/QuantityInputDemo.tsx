import React, { useState, useEffect, useCallback } from 'react';
import { QuantityInput } from '../ui/quantityInput';
import { CodeExample } from '../ui/codeExample';
import { FieldMetaData, QuantityValue } from '../../types/medicalRecord';

interface EventLog {
  type: string;
  message: string;
  timestamp: Date;
}

export const QuantityInputDemo: React.FC = () => {
  const [temperature, setTemperature] = useState<QuantityValue>({ value: 98.6, unit: '°F' });
  const [heartRate, setHeartRate] = useState<QuantityValue>({ value: 72, unit: 'bpm' });
  const [bloodPressure, setBloodPressure] = useState<QuantityValue>({ value: 120, unit: 'mmHg' });
  const [events, setEvents] = useState<EventLog[]>([]);
  const [codeExample, setCodeExample] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('temperature');

  // Create field metadata for each input
  const temperatureFieldMeta: FieldMetaData = {
    label: 'Temperature',
    description: 'Body temperature measurement',
    type: 'quantity',
    quantityType: 'number',
    quantityUnits: [
      { unit: '°F', display_name: '°F', default: true },
      { unit: '°C', display_name: '°C' }
    ]
  };

  const heartRateFieldMeta: FieldMetaData = {
    label: 'Heart Rate',
    description: 'Heart rate measurement',
    type: 'quantity',
    quantityType: 'number',
    quantityUnits: [
      { unit: 'bpm', display_name: 'bpm', default: true }
    ]
  };

  const bloodPressureFieldMeta: FieldMetaData = {
    label: 'Blood Pressure',
    description: 'Blood pressure measurement (systolic)',
    type: 'quantity',
    quantityType: 'number',
    quantityUnits: [
      { unit: 'mmHg', display_name: 'mmHg', default: true }
    ]
  };

  // Generate code example
  const generateCodeExample = useCallback((): string => {
    let codeExample = `import { QuantityInput, QuantityValue } from './components/ui/quantityInput';
import { FieldMetaData } from './types/medicalRecord';

const MyComponent = () => {`;

    if (activeTab === 'temperature') {
      codeExample += `
  // Define field metadata
  const temperatureFieldMeta: FieldMetaData = {
    label: 'Temperature',
    description: 'Body temperature measurement',
    type: 'quantity',
    quantityType: 'number',
    quantityUnits: [
      { unit: '°F', display_name: '°F', default: true },
      { unit: '°C', display_name: '°C' }
    ]
  };

  const [temperature, setTemperature] = useState<QuantityValue>({ 
    value: ${temperature.value}, 
    unit: '${temperature.unit}' 
  });

  const handleTemperatureChange = (newValue: QuantityValue) => {
    setTemperature(newValue);
    console.log('Temperature updated:', newValue);
  };

  return (
    <div className="space-y-4">
      <QuantityInput 
        fieldMetadata={temperatureFieldMeta}
        value={temperature} 
        onChange={handleTemperatureChange}
      />
    </div>
  );`;
    } else if (activeTab === 'heartRate') {
      codeExample += `
  // Define field metadata
  const heartRateFieldMeta: FieldMetaData = {
    label: 'Heart Rate',
    description: 'Heart rate measurement',
    type: 'quantity',
    quantityType: 'number',
    quantityUnits: [
      { unit: 'bpm', display_name: 'bpm', default: true }
    ]
  };

  const [heartRate, setHeartRate] = useState<QuantityValue>({ 
    value: ${heartRate.value}, 
    unit: '${heartRate.unit}' 
  });

  const handleHeartRateChange = (newValue: QuantityValue) => {
    setHeartRate(newValue);
    console.log('Heart rate updated:', newValue);
  };

  return (
    <div className="space-y-4">
      <QuantityInput 
        fieldMetadata={heartRateFieldMeta}
        value={heartRate} 
        onChange={handleHeartRateChange}
      />
    </div>
  );`;
    } else if (activeTab === 'bloodPressure') {
      codeExample += `
  // Define field metadata
  const bloodPressureFieldMeta: FieldMetaData = {
    label: 'Blood Pressure',
    description: 'Blood pressure measurement (systolic)',
    type: 'quantity',
    quantityType: 'number',
    quantityUnits: [
      { unit: 'mmHg', display_name: 'mmHg', default: true }
    ]
  };

  const [bloodPressure, setBloodPressure] = useState<QuantityValue>({ 
    value: ${bloodPressure.value}, 
    unit: '${bloodPressure.unit}' 
  });

  const handleBloodPressureChange = (newValue: QuantityValue) => {
    setBloodPressure(newValue);
    console.log('Blood pressure updated:', newValue);
  };

  return (
    <div className="space-y-4">
      <QuantityInput 
        fieldMetadata={bloodPressureFieldMeta}
        value={bloodPressure} 
        onChange={handleBloodPressureChange}
      />
    </div>
  );`;
    }

    codeExample += `
};`;

    return codeExample;
  }, [activeTab, temperature, heartRate, bloodPressure]);

  useEffect(() => {
    // Update code example when values change or active tab changes
    setCodeExample(generateCodeExample());
  }, [generateCodeExample, activeTab]);

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

  const handleTemperatureChange = (newValue: QuantityValue): void => {
    setTemperature(newValue);
    logEvent('TEMPERATURE_CHANGED', { oldValue: temperature, newValue });
  };

  const handleHeartRateChange = (newValue: QuantityValue): void => {
    setHeartRate(newValue);
    logEvent('HEART_RATE_CHANGED', { oldValue: heartRate, newValue });
  };

  const handleBloodPressureChange = (newValue: QuantityValue): void => {
    setBloodPressure(newValue);
    logEvent('BLOOD_PRESSURE_CHANGED', { oldValue: bloodPressure, newValue });
  };

  return (
    <div className="h-screen overflow-auto p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Quantity Input Demo</h2>
          <p className="text-gray-600">
            This demo showcases the QuantityInput component for handling numeric values with units.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Example
              </label>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 text-sm rounded ${activeTab === 'temperature' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setActiveTab('temperature')}
                >
                  Temperature
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded ${activeTab === 'heartRate' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setActiveTab('heartRate')}
                >
                  Heart Rate
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded ${activeTab === 'bloodPressure' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setActiveTab('bloodPressure')}
                >
                  Blood Pressure
                </button>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div>
                {activeTab === 'temperature' && (
                  <>
                    <h4 className="text-sm font-medium mb-2">Temperature</h4>
                    <QuantityInput 
                      fieldMetadata={temperatureFieldMeta}
                      value={temperature} 
                      onChange={handleTemperatureChange}
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      Value: {JSON.stringify(temperature)}
                    </div>
                  </>
                )}
                
                {activeTab === 'heartRate' && (
                  <>
                    <h4 className="text-sm font-medium mb-2">Heart Rate</h4>
                    <QuantityInput 
                      fieldMetadata={heartRateFieldMeta}
                      value={heartRate} 
                      onChange={handleHeartRateChange}
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      Value: {JSON.stringify(heartRate)}
                    </div>
                  </>
                )}
                
                {activeTab === 'bloodPressure' && (
                  <>
                    <h4 className="text-sm font-medium mb-2">Blood Pressure</h4>
                    <QuantityInput 
                      fieldMetadata={bloodPressureFieldMeta}
                      value={bloodPressure} 
                      onChange={handleBloodPressureChange}
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      Value: {JSON.stringify(bloodPressure)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold mb-2">Current State</h3>
              <pre className="text-xs">
                {JSON.stringify(
                  activeTab === 'temperature' ? { temperature } :
                  activeTab === 'heartRate' ? { heartRate } :
                  { bloodPressure }, 
                  null, 
                  2
                )}
              </pre>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold mb-2">Event Log</h3>
              <div className="h-64 overflow-y-auto border rounded p-2">
                {events.map((log, index) => (
                  <div key={index} className="text-xs border-b pb-2 mb-2 last:border-0">
                    <div className="flex justify-between">
                      <span className="font-medium">{log.type}</span>
                      <span className="text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <pre className="mt-1 text-gray-600 whitespace-pre-wrap">
                      {typeof log.message === 'string' ? log.message : JSON.stringify(log.message, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-md font-semibold mb-3">Usage Example</h3>
          <CodeExample 
            code={codeExample} 
            language="tsx" 
            className="text-xs w-full" 
            showLineNumbers={true}
            maxHeight="none"
          />
        </div>
      </div>
    </div>
  );
};
