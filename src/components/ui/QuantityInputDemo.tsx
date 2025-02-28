import React, { useState } from 'react';
import { QuantityInput } from './quantityInput';
import { QuantityValue, MedicalRecordType } from '../../types/medicalRecord';
import { metadataService } from '../../services/metadataService';

export const QuantityInputDemo: React.FC = () => {
  // Get field metadata for heart rate from the metadata service
  const heartRateMetadata = metadataService.getFieldMetadata(
    MedicalRecordType.VITAL_SIGNS,
    'heart_rate'
  );

  const bloodPressureMetadata = metadataService.getFieldMetadata(
    MedicalRecordType.VITAL_SIGNS,
    'blood_pressure'
  );

  const temperatureMetadata = metadataService.getFieldMetadata(
    MedicalRecordType.VITAL_SIGNS,
    'temperature'
  );

  // State for the quantity values
  const [heartRate, setHeartRate] = useState<QuantityValue>({ value: 72, unit: '/min' });
  const [bloodPressure, setBloodPressure] = useState<QuantityValue>({ value: '120/80', unit: 'mmHg' });
  const [temperature, setTemperature] = useState<QuantityValue>({ value: 37.2, unit: 'degC' });

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-xl font-bold">Quantity Input Demo</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Heart Rate</h3>
          {heartRateMetadata && (
            <QuantityInput
              fieldMetadata={heartRateMetadata}
              value={heartRate}
              onChange={setHeartRate}
            />
          )}
          <div className="mt-1 text-sm text-gray-500">
            Value: {JSON.stringify(heartRate)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Blood Pressure</h3>
          {bloodPressureMetadata && (
            <QuantityInput
              fieldMetadata={bloodPressureMetadata}
              value={bloodPressure}
              onChange={setBloodPressure}
            />
          )}
          <div className="mt-1 text-sm text-gray-500">
            Value: {JSON.stringify(bloodPressure)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Temperature</h3>
          {temperatureMetadata && (
            <QuantityInput
              fieldMetadata={temperatureMetadata}
              value={temperature}
              onChange={setTemperature}
            />
          )}
          <div className="mt-1 text-sm text-gray-500">
            Value: {JSON.stringify(temperature)}
          </div>
        </div>
      </div>
    </div>
  );
};
