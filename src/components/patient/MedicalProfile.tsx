import React from 'react';
import { Patient } from '../../types/patient';
import { 
  Heart,
  AlertCircle
} from 'lucide-react';

interface MedicalProfileProps {
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

export const MedicalProfile: React.FC<MedicalProfileProps> = ({
  patient
}) => {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {/* General Observations Card */}
      <Card title="General Observations" icon={<Heart size={16} />} variant="rose">
        <div className="space-y-2 text-sm">
          <div className="grid gap-1">
            {patient.bloodType && (
              <div className="flex justify-between">
                <span className="text-gray-500">Blood Type:</span>
                <span className="font-medium">{patient.bloodType}</span>
              </div>
            )}
            {patient.height && (
              <div className="flex justify-between">
                <span className="text-gray-500">Height:</span>
                <span className="font-medium">{patient.height}</span>
              </div>
            )}
            {patient.weight && (
              <div className="flex justify-between">
                <span className="text-gray-500">Weight:</span>
                <span className="font-medium">{patient.weight}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Allergies Card */}
      <Card title="Allergies" icon={<AlertCircle size={16} />} variant="amber">
        <div className="space-y-2 text-sm">
          {patient.allergies && patient.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {patient.allergies.map((allergy, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200"
                >
                  {allergy}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No known allergies</div>
          )}
        </div>
      </Card>
    </div>
  );
};
