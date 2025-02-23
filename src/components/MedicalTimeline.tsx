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

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const allTypes = ['diagnosis', 'lab_result', 'complaint', 'vital_signs'] as const;
  const allSelected = useMemo(() => 
    allTypes.every(type => activeFilters.has(type)), 
    [activeFilters]
  );

  const toggleAllFilters = () => {
    if (allSelected) {
      // If all are selected, deselect all
      setActiveFilters(new Set());
    } else {
      // If not all are selected, select all
      setActiveFilters(new Set(allTypes));
    }
    setSelectedDate(null);
    if (timelineRef.current) {
      timelineRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
    // Select the first record for this date
    if (groupedByDate[date] && groupedByDate[date].length > 0) {
      setSelectedRecord(groupedByDate[date][0]);
    }
    
    // Use requestAnimationFrame to ensure the DOM has updated
    requestAnimationFrame(() => {
      const element = document.getElementById(`date-${date}`);
      const container = timelineRef.current;
      if (element && container) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
        
        container.scrollTo({
          top: relativeTop - 16,
          behavior: 'smooth'
        });
      }
    });
  }, [groupedByDate]);

  useEffect(() => {
    if (selectedRecord) {
      const dateStr = selectedRecord.date.toISOString().split('T')[0];
      setSelectedDate(dateStr);
    }
  }, [selectedRecord]);

  // Get all visible records in chronological order
  const allVisibleRecords = useMemo(() => {
    return sortedDates.flatMap(date => groupedByDate[date]);
  }, [sortedDates, groupedByDate]);

  // Get dates grouped by year and month for navigation
  const datesByMonth = useMemo(() => {
    const months: { date: string; records: MedicalRecord[] }[] = [];
    
    // Group records by month
    sortedDates.forEach(date => {
      const monthStart = date.substring(0, 7); // YYYY-MM format
      const existingMonth = months.find(m => m.date.startsWith(monthStart));
      
      if (existingMonth) {
        existingMonth.records.push(...groupedByDate[date]);
      } else {
        months.push({
          date: date,
          records: [...groupedByDate[date]]
        });
      }
    });
    
    return months;
  }, [sortedDates, groupedByDate]);

  // Get unique months and years for quick navigation
  const quickNavDates = useMemo(() => {
    const dates = new Set<string>();
    sortedDates.forEach(date => {
      dates.add(date.substring(0, 7)); // YYYY-MM
    });
    return Array.from(dates).sort((a, b) => b.localeCompare(a)); // Sort descending
  }, [sortedDates]);

  // Get the currently selected month for highlighting in quick nav
  const selectedMonth = useMemo(() => {
    if (!selectedDate) return null;
    return selectedDate.substring(0, 7); // YYYY-MM
  }, [selectedDate]);

  // Group quick nav dates by year
  const quickNavByYear = useMemo(() => {
    const years = new Map<string, string[]>();
    quickNavDates.forEach(date => {
      const year = date.substring(0, 4);
      const existing = years.get(year) || [];
      existing.push(date);
      years.set(year, existing);
    });
    return years;
  }, [quickNavDates]);

  // Get records and types by month for quick navigation
  const recordsByMonth = useMemo(() => {
    const months = new Map<string, {
      count: number;
      types: Map<MedicalRecord['type'], number>;
    }>();
    
    allVisibleRecords.forEach(record => {
      const month = record.date.toISOString().substring(0, 7);
      const monthData = months.get(month) || { count: 0, types: new Map() };
      monthData.count++;
      monthData.types.set(record.type, (monthData.types.get(record.type) || 0) + 1);
      months.set(month, monthData);
    });
    
    return months;
  }, [allVisibleRecords]);

  // Scroll the quick navigator to keep the selected month in view
  useEffect(() => {
    if (selectedMonth) {
      const element = document.getElementById(`quick-nav-${selectedMonth}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedMonth]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedRecord || !allVisibleRecords.length) return;

      const currentIndex = allVisibleRecords.findIndex(record => record.id === selectedRecord.id);
      if (currentIndex === -1) return;

      // Get current record's month
      const currentDate = selectedRecord.date.toISOString().split('T')[0];
      const currentMonthIndex = datesByMonth.findIndex(m => 
        m.date.substring(0, 7) === currentDate.substring(0, 7)
      );

      if (e.metaKey || e.ctrlKey) { // Cmd/Ctrl key is pressed
        e.preventDefault();
        let targetMonth: { date: string; records: MedicalRecord[] } | undefined;

        switch (e.key) {
          case 'ArrowUp':
            // Move to previous month
            if (currentMonthIndex > 0) {
              targetMonth = datesByMonth[currentMonthIndex - 1];
            }
            break;
          case 'ArrowDown':
            // Move to next month
            if (currentMonthIndex < datesByMonth.length - 1) {
              targetMonth = datesByMonth[currentMonthIndex + 1];
            }
            break;
        }

        if (targetMonth) {
          // Select the first record of the target month
          const firstRecord = targetMonth.records[0];
          setSelectedRecord(firstRecord);
          const targetDate = firstRecord.date.toISOString().split('T')[0];
          setSelectedDate(targetDate);
          
          // Scroll the record into view
          const element = document.getElementById(`record-${firstRecord.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      } else {
        // Regular arrow key navigation
        let nextIndex: number;
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            nextIndex = currentIndex - 1;
            if (nextIndex >= 0) {
              const nextRecord = allVisibleRecords[nextIndex];
              setSelectedRecord(nextRecord);
              const nextDate = nextRecord.date.toISOString().split('T')[0];
              setSelectedDate(nextDate);
              const element = document.getElementById(`record-${nextRecord.id}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            nextIndex = currentIndex + 1;
            if (nextIndex < allVisibleRecords.length) {
              const nextRecord = allVisibleRecords[nextIndex];
              setSelectedRecord(nextRecord);
              const nextDate = nextRecord.date.toISOString().split('T')[0];
              setSelectedDate(nextDate);
              const element = document.getElementById(`record-${nextRecord.id}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRecord, allVisibleRecords, datesByMonth]);

  // Get records grouped by exact date (including time) and type
  const recordsByDateAndType = useMemo(() => {
    const dateMap = new Map<string, Map<MedicalRecord['type'], MedicalRecord[]>>();
    
    allVisibleRecords.forEach(record => {
      const dateKey = record.date.toISOString().split('T')[0];
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, new Map());
      }
      const typeMap = dateMap.get(dateKey)!;
      if (!typeMap.has(record.type)) {
        typeMap.set(record.type, []);
      }
      typeMap.get(record.type)!.push(record);
    });
    
    return dateMap;
  }, [allVisibleRecords]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-none bg-white border-b border-gray-200">
        <div className="px-5 py-4">
          <div className="flex justify-between items-center mb-3.5">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {Object.keys(groupedByDate).length} dates • {
                Object.values(groupedByDate).reduce((sum, records) => sum + records.length, 0)
              } events
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleAllFilters}
              className={`
                px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-2
                ${allSelected ? 
                  'bg-blue-50 text-blue-700 hover:bg-blue-100' : 
                  'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <svg className={`w-4 h-4 ${allSelected ? 'text-blue-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {allSelected ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-7 7-7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                )}
              </svg>
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
            <div className="h-5 w-px bg-gray-200 mx-1"></div>
            {allTypes.map(type => (
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
        {/* Quick Navigation Panel */}
        <div className="w-64 flex-none overflow-y-auto border-l border-gray-200 bg-gray-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Quick Navigation
            </div>
          </div>
          <div className="p-4">
            {Array.from(quickNavByYear.entries()).map(([year, months]) => (
              <div key={year} className="mb-4">
                <div className="text-sm font-medium text-gray-900 mb-2">{year}</div>
                <div className="space-y-1">
                  {months.map(month => {
                    const [yearStr, monthStr] = month.split('-');
                    const monthName = new Date(parseInt(yearStr), parseInt(monthStr) - 1).toLocaleString('default', { month: 'long' });
                    const isSelected = month === selectedMonth;
                    
                    return (
                      <button
                        key={month}
                        id={`quick-nav-${month}`}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm
                          transition-colors duration-150
                          ${isSelected ? 
                            'bg-blue-100 text-blue-900 font-medium' : 
                            'text-gray-600 hover:bg-gray-100'
                          }
                        `}
                        onClick={() => {
                          // Find first record for this month
                          const firstRecord = allVisibleRecords.find(record => 
                            record.date.toISOString().startsWith(month)
                          );
                          if (firstRecord) {
                            setSelectedRecord(firstRecord);
                            setSelectedDate(firstRecord.date.toISOString().split('T')[0]);
                            const element = document.getElementById(`record-${firstRecord.id}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{monthName}</span>
                          <div className="flex items-center gap-1">
                            {/* Show type indicators */}
                            {recordsByMonth.get(month) && (
                              <div className="flex items-center gap-1.5">
                                <div className="flex -space-x-1">
                                  {Array.from(recordsByMonth.get(month)!.types.entries())
                                    .sort((a, b) => b[1] - a[1]) // Sort by count
                                    .map(([type, count]) => (
                                      <div
                                        key={type}
                                        className="relative flex items-center justify-center w-4 h-4 rounded-full ring-1 ring-white"
                                        style={{
                                          backgroundColor: type === 'diagnosis' ? '#E53E3E' :
                                            type === 'lab_result' ? '#3182CE' :
                                            type === 'complaint' ? '#D69E2E' :
                                            '#38A169'
                                        }}
                                      >
                                        <span className="text-[8px] font-medium text-white">
                                          {count}
                                        </span>
                                      </div>
                                    ))
                                  }
                                </div>
                                <span className="text-xs text-gray-500">
                                  {recordsByMonth.get(month)!.count}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div 
          ref={timelineRef}
          className="flex-1 overflow-y-auto border-r border-gray-200 bg-gray-50 relative"
        >
          <div className="p-4 space-y-4">
            {sortedDates.map((date, dateIndex) => (
              <div 
                key={date}
                id={`date-${date}`}
                className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Date header */}
                <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {/* Events */}
                <div className="divide-y divide-gray-100">
                  {groupedByDate[date].map((record, index) => {
                    const recordDate = record.date.toISOString().split('T')[0];
                    const typesForDay = recordsByDateAndType.get(recordDate);
                    const hasMultipleTypes = typesForDay && typesForDay.size > 1;
                    const isFirstOfDay = index === 0 || 
                      groupedByDate[date][index - 1].date.toISOString().split('T')[0] !== recordDate;
                    
                    return (
                      <div
                        key={record.id}
                        id={`record-${record.id}`}
                        className={`
                          relative flex gap-3 px-4 py-3 cursor-pointer
                          transition-all duration-150
                          hover:bg-gray-50
                          ${selectedRecord?.id === record.id ? 'bg-blue-50/50 ring-1 ring-blue-200' : ''}
                        `}
                        onClick={() => setSelectedRecord(record)}
                        tabIndex={0}
                        role="button"
                        aria-selected={selectedRecord?.id === record.id}
                      >
                        <div className="relative">
                          <TimelineIcon type={record.type} />
                          {hasMultipleTypes && isFirstOfDay && (
                            <div className="absolute -right-1 -top-1 flex -space-x-1">
                              {Array.from(typesForDay!.keys())
                                .filter(type => type !== record.type)
                                .map(type => (
                                  <div
                                    key={type}
                                    className="w-2 h-2 rounded-full ring-1 ring-white"
                                    style={{
                                      backgroundColor: type === 'diagnosis' ? '#E53E3E' :
                                        type === 'lab_result' ? '#3182CE' :
                                        type === 'complaint' ? '#D69E2E' :
                                        '#38A169'
                                    }}
                                  />
                                ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-sm mb-0.5">
                            <div className="font-medium text-gray-900">
                              {record.title}
                              {hasMultipleTypes && isFirstOfDay && (
                                <span className="ml-2 text-xs font-normal text-gray-500">
                                  +{typesForDay!.size - 1} other type{typesForDay!.size > 2 ? 's' : ''} today
                                </span>
                              )}
                            </div>
                            <div className="text-gray-500">
                              {new Date(record.date).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {record.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
              <div className="px-4 py-3.5 bg-white border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <TimelineIcon type={selectedRecord.type} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {selectedRecord.title}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize whitespace-nowrap">
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 px-4 py-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</h4>
                  </div>
                  <p className="text-sm text-gray-900">
                    {selectedRecord.description}
                  </p>
                </div>

                {selectedRecord.details && (
                  <div className="bg-white rounded-lg border border-gray-200 px-4 py-3.5">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Details</h4>
                    </div>
                    <dl className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedRecord.details).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-md p-2.5">
                          <dt className="text-xs font-medium text-gray-500">{key}</dt>
                          <dd className="text-sm font-medium text-gray-900 mt-0.5">{value}</dd>
                        </div>
                      ))}
                    </dl>
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
