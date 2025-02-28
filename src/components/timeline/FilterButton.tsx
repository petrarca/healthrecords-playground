import React from 'react';
import { MedicalRecordType } from '../../types/types';
import { TimelineIcon } from './TimelineIcon';

interface FilterButtonProps {
  type: MedicalRecordType;
  active: boolean;
  onClick: () => void;
  count: number;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ type, active, onClick, count }) => {
  const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150";
  const activeClasses = {
    [MedicalRecordType.DIAGNOSIS]: "bg-red-50 text-red-700",
    [MedicalRecordType.LAB_RESULT]: "bg-blue-50 text-blue-700",
    [MedicalRecordType.COMPLAINT]: "bg-yellow-50 text-yellow-700",
    [MedicalRecordType.VITAL_SIGNS]: "bg-green-50 text-green-700",
    [MedicalRecordType.MEDICATION]: "bg-purple-50 text-purple-700",
    [MedicalRecordType.PROCEDURE]: "bg-indigo-50 text-indigo-700"
  };
  const inactiveClasses = "bg-gray-50 text-gray-500 hover:bg-gray-100";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${active ? activeClasses[type] : inactiveClasses}`}
    >
      <TimelineIcon type={type} size="sm" />
      <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
      <span className="ml-1 text-xs bg-white px-2 py-0.5 rounded-full">{count}</span>
    </button>
  );
};
