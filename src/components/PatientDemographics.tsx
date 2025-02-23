import React from 'react';
import { Patient } from '../types/patient';

interface PatientDemographicsProps {
  patient: Patient;
}

const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm ring-1 ring-gray-200 ${className} transition-all duration-200 hover:shadow-md`}>
    <div className="border-b border-gray-100 bg-gray-50/50 px-3 py-2 rounded-t-xl">
      <div className="flex items-center">
        <div className="flex-shrink-0 text-blue-500/80">
          {icon}
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">
          {title}
        </h3>
      </div>
    </div>
    <div className="px-3 py-3">
      {children}
    </div>
  </div>
);

const InfoItem: React.FC<{ 
  label: string; 
  value?: string | string[];
  className?: string;
}> = ({ label, value, className = '' }) => {
  if (!value) return null;
  
  if (Array.isArray(value)) {
    return (
      <div className={`col-span-full ${className}`}>
        <dt className="text-sm font-medium text-gray-600 mb-2">{label}</dt>
        <dd className="mt-1">
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10"
              >
                {item}
              </span>
            ))}
          </div>
        </dd>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
      <dd className="text-base text-gray-900">{value}</dd>
    </div>
  );
};

const AddressDisplay: React.FC<{
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}> = ({ address }) => (
  <div>
    <dt className="text-sm font-medium text-gray-600 mb-1">Address</dt>
    <dd className="text-base text-gray-900">
      <address className="not-italic">
        {address.street}<br />
        {address.city}, {address.state} {address.zipCode}<br />
        {address.country}
      </address>
    </dd>
  </div>
);

export const PatientDemographics: React.FC<PatientDemographicsProps> = ({
  patient
}) => {
  return (
    <div className="space-y-2">
      {/* Fixed Patient Header */}
      <div className="sticky top-0 z-40">
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
              <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
              <span>•</span>
              <span>MRN: {patient.mrn}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 space-y-6">
          {/* Top Row - Personal Info & Physical Characteristics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard
              title="Personal Information"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            >
              <div className="grid grid-cols-2 gap-6">
                <InfoItem 
                  label="Full Name" 
                  value={`${patient.firstName} ${patient.lastName}`}
                  className="col-span-2"
                />
                <InfoItem 
                  label="First Name" 
                  value={patient.firstName}
                />
                <InfoItem 
                  label="Last Name" 
                  value={patient.lastName}
                />
                <InfoItem 
                  label="Date of Birth" 
                  value={new Date(patient.dateOfBirth).toLocaleDateString()} 
                />
                <InfoItem 
                  label="Sex" 
                  value={patient.sex} 
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Physical Characteristics"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              }
            >
              <div className="grid grid-cols-2 gap-6">
                <InfoItem 
                  label="Blood Type" 
                  value={patient.bloodType} 
                />
                <InfoItem 
                  label="Height" 
                  value={patient.height} 
                />
                <InfoItem 
                  label="Weight" 
                  value={patient.weight} 
                />
                <InfoItem 
                  label="BMI" 
                  value={patient.bmi} 
                />
              </div>
            </SectionCard>
          </div>

          {/* Middle Row - Contact & Medical Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard
              title="Contact Information"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem 
                  label="Phone" 
                  value={patient.phone} 
                />
                <InfoItem 
                  label="Email" 
                  value={patient.email} 
                />
                {patient.address && (
                  <div className="sm:col-span-2">
                    <AddressDisplay address={patient.address} />
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard
              title="Provider and Insurance"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              }
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <InfoItem 
                    label="Primary Physician" 
                    value={patient.primaryPhysician}
                    className="col-span-2" 
                  />
                  <InfoItem 
                    label="Insurance Provider" 
                    value={patient.insuranceProvider} 
                  />
                  <InfoItem 
                    label="Insurance Number" 
                    value={patient.insuranceNumber} 
                  />
                </div>
                {patient.allergies && patient.allergies.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <InfoItem 
                      label="Allergies" 
                      value={patient.allergies} 
                    />
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};
