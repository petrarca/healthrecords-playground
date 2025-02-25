import React from 'react';
import { Patient } from '../../types/types';
import { calculateAge } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface PatientHeaderProps {
  patient: Patient;
}

const getGenderTextColor = (sex: 'M' | 'F' | 'Other') => {
  switch (sex) {
    case 'M':
      return 'text-blue-700';
    case 'F':
      return 'text-pink-700';
    default:
      return 'text-purple-700';
  }
};

const getAllergiesText = (allergies: string[] | undefined) => {
  if (!allergies?.length) {
    return 'No Known Allergies';
  }
  const count = allergies.length;
  return `${count} Known ${count === 1 ? 'Allergy' : 'Allergies'}`;
};

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  const age = calculateAge(new Date(patient.dateOfBirth));
  const navigate = useNavigate();
  
  return (
    <div className="bg-blue-50 shadow-sm border border-blue-200">
      {/* Primary Info Bar */}
      <div className="border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Patient Basic Info */}
            <button 
              className="cursor-pointer hover:bg-gray-50 transition-colors text-left w-full"
              onClick={() => navigate(`/patients/${patient.id}/demographics`)}
              aria-label="View patient demographics"
            >
              <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  {patient.lastName}, {patient.firstName}
                  <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    #{patient.patientId}
                  </span>
                </h1>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{age} years</span>
                  <span>•</span>
                  <span className={`font-medium ${getGenderTextColor(patient.sex)}`}>
                    {patient.sex}
                  </span>
                  <span>•</span>
                  <span className="font-medium text-red-700">{patient.bloodType}</span>
                  <span>•</span>
                  <span>DOB: {patient.dateOfBirth.toLocaleDateString()}</span>
                </div>
              </div>
            </button>
            {/* Care Team */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{patient.primaryPhysician}</div>
                <div className="text-xs text-gray-500">Primary Physician</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Info Grid */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-200">
        {/* Vitals & Measurements */}
        <button 
          className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-left w-full"
          onClick={() => navigate(`/patients/${patient.id}/profile`)}
          aria-label="View patient profile and measurements"
        >
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Measurements</h3>
          <div className="space-y-1">
            {patient.height && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {(() => {
                    const heightRegex = /(\d+)\[(\w+)\]/;
                    const match = heightRegex.exec(patient.height);
                    return match ? `${match[1]} ${match[2]}` : '';
                  })()}
                </span>
                <span className="text-xs text-gray-500">height</span>
              </div>
            )}
            {patient.weight && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {(() => {
                    const weightRegex = /(\d+)\[(\w+)\]/;
                    const match = weightRegex.exec(patient.weight);
                    return match ? `${match[1]} ${match[2]}` : '';
                  })()}
                </span>
                <span className="text-xs text-gray-500">weight</span>
              </div>
            )}
          </div>
        </button>

        {/* Allergies & Alerts */}
        <button 
          className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-left w-full"
          onClick={() => navigate(`/patients/${patient.id}/profile`)}
          aria-label="View patient profile and alerts"
        >
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Alerts</h3>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm text-gray-900">
              {getAllergiesText(patient.allergies)}
            </span>
          </div>
        </button>

        {/* Insurance/Coverage */}
        <div className="px-4 py-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Insurance</h3>
          <div className="text-sm text-gray-500">Information pending</div>
        </div>

        {/* Next Appointment */}
        <div className="px-4 py-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Next Visit</h3>
          <div className="text-sm text-gray-500">No upcoming appointments</div>
        </div>
      </div>
    </div>
  );
};
