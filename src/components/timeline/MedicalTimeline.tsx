import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { MedicalRecord, MedicalRecordType } from '../../types/types';
import { TimelineFilters } from './TimelineFilters';
import { TimelineYearSelector } from './TimelineYearSelector';
import { TimelineList } from './TimelineList';
import { TimelineEventDetails } from './TimelineEventDetails';
import { useUpdateMedicalRecord } from '../../hooks/useMedicalRecords';
import { useParams, useNavigate } from 'react-router-dom';

interface MedicalTimelineProps {
  records: MedicalRecord[];
  selectedRecordId?: string;
  onRecordSelect?: (recordId: string) => void;
}

// Helper functions
const getInitialYear = (records: MedicalRecord[]): number => {
  if (!records.length) return new Date().getFullYear();
  
  const recordGroups = records.reduce((groups, record) => {
    const date = record.date.toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, MedicalRecord[]>);
  
  return Math.max(...Object.keys(recordGroups).map(date => new Date(date).getFullYear()));
};

const getRecordCountsByType = (records: MedicalRecord[]): Record<MedicalRecordType, number> => {
  return records.reduce((counts, record) => {
    counts[record.type] = (counts[record.type] ?? 0) + 1;
    return counts;
  }, {} as Record<MedicalRecordType, number>);
};

const groupRecordsByDate = (records: MedicalRecord[], activeFilters: Set<MedicalRecordType>): Record<string, MedicalRecord[]> => {
  const filtered = records.filter(record => activeFilters.has(record.type));
  const sortedRecords = [...filtered].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return sortedRecords.reduce((groups, record) => {
    const date = record.date.toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, MedicalRecord[]>);
};

const groupDatesByYearAndMonth = (groupedByDate: Record<string, MedicalRecord[]>): Record<number, Record<string, string[]>> => {
  const years: Record<number, Record<string, string[]>> = {};
  const dates = Object.keys(groupedByDate);

  const addDateToYearMonth = (date: string) => {
    const [year, month] = date.split('-');
    const yearNum = parseInt(year);
    const monthYear = `${month}-${year}`;

    if (!years[yearNum]) {
      years[yearNum] = {};
    }
    if (!years[yearNum][monthYear]) {
      years[yearNum][monthYear] = [];
    }
    years[yearNum][monthYear].push(date);
  };

  // Process all dates
  dates.forEach(addDateToYearMonth);

  // Sort dates within each month
  Object.values(years).forEach(yearData => {
    Object.values(yearData).forEach(dates => {
      dates.sort((a, b) => b.localeCompare(a));
    });
  });

  return years;
};

const getRecordsByMonth = (records: MedicalRecord[]): Map<string, { count: number; types: Map<MedicalRecordType, number> }> => {
  return records.reduce((months, record) => {
    const month = record.date.toISOString().substring(0, 7); // YYYY-MM
    const monthData = months.get(month) ?? { count: 0, types: new Map() };
    monthData.count++;
    monthData.types.set(record.type, (monthData.types.get(record.type) ?? 0) + 1);
    months.set(month, monthData);
    return months;
  }, new Map());
};

const getAllVisibleRecords = (groupedByDate: Record<string, MedicalRecord[]>): MedicalRecord[] => {
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));
  return sortedDates.flatMap(date => groupedByDate[date]);
};

const getDatesByMonth = (groupedByDate: Record<string, MedicalRecord[]>): { date: string; records: MedicalRecord[] }[] => {
  const months: { date: string; records: MedicalRecord[] }[] = [];
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));
  
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
};

// Navigation utility functions
const scrollRecordIntoView = (recordId: string) => {
  const element = document.getElementById(`record-${recordId}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

const getCurrentMonthIndex = (datesByMonth: Array<{ date: string }>, currentDate: string): number => {
  return datesByMonth.findIndex(m => 
    m.date.substring(0, 7) === currentDate.substring(0, 7)
  );
};

const handleMonthNavigation = (
  direction: 'prev' | 'next',
  currentMonthIndex: number,
  datesByMonth: Array<{ date: string; records: MedicalRecord[] }>,
  onSelect: (record: MedicalRecord) => void
): boolean => {
  let targetMonth: { date: string; records: MedicalRecord[] } | undefined;

  if (direction === 'prev' && currentMonthIndex > 0) {
    targetMonth = datesByMonth[currentMonthIndex - 1];
  } else if (direction === 'next' && currentMonthIndex < datesByMonth.length - 1) {
    targetMonth = datesByMonth[currentMonthIndex + 1];
  }

  if (targetMonth) {
    onSelect(targetMonth.records[0]);
    return true;
  }
  return false;
};

const handleRecordNavigation = (
  direction: 'prev' | 'next',
  currentIndex: number,
  allVisibleRecords: MedicalRecord[],
  onSelect: (record: MedicalRecord) => void
): boolean => {
  const nextIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
  const isValidIndex = direction === 'prev' 
    ? nextIndex >= 0 
    : nextIndex < allVisibleRecords.length;

  if (isValidIndex) {
    onSelect(allVisibleRecords[nextIndex]);
    return true;
  }
  return false;
};

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({ records, selectedRecordId, onRecordSelect }) => {
  console.log('MedicalTimeline rendered with records:', records);
  
  const { id: patientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<MedicalRecordType>>(
    new Set([
      MedicalRecordType.DIAGNOSIS,
      MedicalRecordType.LAB_RESULT,
      MedicalRecordType.COMPLAINT,
      MedicalRecordType.VITAL_SIGNS,
      MedicalRecordType.MEDICATION
    ])
  );
  
  console.log('Active filters:', Array.from(activeFilters));
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(() => getInitialYear(records));
  const timelineRef = useRef<HTMLDivElement>(null);

  // Memoized values
  const recordCounts = useMemo(() => getRecordCountsByType(records), [records]);
  const groupedByDate = useMemo(() => groupRecordsByDate(records, activeFilters), [records, activeFilters]);
  const datesByYearAndMonth = useMemo(() => groupDatesByYearAndMonth(groupedByDate), [groupedByDate]);
  const years = useMemo(() => Object.keys(datesByYearAndMonth).map(Number).sort((a, b) => b - a), [datesByYearAndMonth]);
  const recordsByMonth = useMemo(() => getRecordsByMonth(records), [records]);
  const allVisibleRecords = useMemo(() => getAllVisibleRecords(groupedByDate), [groupedByDate]);
  const datesByMonth = useMemo(() => getDatesByMonth(groupedByDate), [groupedByDate]);

  const selectedMonth = useMemo(() => {
    if (!selectedDate) return null;
    return selectedDate.substring(0, 7); // YYYY-MM
  }, [selectedDate]);

  const allTypes = useMemo(() => 
    [
      MedicalRecordType.DIAGNOSIS,
      MedicalRecordType.LAB_RESULT,
      MedicalRecordType.COMPLAINT,
      MedicalRecordType.VITAL_SIGNS,
      MedicalRecordType.MEDICATION
    ] as const,
    []
  );

  const allSelected = useMemo(() => 
    allTypes.every(type => activeFilters.has(type)), 
    [activeFilters, allTypes]
  );

  const toggleAllFilters = () => {
    if (allSelected) {
      setActiveFilters(new Set());
    } else {
      setActiveFilters(new Set(allTypes));
    }
    setSelectedDate(null);
    if (timelineRef.current) {
      timelineRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleFilter = (type: MedicalRecordType) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
    setSelectedDate(null);
    if (timelineRef.current) {
      timelineRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setSelectedDate(null);
    if (timelineRef.current) {
      timelineRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMonthSelect = (month: string) => {
    // Find first record for this month
    const firstRecord = records.find(record => 
      record.date.toISOString().startsWith(month)
    );
    if (firstRecord) {
      setSelectedRecord(firstRecord);
      setSelectedDate(firstRecord.date.toISOString().split('T')[0]);
      const element = document.getElementById(`record-${firstRecord.recordId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleRecordSelect = (record: MedicalRecord) => {
    setSelectedRecord(record);
    // Update URL when record is selected
    navigate(`/patients/${patientId}/timeline/${record.recordId}`, { replace: true });
    onRecordSelect?.(record.recordId);
  };

  const selectRecord = useCallback((record: MedicalRecord) => {
    setSelectedRecord(record);
    const date = record.date.toISOString().split('T')[0];
    setSelectedDate(date);
    scrollRecordIntoView(record.recordId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedRecord || !allVisibleRecords.length) return;

      const currentIndex = allVisibleRecords.findIndex(
        record => record.recordId === selectedRecord.recordId
      );
      if (currentIndex === -1) return;

      const currentDate = selectedRecord.date.toISOString().split('T')[0];
      const currentMonthIndex = getCurrentMonthIndex(datesByMonth, currentDate);

      if (e.metaKey || e.ctrlKey) {
        // Month-based navigation (Cmd/Ctrl + Arrow)
        let direction: 'prev' | 'next';
        
        switch (e.key) {
          case 'ArrowUp':
            direction = 'prev';
            e.preventDefault();
            handleMonthNavigation(direction, currentMonthIndex, datesByMonth, selectRecord);
            break;
          case 'ArrowDown':
            direction = 'next';
            e.preventDefault();
            handleMonthNavigation(direction, currentMonthIndex, datesByMonth, selectRecord);
            break;
        }
      } else {
        // Record-based navigation (Arrow keys)
        let direction: 'prev' | 'next';
        
        switch (e.key) {
          case 'ArrowUp':
            direction = 'prev';
            e.preventDefault();
            handleRecordNavigation(direction, currentIndex, allVisibleRecords, selectRecord);
            break;
          case 'ArrowDown':
            direction = 'next';
            e.preventDefault();
            handleRecordNavigation(direction, currentIndex, allVisibleRecords, selectRecord);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRecord, allVisibleRecords, datesByMonth, selectRecord]);

  // Update selected record if it changes in the records array
  useEffect(() => {
    if (selectedRecord) {
      const updatedRecord = records.find(r => r.recordId === selectedRecord.recordId);
      if (updatedRecord && JSON.stringify(updatedRecord) !== JSON.stringify(selectedRecord)) {
        setSelectedRecord(updatedRecord);
      }
    }
  }, [records, selectedRecord]);

  // Effect to handle selectedRecordId
  useEffect(() => {
    if (selectedRecordId) {
      const record = records.find(r => r.recordId === selectedRecordId);
      if (record) {
        setSelectedRecord(record);
        const recordDate = record.date.toISOString().split('T')[0];
        setSelectedDate(recordDate);
        setSelectedYear(new Date(recordDate).getFullYear());
      }
    }
  }, [selectedRecordId, records]);

  const updateRecord = useUpdateMedicalRecord();

  return (
    <div className="flex flex-col h-full">
      <div className="mb-3">
        <TimelineFilters
          activeFilters={activeFilters}
          recordCounts={recordCounts}
          onToggleFilter={toggleFilter}
          onToggleAllFilters={toggleAllFilters}
          allSelected={allSelected}
        />
      </div>
      
      <div className="flex h-[calc(100vh-300px)]">
        <div className="flex-[0.7] min-w-[250px]">
          <TimelineYearSelector
            years={years}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            recordsByMonth={recordsByMonth}
            selectedMonth={selectedMonth}
            onMonthSelect={handleMonthSelect}
          />
        </div>
        <div ref={timelineRef} className="flex-[2] flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 min-w-[400px] ml-4">
          <TimelineList
            groupedByDate={groupedByDate}
            datesByYearAndMonth={datesByYearAndMonth}
            selectedYear={selectedYear}
            selectedRecord={selectedRecord}
            selectedDate={selectedDate}
            onRecordSelect={handleRecordSelect}
          />
        </div>        
        <div className="flex-[1.5] min-w-[350px] ml-4">
          <TimelineEventDetails 
            record={selectedRecord || undefined}
            onUpdateRecord={async (updatedRecord) => {
              try {
                const result = await updateRecord.mutateAsync(updatedRecord);
                setSelectedRecord(result);
              } catch (error) {
                console.error('Failed to update record:', error);
              }
            }}
            onRecordAdded={(newRecord) => handleRecordSelect(newRecord)}
          />
        </div>
      </div>
    </div>
  );
};
