import { MedicalRecord } from '../types/types';
import { mockDataService } from './mockData';

class MedicalRecordService {
  private records: MedicalRecord[] = [];
  private initialized = false;

  private async initialize() {
    if (this.initialized) return;
    this.records = await mockDataService.getMedicalRecords();
    this.initialized = true;
  }

  async getPatientRecords(patientId: string): Promise<MedicalRecord[]> {
    await this.initialize();
    return this.records
      .filter(record => record.patientId === patientId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getAllRecords(): Promise<MedicalRecord[]> {
    await this.initialize();
    return this.records;
  }

  async searchRecords(query: string): Promise<MedicalRecord[]> {
    await this.initialize();
    
    if (!query || query.trim() === '') {
      return [];
    }

    // Special case for "*" to return all records
    if (query.trim() === '*') {
      return this.records;
    }

    const searchTerms = query.toLowerCase().trim().split(' ').filter(term => term.length > 0);
    
    return this.records.filter(record => {
      const searchableText = [
        record.id,
        record.patientId,
        record.type,
        record.title,
        record.description,
        JSON.stringify(record.details)
      ].filter(Boolean).join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });
  }
}

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

export const medicalRecordService = new MedicalRecordService();
