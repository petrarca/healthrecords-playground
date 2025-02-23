import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockPatients, mockMedicalRecords } from '../services/mockData';
import { Patient as PatientType } from '../services/mockData';
import { MedicalTimeline } from './MedicalTimeline';
import { PatientHeader } from './PatientHeader';

export function Patient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [patient, setPatient] = useState<PatientType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No patient ID provided');
      return;
    }

    const patientData = mockPatients[id];
    if (!patientData) {
      setError(`Patient with ID ${id} not found`);
      return;
    }

    setPatient(patientData);
    setError(null);

    // If we're at the patient root, redirect to timeline
    if (location.pathname === `/patient/${id}`) {
      navigate(`/patient/${id}/timeline`, { replace: true });
    }
  }, [id, navigate, location]);

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
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const records = mockMedicalRecords[patient.id] || [];

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <PatientHeader patient={patient} />

      {/* Medical Timeline */}
      <div className="bg-white shadow-sm rounded-lg">
        <MedicalTimeline records={records} />
      </div>
    </div>
  );
}
