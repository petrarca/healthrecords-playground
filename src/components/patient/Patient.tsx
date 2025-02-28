import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MedicalTimeline } from '../timeline/MedicalTimeline';
import { PatientHeader } from './PatientHeader';
import { PatientDemographics } from './demographics/PatientDemographics';
import { PatientSummary } from './PatientSummary';
import { MedicalProfile } from './MedicalProfile';
import { Vitals } from './Vitals';
import { usePatient, useUpdatePatient } from '../../hooks/usePatient';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import { contextService } from '../../services/contextService';

type TabType = 'timeline' | 'demographics' | 'summary' | 'profile' | 'vitals';

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
    else if (path.includes('/vitals')) setActiveTab('vitals');
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
    <div className="patient-container patient-view flex flex-col h-full overflow-hidden w-full">
      {/* Fixed header section */}
      <div className="flex-shrink-0">
        <PatientHeader patient={patient} />
        
        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <nav className="flex space-x-8 px-4" aria-label="Tabs">
            <button
              onClick={() => navigateToTab('summary')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => navigateToTab('timeline')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => navigateToTab('demographics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'demographics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Demographics
            </button>
            <button
              onClick={() => navigateToTab('vitals')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vitals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vitals
            </button>
            <button
              onClick={() => navigateToTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Medical Profile
            </button>
          </nav>
        </div>
      </div>

      {/* Content area - no scrolling here as components handle their own scrolling */}
      <div className="flex-1 bg-gray-50 overflow-hidden ipad-main-content-fix">
        {activeTab === 'summary' && <PatientSummary patient={patient} />}
        {activeTab === 'timeline' && <MedicalTimeline records={records || []} selectedRecordId={recordId} />}
        {activeTab === 'demographics' && <PatientDemographics patient={patient} onUpdatePatient={updatePatient} />}
        {activeTab === 'vitals' && <Vitals patient={patient} />}
        {activeTab === 'profile' && <MedicalProfile patient={patient} />}
      </div>
    </div>
  );
}
