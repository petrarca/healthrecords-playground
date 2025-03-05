import React from 'react';
import { Patient } from '../../types/patient';
import { 
  Heart,
  AlertCircle,
  Activity
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface MedicalProfileProps {
  patient: Patient;
}

export const MedicalProfile: React.FC<MedicalProfileProps> = ({
  patient
}) => {
  return (
    <div className="medical-profile grid gap-3 md:grid-cols-2 h-full overflow-auto">
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
                {patient.allergies.map((allergy) => (
                  <Badge 
                    key={allergy}
                    background="bg-amber-100"
                    textColor="text-amber-700"
                    borderColor="border-amber-200"
                  >
                    {allergy}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No known allergies</div>
            )}
          </div>
        </Card>
      </div>

      {/* Right Column: Conditions */}
      <div className="space-y-3">
        <Card title="Conditions" icon={<Activity size={16} />} variant="blue">
          <div className="space-y-2 text-sm">
            {patient.conditions && patient.conditions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {patient.conditions.map((condition) => (
                  <Badge 
                    key={condition}
                    background="bg-blue-100"
                    textColor="text-blue-700"
                    borderColor="border-blue-200"
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No known conditions</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
