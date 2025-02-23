import { MedicalRecord } from '../types';
import { mockMedicalRecords } from './mockData';

export class MedicalRecordService {
  static async getPatientRecords(patientId: string): Promise<MedicalRecord[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const records = mockMedicalRecords[patientId];
    if (!records) {
      return [];
    }
    
    return records.map(record => ({
      ...record,
      date: new Date(record.date) // Ensure date is properly instantiated
    }));
  }
}
