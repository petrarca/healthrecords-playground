import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Patient as PatientType, MedicalRecord } from '../../types/types';
import { MedicalTimeline } from '../timeline/MedicalTimeline';
import { PatientHeader } from './PatientHeader';
import { PatientDemographics } from './PatientDemographics';
import { patientService } from '../../services/patientService';
import { medicalRecordService } from '../../services/medicalRecordService';

type TabType = 'timeline' | 'demographics';

export function Patient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [patient, setPatient] = useState<PatientType | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('timeline');

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

        // Set active tab based on URL
        if (location.pathname.includes('/demographics')) {
          setActiveTab('demographics');
        } else {
          setActiveTab('timeline');
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
  }, [id, location.pathname, navigate]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    navigate(`/patient/${id}/${tab}`);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-red-600">
          {error || 'Patient not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <PatientHeader patient={patient} />
      
      {/* Tabs */}
      <div className="px-1 sm:px-2 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => handleTabChange('timeline')}
            className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
              activeTab === 'timeline'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Timeline
          </button>
          <button
            onClick={() => handleTabChange('demographics')}
            className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
              activeTab === 'demographics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Demographics
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'timeline' ? (
          <MedicalTimeline records={records} />
        ) : (
          <PatientDemographics patient={patient} />
        )}
      </div>
    </div>
  );
}
