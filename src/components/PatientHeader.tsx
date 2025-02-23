import React from 'react';
import { Patient } from '../types/types';

interface PatientHeaderProps {
  patient: Patient;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  const age = Math.floor((new Date().getTime() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
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
              <div className="flex flex-wrap items-center gap-2 text-sm mt-0.5">
                <div className="flex items-center gap-x-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">{age} years ({patient.dateOfBirth.toLocaleDateString()})</span>
                </div>
                <span className="hidden sm:inline text-gray-300">|</span>
                <div className="flex items-center gap-x-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-600">{patient.sex}</span>
                </div>
                {patient.bloodType && (
                  <>
                    <span className="hidden sm:inline text-gray-300">|</span>
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
          <div className="flex flex-wrap items-center gap-4 text-sm">
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
            <div className="sm:ml-auto text-sm">
              <div className="flex items-center gap-x-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-gray-600">{patient.insuranceProvider}</span>
                  <span className="text-gray-500 text-xs">{patient.insuranceNumber}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Allergies Section */}
        {patient.allergies && patient.allergies.length > 0 && (
          <div className="mt-4 flex items-start gap-x-1.5">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-sm">
              <span className="font-medium text-red-600">Allergies: </span>
              <span className="text-gray-600">{patient.allergies.join(', ')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
