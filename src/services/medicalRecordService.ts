import { MedicalRecord, MedicalRecordType } from '../types/types';
import { mockDataService } from './mockData';
import { generateShortId } from '../lib/utils';

interface CreateMedicalRecordParams {
  patientId: string;
  type: MedicalRecordType;
  title?: string;
  description?: string;
  details?: Record<string, string | number>;
}

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
    } else {
      throw new Error('Record not found');
    }
  }

  async addRecord(newRecord: MedicalRecord): Promise<void> {
    await this.initialize();
    const existingRecord = this.records.find(r => r.id === newRecord.id);
    if (existingRecord) {
      throw new Error('Record with this ID already exists');
    }
    this.records.push(newRecord);
  }

  createRecord(params: CreateMedicalRecordParams): MedicalRecord {
    return {
      id: generateShortId(),
      recordId: generateShortId(),
      patientId: params.patientId,
      type: params.type,
      date: new Date(),
      title: params.title || '',
      description: params.description || '',
      details: params.details || {}
    };
  }
}

export const medicalRecordService = new MedicalRecordService();
