import React from 'react';
import { MedicalRecord, QuantityValue } from '../../types/medicalRecord';
import { TimelineIcon } from './TimelineIcon';

interface TimelineEventCardProps {
  record: MedicalRecord;
  isSelected: boolean;
  onClick: () => void;
}

// Helper function to safely render a value that might be a complex type
const renderValue = (value: string | number | QuantityValue): React.ReactNode => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  if (value && typeof value === 'object' && 'value' in value) {
    return `${value.value}${value.unit ? ' ' + value.unit : ''}`;
  }
  return String(value);
};

export const TimelineEventCard: React.FC<TimelineEventCardProps> = ({
  record,
  isSelected,
  onClick
}) => {
  return (
    <button
      id={`record-${record.recordId}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      className={`
        relative flex items-start gap-3 px-3 py-2.5 w-full text-left
        transition-colors duration-150
        ${isSelected ? 'bg-blue-50 border-none' : 'hover:bg-gray-50'}
      `}
      aria-pressed={isSelected}
      aria-label={`${record.title} - ${record.recordType}`}
    >
      {/* Timeline line */}
      <div className="absolute left-[1.65rem] top-0 bottom-0 w-px bg-gray-200" aria-hidden="true"></div>
      
      <div className="relative">
        <TimelineIcon type={record.recordType} />
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
            Provider: {renderValue(record.details.provider)}
          </p>
        )}
      </div>
    </button>
  );
};
