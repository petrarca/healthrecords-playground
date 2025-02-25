import React, { useState, useEffect } from 'react';
import { MedicalRecord, MedicalRecordType } from '../../types/medicalRecord';
import { metadataService } from '../../services/metadataService';
import { TimelineIcon } from './TimelineIcon';
import { CardDropdown } from '../ui/cardDropdown';
import { Plus, Pencil, Check, X, Trash } from 'lucide-react';
import { useUpdateMedicalRecord, useAddMedicalRecord } from '../../hooks/useMedicalRecords';
import { generateShortId } from '../../lib/utils';

enum RecordState {
  VIEWING = 'viewing',
  EDITING = 'editing',
  CREATING = 'creating',
  SELECTING = 'selecting'
}

interface TimelineEventDetailsProps {
  record?: MedicalRecord;
  onUpdateRecord?: (record: MedicalRecord) => void;
  onRecordAdded?: (record: MedicalRecord) => void;
}

export const TimelineEventDetails: React.FC<TimelineEventDetailsProps> = ({
  record,
  onUpdateRecord,
  onRecordAdded,
}) => {
  const [recordState, setRecordState] = useState<RecordState>(record ? RecordState.VIEWING : RecordState.SELECTING);
  const [editedRecord, setEditedRecord] = useState<MedicalRecord | null>(record || null);

  const { mutate: updateRecord } = useUpdateMedicalRecord();
  const { mutate: addRecord } = useAddMedicalRecord();

  // Validation
  const isValid = editedRecord?.title && editedRecord.title.trim() !== '' && 
                 editedRecord.description && editedRecord.description.trim() !== '';

  // Reset state when record changes
  useEffect(() => {
    if (record) {
      setRecordState(RecordState.VIEWING);
      setEditedRecord(record);
    } else {
      setRecordState(RecordState.SELECTING);
      setEditedRecord(null);
    }
  }, [record]);

  // Handle state transitions
  useEffect(() => {
    if (!record && recordState === RecordState.VIEWING) {
      setRecordState(RecordState.SELECTING);
    }
  }, [record, recordState]);

  const isEditMode = recordState === RecordState.EDITING || recordState === RecordState.CREATING;

  const handleEdit = () => {
    if (record) {
      setRecordState(RecordState.EDITING);
      setEditedRecord({...record});
    }
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
  };

  const handleNewRecord = (type: MedicalRecordType) => {
    const newRecord: MedicalRecord = {
      id: generateShortId(),
      patientId: record?.patientId || '', 
      type,
      date: new Date(),
      title: '',
      description: '',
      details: {}
    };
    setEditedRecord(newRecord);
    setRecordState(RecordState.CREATING);
  };

  const handleSave = () => {
    if (!editedRecord || !isValid) return;

    const saveRecord = (recordToSave: MedicalRecord) => {
      const mutate = recordState === RecordState.CREATING ? addRecord : updateRecord;
      mutate(recordToSave, {
        onSuccess: () => {
          if (recordState === RecordState.CREATING) {
            onRecordAdded?.(recordToSave);
          } else {
            onUpdateRecord?.(recordToSave);
          }
          setRecordState(RecordState.VIEWING);
          setEditedRecord(recordToSave);
        },
        onError: (error) => {
          console.error('Failed to save record:', error);
        }
      });
    };

    // When editing, ensure we're using the original record ID
    const recordToSave = recordState === RecordState.EDITING ? 
      { ...editedRecord, id: record!.id } : 
      editedRecord;
    
    saveRecord(recordToSave);
  };

  const handleCancel = () => {
    if (record) {
      setEditedRecord(record);
      setRecordState(RecordState.VIEWING);
    } else {
      setEditedRecord(null);
      setRecordState(RecordState.SELECTING);
    }
  };

  const handleUpdateField = (field: keyof MedicalRecord, value: string | number | boolean | Record<string, string | number>) => {
    if (!editedRecord) return;
    setEditedRecord({ ...editedRecord, [field]: value });
  };

  const actionOptions = [
    {
      value: 'edit',
      label: 'Edit Record',
      icon: <Pencil size={14} className="text-gray-500" />
    },
    {
      value: 'delete',
      label: 'Delete Record',
      icon: <Trash size={14} className="text-gray-500" />
    }
  ];

  const newEntryOptions = metadataService.getAllTypes().map(type => ({
    value: type,
    label: metadataService.getTypeName(type),
    icon: <TimelineIcon type={type} size="sm" />
  }));

  const getHeaderText = () => {
    if (!record && recordState === RecordState.SELECTING) {
      return 'Select entry in timeline or add new one';
    }

    switch (recordState) {
      case RecordState.CREATING:
        return editedRecord?.title || 'New Record';
      case RecordState.EDITING:
        return editedRecord?.title || record?.title || 'Edit Record';
      case RecordState.VIEWING:
        return record?.title || '';
      default:
        return 'Select entry in timeline or add new one';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {(isEditMode ? editedRecord?.type : record?.type) && (
            <div 
              className="cursor-pointer" 
              onClick={handleEdit}
            >
              <TimelineIcon type={isEditMode ? editedRecord!.type : record!.type} size="md" />
            </div>
          )}
          <div>
            <h3 className={`font-semibold text-gray-900 ${recordState === RecordState.SELECTING ? 'text-base' : 'text-lg'}`}>
              {getHeaderText()}
            </h3>
            <p className="text-sm text-gray-500">
              {(isEditMode ? editedRecord?.type : record?.type) && (
                <>
                  {metadataService.getTypeName(isEditMode ? editedRecord!.type : record!.type)} • {
                    (isEditMode ? editedRecord?.date : record?.date) && 
                    new Date(isEditMode ? editedRecord!.date : record!.date).toLocaleDateString()
                  }
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditMode && (
            <CardDropdown
              options={newEntryOptions}
              onSelect={(value) => handleNewRecord(value as MedicalRecordType)}
              className="text-green-600"
              icon={<Plus size={14} className="text-green-600" />}
            />
          )}
          {isEditMode ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!isValid}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium
                  ${isValid ? 'text-green-700 hover:bg-green-50' : 'text-gray-400 cursor-not-allowed'}
                `}
                title={isValid ? 'Save changes' : 'Fill in required fields'}
              >
                <Check size={14} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          ) : (record && (
            <CardDropdown
              options={actionOptions}
              onSelect={(value) => {
                if (value === 'edit') handleEdit();
                if (value === 'delete') handleDelete();
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditMode && editedRecord ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm ${
                  !editedRecord.title ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
                }`}
                value={editedRecord.title || ''}
                onChange={(e) => handleUpdateField('title', e.target.value)}
                placeholder="Enter title"
              />
              {!editedRecord.title && (
                <p className="mt-1 text-sm text-red-500">Title is required</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm ${
                  !editedRecord.description ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
                }`}
                value={editedRecord.description || ''}
                onChange={(e) => handleUpdateField('description', e.target.value)}
                rows={4}
              />
              {!editedRecord.description && (
                <p className="mt-1 text-sm text-red-500">Description is required</p>
              )}
            </div>

            {editedRecord.type && (
              <div className="space-y-4">
                {Object.entries(metadataService.getMetaDataForType(editedRecord.type).fields).map(([fieldName, fieldMeta]) => (
                  <div key={fieldName}>
                    <label className="block text-sm font-medium text-gray-700">{fieldMeta.label}</label>
                    {fieldMeta.type === 'enum' ? (
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={editedRecord.details?.[fieldName] || ''}
                        onChange={(e) => {
                          const newDetails = { ...editedRecord.details, [fieldName]: e.target.value };
                          handleUpdateField('details', newDetails);
                        }}
                      >
                        <option value="">Select...</option>
                        {fieldMeta.enumValues?.map(value => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={fieldMeta.type === 'number' ? 'number' : 'text'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={editedRecord.details?.[fieldName] || ''}
                        onChange={(e) => {
                          const value = fieldMeta.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                          const newDetails = { ...editedRecord.details, [fieldName]: value };
                          handleUpdateField('details', newDetails);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-700 mb-4">{record?.description}</p>
            {record?.details && Object.entries(record.details).length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <dl className="grid grid-cols-1 gap-y-3">
                  {Object.entries(record.details).map(([key, value]) => {
                    const fieldMeta = record.type && metadataService.getMetaDataForType(record.type).fields[key];
                    return (
                      <div key={key}>
                        <dt className="text-sm font-medium text-gray-500">{fieldMeta?.label || key}</dt>
                        <dd className="text-sm text-gray-900 mt-1">{value}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
