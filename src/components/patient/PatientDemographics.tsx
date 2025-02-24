import React from 'react';
import { Patient } from '../../types/patient';
import { 
  User2, 
  Home, 
  Phone, 
  BadgeAlert 
} from 'lucide-react';

interface PatientDemographicsProps {
  patient: Patient;
}

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant: 'blue' | 'green' | 'purple' | 'amber' | 'rose';
}

const cardStyles = {
  blue: 'border-blue-200 bg-blue-50/50',
  green: 'border-green-200 bg-green-50/50',
  purple: 'border-purple-200 bg-purple-50/50',
  amber: 'border-amber-200 bg-amber-50/50',
  rose: 'border-rose-200 bg-rose-50/50',
} as const;

const headerStyles = {
  blue: 'bg-blue-100/50 border-blue-200',
  green: 'bg-green-100/50 border-green-200',
  purple: 'bg-purple-100/50 border-purple-200',
  amber: 'bg-amber-100/50 border-amber-200',
  rose: 'bg-rose-100/50 border-rose-200',
} as const;

const iconStyles = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  amber: 'text-amber-600',
  rose: 'text-rose-600',
} as const;

const Card: React.FC<CardProps> = ({ title, icon, children, variant }) => (
  <div className={`bg-white rounded shadow-sm overflow-hidden border ${cardStyles[variant]}`}>
    <div className={`border-b px-3 py-2 flex items-center gap-2 ${headerStyles[variant]}`}>
      <div className={`w-4 h-4 ${iconStyles[variant]}`}>
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
    </div>
    <div className="p-3">
      {children}
    </div>
  </div>
);

export const PatientDemographics: React.FC<PatientDemographicsProps> = ({
  patient
}) => {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="space-y-3">
        {/* Personal Data Card */}
        <Card title="Personal Information" icon={<User2 size={16} />} variant="blue">
          <div className="grid gap-2 text-sm">
            <div className="flex gap-4">
              <span className="text-gray-500 w-20">Name:</span>
              <span className="text-gray-900">{`${patient.firstName} ${patient.lastName}`}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-500 w-20">DOB:</span>
              <span className="text-gray-900">{patient.dateOfBirth.toLocaleDateString()}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-500 w-20">Sex:</span>
              <span className="text-gray-900">{patient.sex}</span>
            </div>
          </div>
        </Card>

        {/* Addresses Card */}
        <Card title="Addresses" icon={<Home size={16} />} variant="green">
          <div className="grid gap-1.5 text-sm">
            {(!patient.addresses || patient.addresses.length === 0) ? (
              <div className="text-gray-500 italic">No addresses defined</div>
            ) : (
              patient.addresses.map((address, index) => {
                const isPrimary = address.label === patient.primaryAddressType;
                return (
                  <div key={index} className="flex gap-2">
                    <span className="text-gray-500 w-14">{address.label}:</span>
                    <span className="flex-1 flex items-center gap-2">
                      <span>{address.street}, {address.city}, {address.state} {address.zipCode}</span>
                      {isPrimary && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded whitespace-nowrap">
                          Primary Address
                        </span>
                      )}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Contact Data Card */}
        <Card title="Contact" icon={<Phone size={16} />} variant="purple">
          <div className="grid gap-2 text-sm">
            {patient.phone && (
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Phone:</span>
                <span>{patient.phone}</span>
              </div>
            )}
            {patient.email && (
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Email:</span>
                <span>{patient.email}</span>
              </div>
            )}
            {!patient.phone && !patient.email && (
              <div className="text-gray-500 italic">No contact information available</div>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        {/* Insurance Card */}
        <Card title="Insurance" icon={<BadgeAlert size={16} />} variant="amber">
          <div className="grid gap-2 text-sm">
            {patient.insuranceProvider && (
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Provider:</span>
                <span>{patient.insuranceProvider}</span>
              </div>
            )}
            {patient.insuranceNumber && (
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Number:</span>
                <span>{patient.insuranceNumber}</span>
              </div>
            )}
            {!patient.insuranceProvider && !patient.insuranceNumber && (
              <div className="text-gray-500 italic">No insurance information available</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
