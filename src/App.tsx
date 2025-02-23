import React, { useEffect, useState } from 'react';
import { Shell } from './components/Shell';
import { Patient, MedicalRecord } from './types';
import { PatientService } from './services/patientService';
import { MedicalRecordService } from './services/medicalRecordService';

function App() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const patientId = 'P123456'; // In a real app, this could come from URL params or user selection
    
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const [patientData, recordsData] = await Promise.all([
          PatientService.getPatient(patientId),
          MedicalRecordService.getPatientRecords(patientId)
        ]);
        
        setPatient(patientData);
        setRecords(recordsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium">Error loading patient data</p>
          <p className="mt-1 text-gray-600">{error || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  return <Shell patient={patient} records={records} />;
}

export default App;