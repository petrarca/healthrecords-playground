import React from 'react';
import { MedicalRecord } from '../../types/types';

interface TimelineYearSelectorProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  recordsByMonth: Map<string, {
    count: number;
    types: Map<MedicalRecord['recordType'], number>;
  }>;
  selectedMonth: string | null;
  onMonthSelect: (month: string) => void;
}

export const TimelineYearSelector: React.FC<TimelineYearSelectorProps> = ({
  years,
  selectedYear,
  onYearChange,
  recordsByMonth,
  selectedMonth,
  onMonthSelect
}) => {
  // Group months by year
  const monthsByYear = React.useMemo(() => {
    const yearMap = new Map<number, string[]>();
    Array.from(recordsByMonth.keys()).forEach(monthKey => {
      const [year] = monthKey.split('-');
      const yearNum = parseInt(year);
      if (!yearMap.has(yearNum)) {
        yearMap.set(yearNum, []);
      }
      yearMap.get(yearNum)!.push(monthKey);
    });
    return yearMap;
  }, [recordsByMonth]);

  return (
    <div className="w-64 flex-none overflow-y-auto bg-white border-r border-gray-200">
      <div className="px-3 py-2 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Quick Navigation
        </div>
      </div>
      <div className="p-2">
        {years.map(year => (
          <div key={year} className="mb-2">
            <button
              onClick={() => onYearChange(year)}
              className={`
                w-full flex items-center justify-between px-2.5 py-1.5 text-sm font-medium
                rounded transition-colors duration-150
                ${year === selectedYear ? 
                  'bg-gray-100 text-gray-900' : 
                  'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <span>{year}</span>
              <span className="text-xs text-gray-500">
                {monthsByYear.get(year)?.length || 0} months
              </span>
            </button>
            
            {/* Only show months for selected year */}
            {year === selectedYear && (
              <div className="mt-1 ml-2 space-y-0.5">
                {monthsByYear.get(year)?.map(monthKey => {
                  const [yearStr, monthStr] = monthKey.split('-');
                  const monthName = new Date(parseInt(yearStr), parseInt(monthStr) - 1)
                    .toLocaleString('default', { month: 'long' });
                  const isSelected = monthKey === selectedMonth;
                  const monthData = recordsByMonth.get(monthKey);
                  
                  return (
                    <button
                      key={monthKey}
                      id={`quick-nav-${monthKey}`}
                      className={`
                        w-full text-left px-2.5 py-1.5 rounded text-sm
                        transition-colors duration-150
                        ${isSelected ? 
                          'bg-blue-50 text-blue-900 font-medium' : 
                          'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                      onClick={() => onMonthSelect(monthKey)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{monthName}</span>
                        {monthData && (
                          <div className="flex items-center gap-1">
                            <div className="flex -space-x-1">
                              {Array.from(monthData.types.entries())
                                .sort((a, b) => b[1] - a[1])
                                .map(([type, count]) => (
                                  <div
                                    key={type}
                                    className="relative flex items-center justify-center w-3.5 h-3.5 rounded-full ring-1 ring-white"
                                    style={{
                                      backgroundColor: type === 'diagnosis' ? '#DC2626' :
                                        type === 'lab_result' ? '#2563EB' :
                                        type === 'complaint' ? '#D97706' :
                                        type === 'medication' ? '#7C3AED' :
                                        '#059669'
                                    }}
                                  >
                                    <span className="text-[7px] font-medium text-white">
                                      {count}
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                            <span className="text-xs text-gray-500">
                              {monthData.count}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
