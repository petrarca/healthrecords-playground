import React from 'react';
import { MedicalRecordType } from '../../types/types';
import { FilterButton } from './FilterButton';

interface TimelineFiltersProps {
  activeFilters: Set<MedicalRecordType>;
  recordCounts: Record<MedicalRecordType, number>;
  onToggleFilter: (type: MedicalRecordType) => void;
  onToggleAllFilters: () => void;
  allSelected: boolean;
}

export const TimelineFilters: React.FC<TimelineFiltersProps> = ({
  activeFilters,
  recordCounts,
  onToggleFilter,
  onToggleAllFilters,
  allSelected
}) => {
  const allTypes = [
    MedicalRecordType.DIAGNOSIS,
    MedicalRecordType.LAB_RESULT,
    MedicalRecordType.COMPLAINT,
    MedicalRecordType.VITAL_SIGNS,
    MedicalRecordType.MEDICATION,
    MedicalRecordType.PROCEDURE
  ] as const;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleAllFilters}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          {allSelected ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </button>
        <div className="flex flex-wrap gap-2">
          {allTypes.map(type => (
            <FilterButton
              key={type}
              type={type}
              active={activeFilters.has(type)}
              onClick={() => onToggleFilter(type)}
              count={recordCounts[type] || 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
