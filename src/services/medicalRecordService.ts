import { MedicalRecord } from '../types/types';
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

  static async searchRecords(patientId: string, query: string): Promise<MedicalRecord[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const records = mockMedicalRecords[patientId];
    if (!records) {
      return [];
    }

    const normalizedQuery = query.toLowerCase();
    return records.filter(record => 
      record.title.toLowerCase().includes(normalizedQuery) ||
      record.description.toLowerCase().includes(normalizedQuery) ||
      record.type.toLowerCase().includes(normalizedQuery) ||
      Object.entries(record.details || {}).some(([key, value]) => 
        key.toLowerCase().includes(normalizedQuery) ||
        value.toString().toLowerCase().includes(normalizedQuery)
      )
    );
  }
}
