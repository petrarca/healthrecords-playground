import React from 'react';
import { User2 } from 'lucide-react';
import { Card } from '../../ui/Card';

interface PersonalInfoCardProps {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  firstName,
  lastName,
  dateOfBirth,
  gender
}) => {
  return (
    <Card title="Personal Information" icon={<User2 size={16} />} variant="blue">
      <div className="grid gap-2 text-sm">
        <div className="flex gap-4">
          <span className="text-gray-500 w-20">Name:</span>
          <span className="text-gray-900">{`${firstName} ${lastName}`}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-gray-500 w-20">DOB:</span>
          <span className="text-gray-900">{dateOfBirth.toLocaleDateString()}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-gray-500 w-20">Gender:</span>
          <span className="text-gray-900">{gender}</span>
        </div>
      </div>
    </Card>
  );
};
