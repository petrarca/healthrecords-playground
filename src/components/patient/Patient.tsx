import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Patient as PatientType, MedicalRecord } from '../../types/types';
import { MedicalTimeline } from '../timeline/MedicalTimeline';
import { PatientHeader } from './PatientHeader';
import { PatientDemographics } from './PatientDemographics';
import { PatientSummary } from './PatientSummary';
import { patientService } from '../../services/patientService';
import { medicalRecordService } from '../../services/medicalRecordService';

type TabType = 'timeline' | 'demographics' | 'summary';

export function Patient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [patient, setPatient] = useState<PatientType | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('summary');

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

        // If we're at the patient root, redirect to summary
        if (location.pathname === `/patient/${id}`) {
          navigate(`/patient/${id}/summary`, { replace: true });
        }

        // Set active tab based on URL
        if (location.pathname.includes('/demographics')) {
          setActiveTab('demographics');
        } else if (location.pathname.includes('/summary')) {
          setActiveTab('summary');
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
      
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('summary')}
              className={`${
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Summary
            </button>
            <button
              onClick={() => handleTabChange('timeline')}
              className={`${
                activeTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Timeline
            </button>
            <button
              onClick={() => handleTabChange('demographics')}
              className={`${
                activeTab === 'demographics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Demographics
            </button>
          </nav>
        </div>

        <div className="mt-6 px-4">
          {activeTab === 'summary' && (
            <div className="mx-auto w-3/4">
              <PatientSummary patient={patient} />
            </div>
          )}
          {activeTab === 'timeline' && (
            <MedicalTimeline records={records} />
          )}
          {activeTab === 'demographics' && (
            <PatientDemographics patient={patient} />
          )}
        </div>
      </div>
    </div>
  );
}
