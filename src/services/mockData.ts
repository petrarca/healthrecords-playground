import { Patient } from '../types/patient';
import { MedicalRecord, MedicalRecordType } from '../types/medicalRecord';

interface PatientData extends Omit<Patient, 'dateOfBirth'> {
  dateOfBirth: string;
}

interface MedicalRecordData extends Omit<MedicalRecord, 'date' | 'type'> {
  date: string;
  type: string;
}

export class MockDataService {
  private patients: Patient[] = [];
  private medicalRecords: MedicalRecord[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      console.log('Initializing mock data service...');
      
      // Load patients
      const patientsResponse = await fetch('/data/patients.json');
      if (!patientsResponse.ok) {
        throw new Error(`Failed to load patients data: ${patientsResponse.statusText}`);
      }
      const patientsData = await patientsResponse.json();
      
      this.patients = patientsData.patients.map((patient: PatientData) => ({
        ...patient,
        dateOfBirth: new Date(patient.dateOfBirth),
        allergies: Array.isArray(patient.allergies) ? patient.allergies : []
      }));
      
      console.log('Processed patients:', this.patients.length);

      // Load medical records
      const recordsResponse = await fetch('/data/medical_records.json');
      if (!recordsResponse.ok) {
        throw new Error(`Failed to load medical records data: ${recordsResponse.statusText}`);
      }
      const recordsData = await recordsResponse.json();
      
      this.medicalRecords = recordsData.records.map((record: MedicalRecordData) => ({
        ...record,
        date: new Date(record.date),
        type: this.convertToMedicalRecordType(record.type),
        details: record.details || {}
      }));
      
      console.log('Processed medical records:', this.medicalRecords.length);
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize mock data:', error);
      throw error;
    }
  }

  private convertToMedicalRecordType(type: string): MedicalRecordType {
    switch (type) {
      case 'diagnosis':
        return MedicalRecordType.DIAGNOSIS;
      case 'lab_result':
        return MedicalRecordType.LAB_RESULT;
      case 'complaint':
        return MedicalRecordType.COMPLAINT;
      case 'vital_signs':
        return MedicalRecordType.VITAL_SIGNS;
      case 'medication':
        return MedicalRecordType.MEDICATION;
      default:
        throw new Error(`Unknown medical record type: ${type}`);
    }
  }

  async getPatients(): Promise<Patient[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.patients;
  }

  async getMedicalRecords(): Promise<MedicalRecord[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.medicalRecords;
  }

  async getPatientById(id: string): Promise<Patient | undefined> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.patients.find(patient => patient.id === id);
  }

  async getMedicalRecordsByPatientId(patientId: string): Promise<MedicalRecord[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.medicalRecords.filter(record => record.patientId === patientId);
  }

  async updatePatient(updatedPatient: Patient): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
    const index = this.patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
      this.patients[index] = updatedPatient;
    }
  }

  async updateMedicalRecord(updatedRecord: MedicalRecord): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
    const index = this.medicalRecords.findIndex(r => r.id === updatedRecord.id);
    if (index !== -1) {
      this.medicalRecords[index] = updatedRecord;
    }
  }
}

export const mockDataService = new MockDataService();
