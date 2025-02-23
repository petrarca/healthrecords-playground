import React from 'react';

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
}

const TimelineIcon: React.FC<TimelineIconProps> = ({ type }) => {
  const iconClasses = "w-8 h-8 rounded-full flex items-center justify-center text-white";
  
  const icons = {
    diagnosis: <div className={`${iconClasses} bg-red-500`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>,
    lab_result: <div className={`${iconClasses} bg-blue-500`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    </div>,
    complaint: <div className={`${iconClasses} bg-yellow-500`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>,
    vital_signs: <div className={`${iconClasses} bg-green-500`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>,
  };

  return icons[type];
};

interface MedicalTimelineProps {
  records: MedicalRecord[];
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({ records }) => {
  const groupedRecords = records.reduce((groups, record) => {
    const date = record.date.toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, MedicalRecord[]>);

  return (
    <div className="w-full max-w-3xl mx-auto p-2">
      {Object.entries(groupedRecords).map(([date, dateRecords], groupIndex) => (
        <div key={date} className="mb-4">
          <div className="mb-2">
            <h3 className="text-base font-semibold text-gray-900">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
          </div>
          
          <div className="ml-5">
            <div className="space-y-3">
              {dateRecords.map((record, index) => (
                <div key={record.id} className="relative pl-6">
                  {/* Vertical connecting line to next icon */}
                  {index < dateRecords.length - 1 && (
                    <div className="absolute left-4 top-[34px] w-[2px] h-[calc(100%-24px)] bg-gray-200" />
                  )}
                  
                  {/* Icon */}
                  <div className="absolute left-0 top-0 bg-white">
                    <TimelineIcon type={record.type} />
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-base font-medium text-gray-900">{record.title}</h4>
                      <span className="text-xs text-gray-500">
                        {record.date.toLocaleTimeString('en-US', { 
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{record.description}</p>
                    {record.details && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(record.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-xs">
                              <span className="text-gray-500">{key}:</span>
                              <span className="text-gray-900 font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
