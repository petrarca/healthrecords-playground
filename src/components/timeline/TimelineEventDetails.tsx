import React, { useState, useEffect, useRef } from 'react';
import { MedicalRecord, MedicalRecordType } from '../../types/medicalRecord';
import { metadataService } from '../../services/metadataService';
import { medicalRecordService } from '../../services/medicalRecordService';
import { TimelineIcon } from './TimelineIcon';
import { CardDropdown } from '../ui/cardDropdown';
import { Plus, Pencil, Check, X, Trash } from 'lucide-react';
import { useUpdateMedicalRecord, useAddMedicalRecord } from '../../hooks/useMedicalRecords';

enum RecordState {
  VIEWING = 'viewing',
  EDITING = 'editing',
  CREATING = 'creating',
  SELECTING = 'selecting'
}

interface TimelineEventDetailsProps {
  record?: MedicalRecord;
  patientId: string;
  onUpdateRecord?: (record: MedicalRecord) => void;
  onRecordAdded?: (record: MedicalRecord) => void;
}

type RecordFieldValue = string | number | boolean | Record<string, string | number>;

interface RecordFormProps {
  record: MedicalRecord;
  onUpdateField: (field: keyof MedicalRecord, value: RecordFieldValue) => void;
}

interface HeaderProps {
  recordState: RecordState;
  record: MedicalRecord | null;
  editedRecord: MedicalRecord | null;
  isEditMode: boolean;
  isValid: boolean | undefined;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onNewRecord: (type: MedicalRecordType) => void;
}

const RecordForm: React.FC<RecordFormProps> = ({ record, onUpdateField }) => {
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the title input when the form mounts
    titleInputRef.current?.focus();
  }, []);

  const renderMetadataFields = () => {
    if (!record.recordType) return null;

    const metadata = metadataService.getMetaDataForType(record.recordType);
    return Object.entries(metadata.fields).map(([fieldName, fieldMeta]) => (
      <div key={fieldName}>
        <label className="block text-sm font-medium text-gray-700">{fieldMeta.label}</label>
        {fieldMeta.type === 'enum' ? (
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={record.details?.[fieldName] ?? ''}
            onChange={(e) => {
              const newDetails = { ...record.details, [fieldName]: e.target.value };
              onUpdateField('details', newDetails);
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={record.details?.[fieldName] ?? ''}
            onChange={(e) => {
              const value = fieldMeta.type === 'number' ? parseFloat(e.target.value) : e.target.value;
              const newDetails = { ...record.details, [fieldName]: value };
              onUpdateField('details', newDetails);
            }}
          />
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="record-title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          ref={titleInputRef}
          id="record-title"
          type="text"
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            !record.title ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
          value={record.title}
          onChange={(e) => onUpdateField('title', e.target.value)}
          required
        />
        {!record.title && <p className="mt-1 text-sm text-red-500">Title is required</p>}
      </div>
      <div>
        <label htmlFor="record-description" className="block text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="record-description"
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            !record.description ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
          value={record.description}
          onChange={(e) => onUpdateField('description', e.target.value)}
          rows={4}
          required
        />
        {!record.description && <p className="mt-1 text-sm text-red-500">Description is required</p>}
      </div>
      {record.recordType && <div className="space-y-4">{renderMetadataFields()}</div>}
    </div>
  );
};

const RecordView: React.FC<{ record: MedicalRecord }> = ({ record }) => (
  <div>
    <p className="text-sm text-gray-700 mb-4">{record.description}</p>
    {record.details && Object.entries(record.details).length > 0 && (
      <div className="border-t border-gray-200 pt-4">
        <dl className="grid grid-cols-1 gap-y-3">
          {Object.entries(record.details).map(([key, value]) => {
            const fieldMeta = record.recordType && metadataService.getMetaDataForType(record.recordType).fields[key];
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
);

const Header: React.FC<HeaderProps> = ({
  recordState,
  record,
  editedRecord,
  isEditMode,
  isValid = false,
  onEdit,
  onSave,
  onCancel,
  onNewRecord,
}) => {
  const actionOptions = [
    {
      value: 'edit',
      label: 'Edit Record',
      icon: <Pencil size={14} className="text-gray-500" />
    },
    {
      value: 'delete',
      label: 'Delete Record',
      icon: <Trash size={14} className="text-gray-500" />,
      disabled: true
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
        return editedRecord?.title ?? 'New Record';
      case RecordState.EDITING:
        return editedRecord?.title ?? record?.title ?? 'Edit Record';
      case RecordState.VIEWING:
        return record?.title ?? '';
      default:
        return 'Select entry in timeline or add new one';
    }
  };

  const currentRecord = isEditMode ? editedRecord : record;

  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {currentRecord?.recordType && (
          <button 
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            onClick={onEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onEdit();
            }}
            aria-label="Edit record"
          >
            <TimelineIcon type={currentRecord.recordType} size="md" />
          </button>
        )}
        <div>
          <h3 className={`font-semibold text-gray-900 ${recordState === RecordState.SELECTING ? 'text-base' : 'text-lg'}`}>
            {getHeaderText()}
          </h3>
          <p className="text-sm text-gray-500">
            {currentRecord?.recordType && (
              <>
                {metadataService.getTypeName(currentRecord.recordType)} • {
                  currentRecord.recordedAt && new Date(currentRecord.recordedAt).toLocaleDateString()
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
            onSelect={(value) => onNewRecord(value as MedicalRecordType)}
            className="text-green-600"
            icon={<Plus size={14} className="text-green-600" />}
          />
        )}
        {isEditMode ? (
          <div className="flex gap-2">
            <button
              onClick={onSave}
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
              onClick={onCancel}
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
              if (value === 'edit') onEdit();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const TimelineEventDetails: React.FC<TimelineEventDetailsProps> = ({
  record,
  patientId,
  onUpdateRecord,
  onRecordAdded,
}) => {
  const [recordState, setRecordState] = useState<RecordState>(record ? RecordState.VIEWING : RecordState.SELECTING);
  const [editedRecord, setEditedRecord] = useState<MedicalRecord | null>(record || null);

  const { mutate: updateRecord } = useUpdateMedicalRecord();
  const { mutate: addRecord } = useAddMedicalRecord();

  const isValid: boolean = Boolean(editedRecord?.title?.trim() && editedRecord?.description?.trim());
  const isEditMode = recordState === RecordState.EDITING || recordState === RecordState.CREATING;

  useEffect(() => {
    if (record) {
      setRecordState(RecordState.VIEWING);
      setEditedRecord(record);
    } else {
      setRecordState(RecordState.SELECTING);
      setEditedRecord(null);
    }
  }, [record]);

  const handleEdit = () => {
    if (record) {
      setRecordState(RecordState.EDITING);
      setEditedRecord({...record});
    }
  };

  const handleNewRecord = (type: MedicalRecordType) => {
    const newRecord = medicalRecordService.createRecord({ patientId, type });
    setEditedRecord(newRecord);
    setRecordState(RecordState.CREATING);
  };

  const handleSave = () => {
    if (!editedRecord || !isValid) return;

    const recordToSave = recordState === RecordState.EDITING ? 
      { ...editedRecord, id: record!.id } : editedRecord;

    if (recordState === RecordState.CREATING) {
      addRecord(recordToSave, {
        onSuccess: () => {
          onRecordAdded?.(recordToSave);
          setRecordState(RecordState.VIEWING);
          setEditedRecord(recordToSave);
        }
      });
    } else {
      updateRecord(recordToSave);
      setRecordState(RecordState.VIEWING);
      setEditedRecord(recordToSave);
    }
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

  const handleUpdateField = (field: keyof MedicalRecord, value: RecordFieldValue) => {
    if (!editedRecord) return;
    setEditedRecord({ ...editedRecord, [field]: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <Header
        recordState={recordState}
        record={record || null}
        editedRecord={editedRecord}
        isEditMode={isEditMode}
        isValid={isValid}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onNewRecord={handleNewRecord}
      />

      <div className="p-4">
        {isEditMode && editedRecord ? (
          <RecordForm 
            record={editedRecord}
            onUpdateField={handleUpdateField}
          />
        ) : (
          record && <RecordView record={record} />
        )}
      </div>
    </div>
  );
};
