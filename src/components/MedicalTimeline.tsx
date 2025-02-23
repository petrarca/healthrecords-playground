import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { MedicalRecord } from '../types/types';

interface TimelineIconProps {
  type: MedicalRecord['type'];
  size?: 'sm' | 'md';
}

const TimelineIcon: React.FC<TimelineIconProps> = ({ type, size = 'md' }) => {
  const iconClasses = size === 'sm' ? 
    "w-5 h-5 rounded-md flex items-center justify-center text-white" :
    "w-8 h-8 rounded-md flex items-center justify-center text-white";
  
  const icons = {
    diagnosis: <div className={`${iconClasses} bg-[#E53E3E]`}>
      <svg className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>,
    lab_result: <div className={`${iconClasses} bg-[#3182CE]`}>
      <svg className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    </div>,
    complaint: <div className={`${iconClasses} bg-[#D69E2E]`}>
      <svg className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>,
    vital_signs: <div className={`${iconClasses} bg-[#38A169]`}>
      <svg className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>,
  };

  return icons[type];
};

interface FilterButtonProps {
  type: MedicalRecord['type'];
  active: boolean;
  onClick: () => void;
  count: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({ type, active, onClick, count }) => {
  const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150";
  const activeClasses = {
    diagnosis: "bg-red-50 text-red-700",
    lab_result: "bg-blue-50 text-blue-700",
    complaint: "bg-yellow-50 text-yellow-700",
    vital_signs: "bg-green-50 text-green-700"
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

interface MedicalTimelineProps {
  records: MedicalRecord[];
}

const getEventTypeName = (type: MedicalRecord['type']): string => {
  const names = {
    diagnosis: 'Assessment',
    lab_result: 'Laboratory Results',
    complaint: 'Patient Complaint',
    vital_signs: 'Vital Signs'
  };
  return names[type];
};

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({ records }) => {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<MedicalRecord['type']>>(
    new Set(['diagnosis', 'lab_result', 'complaint', 'vital_signs'])
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    // Initialize with the most recent year
    return Math.max(...Object.keys(records.reduce((groups, record) => {
      const date = record.date.toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    }, {} as Record<string, MedicalRecord[]>)).map(date => new Date(date).getFullYear()));
  });
  const timelineRef = useRef<HTMLDivElement>(null);

  // Count records by type
  const recordCounts = useMemo(() => {
    return records.reduce((counts, record) => {
      counts[record.type] = (counts[record.type] || 0) + 1;
      return counts;
    }, {} as Record<MedicalRecord['type'], number>);
  }, [records]);

  // Filter and group records by date
  const groupedByDate = useMemo(() => {
    const filtered = records.filter(record => activeFilters.has(record.type));
    return filtered.reduce((groups, record) => {
      const date = record.date.toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    }, {} as Record<string, MedicalRecord[]>);
  }, [records, activeFilters]);

  // Group dates by year and month
  const datesByYearAndMonth = useMemo(() => {
    const years: Record<number, Record<string, string[]>> = {};
    
    Object.keys(groupedByDate).forEach(date => {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = dateObj.toLocaleDateString(undefined, { month: 'long' });
      const monthYear = `${month} ${year}`;
      
      if (!years[year]) {
        years[year] = {};
      }
      if (!years[year][monthYear]) {
        years[year][monthYear] = [];
      }
      years[year][monthYear].push(date);
    });

    return years;
  }, [groupedByDate]);

  const years = useMemo(() => {
    return Object.keys(datesByYearAndMonth)
      .map(Number)
      .sort((a, b) => b - a); // Sort years in descending order
  }, [datesByYearAndMonth]);

  const sortedDates = Object.keys(groupedByDate).sort();

  const toggleFilter = (type: MedicalRecord['type']) => {
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

  const scrollToDate = useCallback((date: string) => {
    setSelectedDate(date);
    const element = document.getElementById(`date-${date}`);
    if (element && timelineRef.current) {
      timelineRef.current.scrollTo({
        top: element.offsetTop - 16,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    if (selectedRecord) {
      const dateStr = selectedRecord.date.toISOString().split('T')[0];
      setSelectedDate(dateStr);
    }
  }, [selectedRecord]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-none bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              {Object.keys(groupedByDate).length} dates • {
                Object.values(groupedByDate).reduce((sum, records) => sum + records.length, 0)
              } events
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveFilters(new Set(['diagnosis', 'lab_result', 'complaint', 'vital_signs']));
                setSelectedDate(null);
                if (timelineRef.current) {
                  timelineRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors duration-150 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Show All
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            {(['diagnosis', 'lab_result', 'complaint', 'vital_signs'] as const).map(type => (
              <FilterButton
                key={type}
                type={type}
                active={activeFilters.has(type)}
                onClick={() => toggleFilter(type)}
                count={recordCounts[type] || 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main container */}
      <div className="flex flex-1 min-h-0">
        {/* Date Selector */}
        <div className="w-48 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Quick Navigation</h3>
          </div>
          <div className="overflow-y-auto h-[calc(100%-65px)]">
            <div className="relative p-2">
              {/* Vertical timeline line */}
              <div className="absolute left-6 top-4 bottom-4 w-px bg-gray-200" />

              {years.map(year => (
                <div key={year} className="relative">
                  {/* Year button with circle */}
                  <button
                    onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                    className={`
                      relative z-10 flex items-center w-full px-2 py-2 group
                      ${selectedYear === year ? 
                        'mb-2' : ''
                      }
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center
                      transition-colors duration-150
                      ${selectedYear === year ? 
                        'bg-blue-500 text-white ring-4 ring-blue-50' : 
                        'bg-white border-2 border-gray-300 group-hover:border-gray-400'
                      }
                    `}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                    </div>
                    <span className={`
                      ml-3 text-sm
                      ${selectedYear === year ?
                        'font-medium text-blue-600' :
                        'text-gray-600 group-hover:text-gray-900'
                      }
                    `}>
                      {year}
                    </span>
                    <div className="ml-auto flex items-center">
                      <span className="text-xs text-gray-500">
                        {Object.values(datesByYearAndMonth[year] || {})
                          .reduce((sum, dates) => sum + dates.length, 0)} dates
                      </span>
                      {selectedYear === year ? (
                        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Expandable dates for selected year */}
                  {selectedYear === year && datesByYearAndMonth[year] && (
                    <div className="ml-8 mb-4">
                      {Object.entries(datesByYearAndMonth[year]).map(([monthYear, dates]) => (
                        <div key={monthYear} className="mb-3">
                          <div className="px-3 mb-1">
                            <h4 className="text-xs font-semibold text-gray-900">
                              {monthYear.split(' ')[0]} {/* Show only month name */}
                            </h4>
                          </div>
                          <div className="space-y-1">
                            {dates.map(date => {
                              const eventCount = groupedByDate[date].length;
                              const hasMultipleTypes = new Set(
                                groupedByDate[date].map(record => record.type)
                              ).size > 1;
                              
                              return (
                                <button
                                  key={date}
                                  onClick={() => scrollToDate(date)}
                                  className={`
                                    w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left
                                    transition-all duration-150
                                    ${selectedDate === date ? 
                                      'bg-blue-50 hover:bg-blue-100' : 
                                      'hover:bg-gray-50'
                                    }
                                  `}
                                >
                                  <div className={`
                                    text-sm font-medium
                                    ${selectedDate === date ?
                                      'text-blue-700' :
                                      'text-gray-700'
                                    }
                                  `}>
                                    {new Date(date).getDate()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1">
                                      {hasMultipleTypes && (
                                        <div className="flex -space-x-1">
                                          {Array.from(new Set(groupedByDate[date].map(record => record.type)))
                                            .slice(0, 3)
                                            .map(type => (
                                              <div key={type} className="w-2 h-2 rounded-full ring-1 ring-white"
                                                style={{
                                                  backgroundColor: type === 'diagnosis' ? '#E53E3E' :
                                                    type === 'lab_result' ? '#3182CE' :
                                                    type === 'complaint' ? '#D69E2E' :
                                                    '#38A169'
                                                }}
                                              />
                                            ))
                                          }
                                        </div>
                                      )}
                                      <span className={`
                                        text-xs truncate
                                        ${selectedDate === date ?
                                          'text-blue-700' :
                                          'text-gray-600'
                                        }
                                      `}>
                                        {eventCount} {eventCount === 1 ? 'event' : 'events'}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div 
          ref={timelineRef}
          className="flex-1 overflow-y-auto border-r border-gray-200 bg-gray-50"
        >
          <div className="p-4 space-y-6">
            {sortedDates.map((date, dateIndex) => (
              <div 
                key={date}
                id={`date-${date}`}
                className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Date header */}
                <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                {/* Events */}
                <div className="p-4 space-y-3">
                  {groupedByDate[date].map((record) => (
                    <div
                      key={record.id}
                      className={`
                        relative flex gap-4 p-3 rounded-lg cursor-pointer
                        transition-all duration-150
                        hover:bg-gray-50
                        ${selectedRecord?.id === record.id ? 'bg-gray-50 ring-1 ring-gray-200' : ''}
                      `}
                      onClick={() => setSelectedRecord(record)}
                    >
                      <TimelineIcon type={record.type} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {record.title}
                          </h3>
                          <time className="text-xs text-gray-500">
                            {record.date.toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </time>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {record.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        <div className="w-96 bg-gray-50">
          {selectedRecord ? (
            <div className="h-full flex flex-col">
              {/* Details Header */}
              <div className="p-3 bg-white border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <TimelineIcon type={selectedRecord.type} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {selectedRecord.title}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                        {selectedRecord.type.replace('_', ' ')}
                      </span>
                    </div>
                    <time className="text-xs text-gray-500">
                      {selectedRecord.date.toLocaleString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                </div>
              </div>

              {/* Details Content */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                <div className="bg-white rounded-md border border-gray-200 p-2">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</h4>
                  <p className="text-sm text-gray-900">
                    {selectedRecord.description}
                  </p>
                </div>

                {selectedRecord.details && (
                  <div className="bg-white rounded-md border border-gray-200 p-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Details</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedRecord.details).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded p-1.5">
                          <dt className="text-xs font-medium text-gray-500">{key}</dt>
                          <dd className="text-sm font-medium text-gray-900">{value}</dd>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              Select a record to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
