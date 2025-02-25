export const MedicalRecordType = {
  DIAGNOSIS: 'diagnosis' as const,
  LAB_RESULT: 'lab_result' as const,
  COMPLAINT: 'complaint' as const,
  VITAL_SIGNS: 'vital_signs' as const,
  MEDICATION: 'medication' as const
} as const;

export type MedicalRecordType = typeof MedicalRecordType[keyof typeof MedicalRecordType];

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: Date;
  type: MedicalRecordType;
  title: string;
  description: string;
  details?: Record<string, string | number>;
}

export interface FieldMetaData {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  required?: boolean;
  pattern?: string;
  validation?: {
    min?: number;
    max?: number;
  };
  enumValues?: string[];
}

export interface MedicalRecordTypeMetaData {
  type: MedicalRecordType;
  name: string;
  description: string;
  icon: string;
  fields: Record<string, FieldMetaData>;
}
