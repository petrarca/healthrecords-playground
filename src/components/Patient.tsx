import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Patient as PatientType, MedicalRecord } from '../types/types';
import { MedicalTimeline } from './MedicalTimeline';
import { PatientHeader } from './PatientHeader';
import { patientService } from '../services/patientService';
import { medicalRecordService } from '../services/medicalRecordService';

export function Patient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [patient, setPatient] = useState<PatientType | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setError('No patient ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Loading patient data for ID:', id);
        const [patientData, patientRecords] = await Promise.all([
          patientService.getPatient(id),
          medicalRecordService.getPatientRecords(id)
        ]);
        
        console.log('Loaded patient:', patientData);
        console.log('Loaded records:', patientRecords.length);
        
        setPatient(patientData);
        setRecords(patientRecords);

        // If we're at the patient root, redirect to timeline
        if (location.pathname === `/patient/${id}`) {
          navigate(`/patient/${id}/timeline`, { replace: true });
        }
      } catch (error) {
        console.error('Error loading patient data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load patient data');
        setPatient(null);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, navigate, location]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Patient Data</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} />
      <div className="bg-white shadow-sm rounded-lg">
        <MedicalTimeline records={records} />
      </div>
    </div>
  );
}
