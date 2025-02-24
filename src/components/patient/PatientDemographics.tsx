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
    <div className="grid gap-3 md:grid-cols-3">
      {/* Personal Data Card */}
      <Card title="Personal Information" icon={<User2 size={16} />} variant="blue">
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Name:</span>
            <span className="font-medium text-gray-900">{`${patient.firstName} ${patient.lastName}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">DOB:</span>
            <span className="font-medium text-gray-900">{patient.dateOfBirth.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Sex:</span>
            <span className="font-medium text-gray-900">{patient.sex}</span>
          </div>
        </div>
      </Card>

      {/* Address Card */}
      {patient.address && (
        <Card title="Address" icon={<Home size={16} />} variant="green">
          <div className="text-sm">
            <div className="font-medium">{patient.address.street}</div>
            <div>{patient.address.city}, {patient.address.state} {patient.address.zipCode}</div>
            <div className="text-gray-500">{patient.address.country}</div>
          </div>
        </Card>
      )}

      {/* Contact Data Card */}
      <Card title="Contact" icon={<Phone size={16} />} variant="purple">
        <div className="grid gap-2 text-sm">
          {patient.phone && (
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <span className="font-medium">{patient.phone}</span>
            </div>
          )}
          {patient.email && (
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="font-medium">{patient.email}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Insurance Card */}
      <Card title="Insurance & Provider" icon={<BadgeAlert size={16} />} variant="amber">
        <div className="grid gap-2 text-sm">
          {patient.primaryPhysician && (
            <div className="flex justify-between">
              <span className="text-gray-500">Physician:</span>
              <span className="font-medium">{patient.primaryPhysician}</span>
            </div>
          )}
          {patient.insuranceProvider && (
            <div className="flex justify-between">
              <span className="text-gray-500">Provider:</span>
              <span className="font-medium">{patient.insuranceProvider}</span>
            </div>
          )}
          {patient.insuranceNumber && (
            <div className="flex justify-between">
              <span className="text-gray-500">Number:</span>
              <span className="font-medium">{patient.insuranceNumber}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
