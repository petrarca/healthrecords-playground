import React from 'react';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  sex: 'M' | 'F' | 'Other';
  bloodType?: string;
  height?: string;
  weight?: string;
  allergies?: string[];
  primaryPhysician?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

interface PatientHeaderProps {
  patient: Patient;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  const age = Math.floor((new Date().getTime() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return (
    <div className="bg-white shadow rounded-lg max-h-[20vh] border border-gray-100">
      <div className="px-6 py-4">
        <div className="flex items-center gap-x-8">
          {/* Left section - Basic Info */}
          <div className="flex items-center min-w-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center ring-4 ring-blue-50">
              <span className="text-lg font-semibold text-blue-700">
                {patient.firstName[0]}{patient.lastName[0]}
              </span>
            </div>
            <div className="ml-4 min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight truncate flex items-center gap-x-3">
                {patient.firstName} {patient.lastName}
                <span className="text-sm font-medium text-gray-500 tracking-normal">
                  #{patient.id}
                </span>
              </h1>
              <div className="flex items-center gap-x-3 text-sm mt-0.5">
                <div className="flex items-center gap-x-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">{age} years ({patient.dateOfBirth.toLocaleDateString()})</span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-x-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-600">{patient.sex}</span>
                </div>
                {patient.bloodType && (
                  <>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-x-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <span className="text-gray-600">{patient.bloodType}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Center section - Physical Info & Physician */}
          <div className="flex items-center gap-x-8 text-sm">
            {patient.height && patient.weight && (
              <div className="flex items-center gap-x-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">{patient.height} / {patient.weight}</span>
              </div>
            )}
            {patient.primaryPhysician && (
              <div className="flex items-center gap-x-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">{patient.primaryPhysician}</span>
              </div>
            )}
          </div>

          {/* Right section - Insurance */}
          {patient.insuranceProvider && (
            <div className="ml-auto text-right">
              <div className="flex items-center justify-end gap-x-1.5 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium text-gray-900">{patient.insuranceProvider}</span>
              </div>
              <div className="text-sm text-gray-500 mt-0.5">Policy #{patient.insuranceNumber}</div>
            </div>
          )}
        </div>

        {/* Allergies section */}
        {patient.allergies && patient.allergies.length > 0 && (
          <div className="mt-3 flex items-center gap-x-2 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-x-1.5">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Allergies:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {patient.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
