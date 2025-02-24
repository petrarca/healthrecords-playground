import React from 'react';
import { Patient } from '../../types/patient';
import { 
  Heart,
  AlertCircle
} from 'lucide-react';
import { Card } from '../ui/Card';

interface MedicalProfileProps {
  patient: Patient;
}

export const MedicalProfile: React.FC<MedicalProfileProps> = ({
  patient
}) => {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {/* Left Column: General Observations and Allergies */}
      <div className="space-y-3">
        <Card title="General Observations" icon={<Heart size={16} />} variant="purple">
          <div className="space-y-2 text-sm">
            <div className="grid gap-1">
              {patient.bloodType && (
                <div className="flex gap-4">
                  <span className="text-gray-500 w-20">Blood Type:</span>
                  <span className="text-gray-900">{patient.bloodType}</span>
                </div>
              )}
              {patient.height && (
                <div className="flex gap-4">
                  <span className="text-gray-500 w-20">Height:</span>
                  <span className="text-gray-900">{patient.height}</span>
                </div>
              )}
              {patient.weight && (
                <div className="flex gap-4">
                  <span className="text-gray-500 w-20">Weight:</span>
                  <span className="text-gray-900">{patient.weight}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

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

      {/* Right Column: Reserved for future medical information */}
      <div></div>
    </div>
  );
};
