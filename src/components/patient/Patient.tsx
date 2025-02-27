import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MedicalTimeline } from '../timeline/MedicalTimeline';
import { PatientHeader } from './PatientHeader';
import { PatientDemographics } from './demographics/PatientDemographics';
import { PatientSummary } from './PatientSummary';
import { MedicalProfile } from './MedicalProfile';
import { usePatient, useUpdatePatient } from '../../hooks/usePatient';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import { contextService } from '../../services/contextService';

type TabType = 'timeline' | 'demographics' | 'summary' | 'profile';

export function Patient() {
  const { id, recordId } = useParams<{ id: string; recordId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  const { data: patient, isLoading: patientLoading, error: patientError } = usePatient(id ?? '');
  const { data: records, isLoading: recordsLoading } = useMedicalRecords(id ?? '');
  const { mutate: updatePatient } = useUpdatePatient();

  const loading = patientLoading || recordsLoading;
  const error = patientError?.message ?? null;

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    // Set active tab based on URL
    const path = location.pathname;
    if (path.includes('/timeline')) {
      setActiveTab('timeline');
    }
    else if (path.includes('/demographics')) setActiveTab('demographics');
    else if (path.includes('/profile')) setActiveTab('profile');
    else setActiveTab('summary');
    
    // Update context service with current URL information
    contextService.updateFromUrl(path, id, recordId);
  }, [id, location.pathname, navigate, recordId]);

  // Update context service when patient data is loaded
  useEffect(() => {
    if (patient) {
      contextService.setCurrentPatient(patient);
    }
  }, [patient]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error || !patient) {
    return <div className="p-4 text-red-600">Error: {error ?? 'Patient not found'}</div>;
  }

  // Helper function to navigate using contextService
  const navigateToTab = (tab: TabType) => {
    contextService.navigateTo(tab, id, tab === 'timeline' ? recordId : undefined);
  };

  return (
    <div className="flex flex-col h-full">
      <PatientHeader patient={patient} />
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8 px-4" aria-label="Tabs">
          <button
            onClick={() => navigateToTab('summary')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'summary'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => navigateToTab('timeline')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'timeline'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => navigateToTab('demographics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'demographics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Demographics
          </button>
          <button
            onClick={() => navigateToTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Medical Profile
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-gray-50 pt-4 overflow-hidden">
        {activeTab === 'summary' && <PatientSummary patient={patient} />}
        {activeTab === 'timeline' && <MedicalTimeline records={records || []} selectedRecordId={recordId} />}
        {activeTab === 'demographics' && <PatientDemographics patient={patient} onUpdatePatient={updatePatient} />}
        {activeTab === 'profile' && <MedicalProfile patient={patient} />}
      </div>
    </div>
  );
}
