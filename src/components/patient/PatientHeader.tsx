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
    <div className="bg-white shadow-sm border-b border-gray-200">
      {/* Critical Info Bar */}
      <div className="bg-gradient-to-r from-gray-100 to-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-semibold text-gray-900">
                {patient.lastName}, {patient.firstName}
              </span>
              <span className="px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                ID: {patient.id}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-gray-800">{age} y/o</span>
              <span className="text-gray-300">•</span>
              <span className={`font-semibold ${
                patient.sex === 'M' ? 'text-blue-700' :
                patient.sex === 'F' ? 'text-pink-700' :
                'text-purple-700'
              }`}>{patient.sex}</span>
              <span className="text-gray-300">•</span>
              <span className="font-semibold text-red-700">{patient.bloodType}</span>
              <span className="text-gray-300">•</span>
              <span className="font-medium text-gray-800">DOB: {patient.dateOfBirth.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-gray-200 pr-6">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{patient.primaryPhysician}</div>
                <div className="text-xs text-gray-500">Primary Physician</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Physical Measurements */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-900">{patient.height}</span>
                <span className="text-xs text-gray-500">height</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-900">{patient.weight}</span>
                <span className="text-xs text-gray-500">weight</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-gray-200"></div>

            {/* Allergies - Important medical info */}
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex flex-wrap gap-1">
                {patient.allergies?.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100"
                  >
                    {allergy}
                  </span>
                ))}
                {(!patient.allergies || patient.allergies.length === 0) && (
                  <span className="text-xs text-gray-500">NKDA</span>
                )}
              </div>
            </div>
          </div>

          {/* Insurance Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <div>
                <span className="text-xs text-gray-500">Insurance</span>
                <div className="text-xs font-medium text-gray-900">{patient.insuranceProvider}</div>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Policy #</span>
              <div className="text-xs font-medium font-mono text-gray-900">{patient.insuranceNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
