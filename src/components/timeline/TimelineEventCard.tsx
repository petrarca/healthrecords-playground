import React from 'react';
import { MedicalRecord } from '../../types/types';
import { TimelineIcon } from './TimelineIcon';

interface TimelineEventCardProps {
  record: MedicalRecord;
  isSelected: boolean;
  onClick: () => void;
}

export const TimelineEventCard: React.FC<TimelineEventCardProps> = ({
  record,
  isSelected,
  onClick
}) => {
  return (
    <div
      id={`record-${record.recordId}`}
      onClick={onClick}
      className={`
        relative flex items-start gap-3 px-3 py-2.5 cursor-pointer
        transition-colors duration-150
        ${isSelected ? 'bg-blue-50 border-none' : 'hover:bg-gray-50'}
      `}
      tabIndex={0}
      role="button"
      aria-selected={isSelected}
    >
      {/* Timeline line */}
      <div className="absolute left-[1.65rem] top-0 bottom-0 w-px bg-gray-200"></div>
      
      <div className="relative">
        <TimelineIcon type={record.type} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-gray-900">
            {record.title}
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-700 line-clamp-2">
          {record.description}
        </p>
        {record.details?.provider && (
          <p className="mt-1.5 text-xs text-gray-500">
            Provider: {record.details.provider}
          </p>
        )}
      </div>
    </div>
  );
};
