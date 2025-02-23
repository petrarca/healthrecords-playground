import React, { useState, useMemo } from 'react';
import { MedicalRecord } from '../services/mockData';

interface FilterButtonProps {
  type: string;
  active: boolean;
  onClick: () => void;
  count: number;
}

function FilterButton({ type, active, onClick, count }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150
        ${active ? getTypeColor(type) : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}
      `}
    >
      <span className="flex items-center justify-center w-5 h-5">
        {getTypeIcon(type)}
      </span>
      <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
      <span className={`
        ml-1 text-xs px-2 py-0.5 rounded-full
        ${active ? 'bg-white bg-opacity-20' : 'bg-gray-200'}
      `}>
        {count}
      </span>
    </button>
  );
}

interface MedicalTimelineProps {
  records: MedicalRecord[];
}

export function MedicalTimeline({ records }: MedicalTimelineProps) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(['Consultation', 'Lab Test', 'Procedure', 'Vaccination'])
  );

  // Group records by month and year
  const groupedRecords = useMemo(() => {
    const filtered = records.filter(record => activeFilters.has(record.type));
    const groups = filtered.reduce((acc, record) => {
      const date = new Date(record.date);
      const key = date.toLocaleString('default', { year: 'numeric', month: 'long' });
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(record);
      return acc;
    }, {} as Record<string, MedicalRecord[]>);

    // Sort records within each group
    Object.values(groups).forEach(group => {
      group.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    return groups;
  }, [records, activeFilters]);

  // Count records by type
  const recordCounts = useMemo(() => {
    return records.reduce((counts, record) => {
      counts[record.type] = (counts[record.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }, [records]);

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Filter by Type</h3>
          <button
            onClick={() => setActiveFilters(new Set(['Consultation', 'Lab Test', 'Procedure', 'Vaccination']))}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Reset Filters
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(recordCounts).map(type => (
            <FilterButton
              key={type}
              type={type}
              active={activeFilters.has(type)}
              onClick={() => toggleFilter(type)}
              count={recordCounts[type]}
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedRecords).map(([monthYear, monthRecords]) => (
          <div key={monthYear} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 sticky top-0 bg-white py-2">
              {monthYear}
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {monthRecords.map((record, recordIdx) => (
                  <li key={record.id}>
                    <div className="relative pb-8">
                      {recordIdx !== monthRecords.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`
                            h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                            ${getTypeColor(record.type)}
                          `}>
                            {getTypeIcon(record.type)}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-gray-900">
                                {record.title}
                              </h3>
                              <span className={`
                                text-xs px-2 py-0.5 rounded-full
                                ${getTypeBadgeColor(record.type)}
                              `}>
                                {record.type}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {record.description}
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                              Provider: {record.provider}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={record.date}>
                              {new Date(record.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {Object.keys(groupedRecords).length === 0 && (
          <div className="text-center py-6 text-gray-500 bg-white rounded-lg border border-gray-200">
            No medical records found for the selected filters
          </div>
        )}
      </div>
    </div>
  );
}

function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'consultation':
      return 'bg-blue-500 text-white';
    case 'lab test':
      return 'bg-purple-500 text-white';
    case 'procedure':
      return 'bg-green-500 text-white';
    case 'vaccination':
      return 'bg-yellow-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

function getTypeBadgeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'consultation':
      return 'bg-blue-100 text-blue-800';
    case 'lab test':
      return 'bg-purple-100 text-purple-800';
    case 'procedure':
      return 'bg-green-100 text-green-800';
    case 'vaccination':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getTypeIcon(type: string): JSX.Element {
  switch (type.toLowerCase()) {
    case 'consultation':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    case 'lab test':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case 'procedure':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
        </svg>
      );
    case 'vaccination':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      );
    default:
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}
