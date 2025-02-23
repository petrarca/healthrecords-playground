import React, { useState, useMemo, useRef } from 'react';

export interface MedicalRecord {
  id: string;
  date: Date;
  type: 'diagnosis' | 'lab_result' | 'complaint' | 'vital_signs';
  title: string;
  description: string;
  details?: Record<string, string | number>;
}

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

  const scrollToDate = (date: string) => {
    const element = document.getElementById(`date-${date}`);
    if (element && timelineRef.current) {
      setSelectedDate(date);
      timelineRef.current.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  // Group dates by month and year
  const datesByMonth = useMemo(() => {
    return sortedDates.reduce((groups, date) => {
      const monthYear = new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long'
      });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(date);
      return groups;
    }, {} as Record<string, string[]>);
  }, [sortedDates]);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Medical Timeline</h2>
          <div className="text-sm text-gray-500">
            {Object.keys(groupedByDate).length} dates • {
              Object.values(groupedByDate).reduce((sum, records) => sum + records.length, 0)
            } events
          </div>
        </div>
        <div className="flex gap-2">
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

      <div className="flex h-[600px]">
        {/* Date Selector */}
        <div className="w-1/6 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Quick Navigation</h3>
            <p className="text-xs text-gray-500 mt-1">Select a date to view events</p>
          </div>
          <div className="overflow-y-auto h-[calc(600px-65px)]">
            <div className="space-y-1 p-2">
              {Object.entries(datesByMonth).map(([monthYear, dates]) => (
                <div key={monthYear} className="mb-4">
                  <div className="px-3 mb-2">
                    <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      {monthYear}
                    </h4>
                  </div>
                  <div>
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
                            w-full flex items-center gap-2 px-3 py-2 rounded-md
                            transition-all duration-150 group
                            ${selectedDate === date ? 
                              'bg-blue-50 hover:bg-blue-100' : 
                              'hover:bg-gray-50'
                            }
                          `}
                        >
                          <div className={`
                            w-8 h-8 rounded-lg flex items-center justify-center
                            ${selectedDate === date ?
                              'bg-blue-100 text-blue-700' :
                              'bg-gray-50 text-gray-700'
                            }
                          `}>
                            <div className="text-center">
                              <div className="text-xs font-medium">
                                {new Date(date).toLocaleDateString(undefined, {
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-[10px] uppercase">
                                {new Date(date).toLocaleDateString(undefined, {
                                  weekday: 'short'
                                })}
                              </div>
                            </div>
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
                                  'text-blue-700 font-medium' :
                                  'text-gray-600'
                                }
                              `}>
                                {eventCount} {eventCount === 1 ? 'event' : 'events'}
                              </span>
                            </div>
                          </div>
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-opacity
                            ${selectedDate === date ?
                              'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }
                          `}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div 
          ref={timelineRef}
          className="w-1/2 overflow-y-auto border-r border-gray-200 bg-gray-50"
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
        <div className="w-1/3 bg-gray-50">
          {selectedRecord ? (
            <div className="h-full flex flex-col">
              {/* Details Header */}
              <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <TimelineIcon type={selectedRecord.type} />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedRecord.title}
                    </h3>
                    <time className="text-sm text-gray-500">
                      {selectedRecord.date.toLocaleString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                </div>
              </div>

              {/* Details Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedRecord.description}
                  </p>
                </div>

                {selectedRecord.details && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedRecord.details).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-md p-3">
                          <dt className="text-xs font-medium text-gray-500 mb-1">{key}</dt>
                          <dd className="text-sm font-medium text-gray-900">{value}</dd>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Metadata</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Event Type:</span>
                      <span className="ml-2 font-medium text-gray-900 capitalize">
                        {selectedRecord.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Record ID:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedRecord.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              Select an event to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
