import React, { useState, useMemo, useRef, useEffect } from 'react';
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
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({ records, selectedRecordId }) => {
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
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    if (!records.length) return new Date().getFullYear();
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
    const counts = records.reduce((counts, record) => {
      counts[record.type] = (counts[record.type] || 0) + 1;
      return counts;
    }, {} as Record<MedicalRecordType, number>);
    console.log('Record counts:', counts);
    return counts;
  }, [records]);

  // Filter and group records by date
  const groupedByDate = useMemo(() => {
    const filtered = records.filter(record => activeFilters.has(record.type));
    
    // Sort records by date (newest first) before grouping
    const sortedRecords = [...filtered].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return sortedRecords.reduce((groups, record) => {
      const date = record.date.toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    }, {} as Record<string, MedicalRecord[]>);
  }, [records, activeFilters]);

  // Group dates by year and month (newest first)
  const datesByYearAndMonth = useMemo(() => {
    const years: Record<number, Record<string, string[]>> = {};
    
    Object.keys(groupedByDate)
      .sort((a, b) => b.localeCompare(a)) // Sort dates in descending order
      .forEach(date => {
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

    // Sort dates within each month (newest first)
    Object.values(years).forEach(yearData => {
      Object.values(yearData).forEach(dates => {
        dates.sort((a, b) => b.localeCompare(a));
      });
    });

    console.log('Dates grouped by year and month:', years);
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
      types: Map<MedicalRecordType, number>;
    }>();
    
    records.forEach(record => {
      const month = record.date.toISOString().substring(0, 7); // YYYY-MM
      const monthData = months.get(month) || { count: 0, types: new Map() };
      monthData.count++;
      monthData.types.set(record.type, (monthData.types.get(record.type) || 0) + 1);
      months.set(month, monthData);
    });
    
    console.log('Records by month:', months);
    return months;
  }, [records]);

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
      const element = document.getElementById(`record-${firstRecord.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleRecordSelect = (record: MedicalRecord) => {
    setSelectedRecord(record);
    // Update URL when record is selected
    navigate(`/patients/${patientId}/timeline/${record.id}`, { replace: true });
  };

  const handleRecordClose = () => {
    setSelectedRecord(null);
    // Remove record ID from URL when record is closed
    navigate(`/patients/${patientId}/timeline`, { replace: true });
  };

  // Update selected record if it changes in the records array
  useEffect(() => {
    if (selectedRecord) {
      const updatedRecord = records.find(r => r.id === selectedRecord.id);
      if (updatedRecord && JSON.stringify(updatedRecord) !== JSON.stringify(selectedRecord)) {
        setSelectedRecord(updatedRecord);
      }
    }
  }, [records, selectedRecord]);

  // Effect to handle selectedRecordId
  useEffect(() => {
    if (selectedRecordId) {
      const record = records.find(r => r.id === selectedRecordId);
      if (record) {
        setSelectedRecord(record);
        const recordDate = record.date.toISOString().split('T')[0];
        setSelectedDate(recordDate);
        setSelectedYear(new Date(recordDate).getFullYear());
      }
    }
  }, [selectedRecordId, records]);

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
    
    console.log('Dates grouped by month:', months);
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
      
      <div className="flex gap-4 h-[calc(100vh-300px)]">
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
        
        <div ref={timelineRef} className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
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
            onClose={handleRecordClose}
          />
        </div>
      </div>
    </div>
  );
};
