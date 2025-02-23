import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MedicalRecord } from '../../types/types';
import { TimelineFilters } from './TimelineFilters';
import { TimelineYearSelector } from './TimelineYearSelector';
import { TimelineList } from './TimelineList';
import { TimelineEventDetails } from './TimelineEventDetails';

interface MedicalTimelineProps {
  records: MedicalRecord[];
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({ records }) => {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<MedicalRecord['type']>>(
    new Set(['diagnosis', 'lab_result', 'complaint', 'vital_signs', 'medication'])
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(() => {
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
      .sort((a, b) => b - a);
  }, [datesByYearAndMonth]);

  // Get records and types by month for quick navigation
  const recordsByMonth = useMemo(() => {
    const months = new Map<string, {
      count: number;
      types: Map<MedicalRecord['type'], number>;
    }>();
    
    records.forEach(record => {
      const month = record.date.toISOString().substring(0, 7); // YYYY-MM
      const monthData = months.get(month) || { count: 0, types: new Map() };
      monthData.count++;
      monthData.types.set(record.type, (monthData.types.get(record.type) || 0) + 1);
      months.set(month, monthData);
    });
    
    return months;
  }, [records]);

  const selectedMonth = useMemo(() => {
    if (!selectedDate) return null;
    return selectedDate.substring(0, 7); // YYYY-MM
  }, [selectedDate]);

  const allTypes = useMemo(() => 
    ['diagnosis', 'lab_result', 'complaint', 'vital_signs', 'medication'] as const,
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
      const element = document.getElementById(`record-${firstRecord.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleRecordSelect = (record: MedicalRecord) => {
    setSelectedRecord(record);
    const date = record.date.toISOString().split('T')[0];
    setSelectedDate(date);
  };

  // Get all visible records in chronological order
  const allVisibleRecords = useMemo(() => {
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));
    return sortedDates.flatMap(date => groupedByDate[date]);
  }, [groupedByDate]);

  // Get dates grouped by month for navigation
  const datesByMonth = useMemo(() => {
    const months: { date: string; records: MedicalRecord[] }[] = [];
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));
    
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
  }, [groupedByDate]);

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
      
      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex flex-col">
          <TimelineYearSelector
            years={years}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            recordsByMonth={recordsByMonth}
            selectedMonth={selectedMonth}
            onMonthSelect={handleMonthSelect}
          />
        </div>
        
        <div ref={timelineRef} className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <TimelineList
            groupedByDate={groupedByDate}
            datesByYearAndMonth={datesByYearAndMonth}
            selectedYear={selectedYear}
            selectedRecord={selectedRecord}
            selectedDate={selectedDate}
            onRecordSelect={handleRecordSelect}
          />
        </div>
        
        <div className="w-96">
          <TimelineEventDetails record={selectedRecord} />
        </div>
      </div>
    </div>
  );
};
