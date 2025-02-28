export const MedicalRecordType = {
  COMPLAINT: "complaint" as const,
  DIAGNOSIS: "diagnosis" as const,
  MEDICATION: "medication" as const,
  LAB_RESULT: "lab_result" as const,
  VITAL_SIGNS: "vital_signs" as const,
  PROCEDURE: "procedure" as const,
} as const;

export type MedicalRecordType =
  (typeof MedicalRecordType)[keyof typeof MedicalRecordType];

export interface MedicalRecord {
  id: string;
  patientId: string;
  recordId: string;
  recordedAt: Date;
  recordType: MedicalRecordType;
  title: string;
  description: string;
  details?: Record<string, string | number | QuantityValue>;
}

export interface QuantityValue {
  value: number | string;
  unit: string;
}

export interface QuantityUnitValidation {
  min?: number;
  max?: number;
}

export interface QuantityUnitMetadata {
  unit: string;
  default?: boolean;
  validation?: QuantityUnitValidation;
  display_name?: string;
}

export interface FieldMetaData {
  label: string;
  description: string;
  type: "string" | "number" | "boolean" | "date" | "enum" | "quantity" | "json";
  required?: boolean;
  pattern?: string;
  validation?: {
    min?: number;
    max?: number;
  };
  enumValues?: string[];
  defaultUnit?: string; // Deprecated - use quantityUnits instead
  quantity_units?: Record<string, QuantityUnitMetadata>; // Deprecated - use quantityUnits instead
  quantityUnits?: QuantityUnitMetadata[];
  quantityType?: "string" | "number";
  precision?: number; // Number of decimal places for numeric values
  rendererType?: string; // Identifier for a custom renderer
  rendererProps?: Record<string, unknown>; // Optional props to pass to the renderer
}

export interface MedicalRecordTypeMetaData {
  type: MedicalRecordType;
  name: string;
  description: string;
  icon: string;
  fields: Record<string, FieldMetaData>;
}
