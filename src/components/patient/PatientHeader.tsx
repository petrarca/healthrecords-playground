import React from 'react';
import { Patient } from '../../types/types';

interface PatientHeaderProps {
  patient: Patient;
}

const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  const age = calculateAge(patient.dateOfBirth);
  
  return (
    <div className="bg-white shadow-sm">
      {/* Primary Info Bar */}
      <div className="border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Patient Basic Info */}
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  {patient.lastName}, {patient.firstName}
                  <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    #{patient.id}
                  </span>
                </h1>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{age} years</span>
                  <span>•</span>
                  <span className={`font-medium ${
                    patient.sex === 'M' ? 'text-blue-700' :
                    patient.sex === 'F' ? 'text-pink-700' :
                    'text-purple-700'
                  }`}>{patient.sex}</span>
                  <span>•</span>
                  <span className="font-medium text-red-700">{patient.bloodType}</span>
                  <span>•</span>
                  <span>DOB: {patient.dateOfBirth.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
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
        <div className="px-4 py-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Measurements</h3>
          <div className="space-y-1">
            {patient.height && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {(() => {
                    const match = patient.height.match(/(\d+)\[(\w+)\]/);
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
                    const match = patient.weight.match(/(\d+)\[(\w+)\]/);
                    return match ? `${match[1]} ${match[2]}` : '';
                  })()}
                </span>
                <span className="text-xs text-gray-500">weight</span>
              </div>
            )}
          </div>
        </div>

        {/* Allergies & Alerts */}
        <div className="px-4 py-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Alerts</h3>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm text-gray-900">
              {patient.allergies?.length ? 
                `${patient.allergies.length} Known ${patient.allergies.length === 1 ? 'Allergy' : 'Allergies'}` :
                'No Known Allergies'}
            </span>
          </div>
        </div>

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
