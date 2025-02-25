import React, { useState } from 'react';
import { MedicalRecord } from '../../types/types';
import { metadataService } from '../../services/metadataService';
import { TimelineIcon } from './TimelineIcon';

interface TimelineEventDetailsProps {
  record: MedicalRecord;
  onUpdateRecord?: (record: MedicalRecord) => void;
}

export const TimelineEventDetails: React.FC<TimelineEventDetailsProps> = ({
  record,
  onUpdateRecord,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedRecord, setEditedRecord] = useState<MedicalRecord>(record);

  if (!record) {
    return null;
  }

  const handleEdit = () => {
    setIsMenuOpen(false);
    setIsEditMode(true);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    // TODO: Implement delete functionality
  };

  const handleSave = () => {
    if (onUpdateRecord) {
      onUpdateRecord(editedRecord);
    }
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedRecord(record);
    setIsEditMode(false);
  };

  const handleUpdateField = (field: keyof MedicalRecord, value: string | number | boolean | Record<string, string | number>) => {
    setEditedRecord({ ...editedRecord, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {record.type && <TimelineIcon type={record.type} size="md" />}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
            <p className="text-sm text-gray-500">
              {record.type && metadataService.getTypeName(record.type)} • {record.date && new Date(record.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="relative">
          {isEditMode ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Save changes"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Cancel editing"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Record
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Record
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          {isEditMode ? (
            <textarea
              value={editedRecord?.description || ''}
              onChange={(e) => handleUpdateField('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              rows={4}
            />
          ) : (
            <p className="text-sm text-gray-700">{record.description}</p>
          )}
        </div>

        {record.details && Object.keys(record.details).length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-2">
              {(() => {
                const typeMetadata = record.type ? metadataService.getMetaDataForType(record.type).fields : null;
                return Object.entries(record.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="text-sm text-gray-500">
                      {typeMetadata?.[key]?.label || key.replace(/_/g, ' ')}
                    </dt>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editedRecord.details?.[key] || ''}
                        onChange={(e) => {
                          const updatedDetails = {
                            ...(editedRecord.details || {}),
                            [key]: e.target.value
                          };
                          handleUpdateField('details', updatedDetails);
                        }}
                        className="text-sm text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <dd className="text-sm text-gray-900">{value}</dd>
                    )}
                  </div>
                ));
              })()}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};
