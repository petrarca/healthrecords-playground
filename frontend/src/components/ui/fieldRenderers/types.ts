import { FieldMetaData } from '../../../types/medicalRecord';

// Interface for field renderer props
export interface FieldRendererProps {
  data: unknown;
  fieldName: string;
  fieldMeta: FieldMetaData;
  [key: string]: unknown;
}
