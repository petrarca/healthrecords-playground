import React from 'react';
import { MedicalRecord } from '../../types/types';
import { TimelineIcon } from './TimelineIcon';
import { getEventTypeName } from './TimelineEventCard';

interface TimelineEventDetailsProps {
  record: MedicalRecord | null;
}

export const TimelineEventDetails: React.FC<TimelineEventDetailsProps> = ({ record }) => {
  if (!record) {
    return (
      <div className="flex-1 p-4 bg-white rounded-lg">
        <p className="text-gray-500 text-center">Select an event to view details</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-white rounded-lg">
      <div className="flex items-start gap-4">
        <TimelineIcon type={record.type} />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {getEventTypeName(record.type)}
          </h3>
          <div className="mt-1 text-sm text-gray-500">
            {record.date.toLocaleDateString([], {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {' at '}
            {record.date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900">Description</h4>
        <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
          {record.description}
        </p>
      </div>

      {record.provider && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Provider</h4>
          <p className="mt-2 text-sm text-gray-600">{record.provider}</p>
        </div>
      )}

      {record.location && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Location</h4>
          <p className="mt-2 text-sm text-gray-600">{record.location}</p>
        </div>
      )}

      {record.values && Object.keys(record.values).length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Values</h4>
          <div className="mt-2 grid grid-cols-2 gap-4">
            {Object.entries(record.values).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-xs text-gray-500 capitalize">
                  {key.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
