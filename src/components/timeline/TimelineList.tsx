import React from 'react';
import { MedicalRecord } from '../../types/types';
import { TimelineEventCard } from './TimelineEventCard';

interface TimelineListProps {
  groupedByDate: Record<string, MedicalRecord[]>;
  datesByYearAndMonth: Record<number, Record<string, string[]>>;
  selectedYear: number;
  selectedRecord: MedicalRecord | null;
  selectedDate: string | null;
  onRecordSelect: (record: MedicalRecord) => void;
}

export const TimelineList: React.FC<TimelineListProps> = ({
  groupedByDate,
  datesByYearAndMonth,
  selectedYear,
  selectedRecord,
  selectedDate,
  onRecordSelect,
}) => {
  return (
    <div className="h-96 overflow-y-scroll px-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
      {datesByYearAndMonth[selectedYear] && 
        Object.entries(datesByYearAndMonth[selectedYear]).map(([monthYear, dates]) => (
          <div key={monthYear} className="mb-3">
            <h3 className="px-4 py-1 text-sm font-medium text-gray-500">
              {monthYear}
            </h3>
            <div>
              {dates.map(date => (
                <div
                  key={date}
                  id={`date-${date}`}
                  className={`py-1 ${selectedDate === date ? 'bg-gray-50' : ''}`}
                >
                  <div className="px-4 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(date).toLocaleDateString([], {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    {groupedByDate[date]?.map(record => (
                      <TimelineEventCard
                        key={record.id}
                        record={record}
                        isSelected={selectedRecord?.id === record.id}
                        onClick={() => onRecordSelect(record)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
