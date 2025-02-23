export interface MedicalRecord {
  id: string;
  patientId: string;
  date: Date;
  type: 'diagnosis' | 'lab_result' | 'complaint' | 'vital_signs';
  title: string;
  description: string;
  details?: Record<string, string | number>;
}
