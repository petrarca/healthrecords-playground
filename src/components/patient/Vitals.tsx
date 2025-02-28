import { Patient } from '../../types/types';

interface VitalsProps {
  patient: Patient;
}

export function Vitals({ patient }: VitalsProps) {
  if (!patient) return null;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Vital Signs</h2>
      <div className="space-y-4">
        {/* Content will be added in future updates */}
      </div>
    </div>
  );
}
