import { MedicalRecord } from '../types/types';
import { mockDataService } from './mockData';

class MedicalRecordService {
  private records: MedicalRecord[] = [];
  private initialized = false;

  async initialize() {
    if (!this.initialized) {
      this.records = await mockDataService.getMedicalRecords();
      this.initialized = true;
    }
  }

  async getPatientRecords(patientId: string): Promise<MedicalRecord[]> {
    await this.initialize();
    return this.records
      .filter(record => record.patientId === patientId)
      .map(record => ({
        ...record,
        date: new Date(record.date)
      }));
  }

  async searchRecords(query: string): Promise<MedicalRecord[]> {
    await this.initialize();
    const searchTerm = query.toLowerCase();
    return this.records
      .filter(record => 
        record.title.toLowerCase().includes(searchTerm) ||
        record.description.toLowerCase().includes(searchTerm) ||
        record.type.toLowerCase().includes(searchTerm)
      )
      .map(record => ({
        ...record,
        date: new Date(record.date)
      }));
  }

  async updateRecord(updatedRecord: MedicalRecord): Promise<void> {
    await this.initialize();
    const index = this.records.findIndex(r => r.id === updatedRecord.id);
    if (index !== -1) {
      this.records[index] = updatedRecord;
    }
  }
}

export const medicalRecordService = new MedicalRecordService();
