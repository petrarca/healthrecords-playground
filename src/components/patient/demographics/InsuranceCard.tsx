import React from 'react';
import { Phone } from 'lucide-react';
import { Card } from '../../ui/card';

interface InsuranceCardProps {
  provider?: string;
  number?: string;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({
  provider,
  number
}) => {
  return (
    <Card title="Insurance" icon={<Phone size={16} />} variant="amber">
      <div className="grid gap-2 text-sm">
        {provider && (
          <div className="flex gap-4">
            <span className="text-gray-500 w-20">Provider:</span>
            <span>{provider}</span>
          </div>
        )}
        {number && (
          <div className="flex gap-4">
            <span className="text-gray-500 w-20">Number:</span>
            <span>{number}</span>
          </div>
        )}
        {!provider && !number && (
          <div className="text-gray-500 italic">No insurance information available</div>
        )}
      </div>
    </Card>
  );
};
