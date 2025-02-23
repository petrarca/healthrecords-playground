import { MedicalRecord } from '../types/medicalRecord';

export const getEventTypeName = (type: MedicalRecord['type']): string => {
  const names = {
    diagnosis: 'Assessment',
    lab_result: 'Laboratory Results',
    complaint: 'Patient Complaint',
    vital_signs: 'Vital Signs',
    medication: 'Prescription & Medications'
  };
  return names[type];
};
