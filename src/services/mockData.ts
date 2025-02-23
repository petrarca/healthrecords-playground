import { Patient } from '../types/patient';
import { MedicalRecord } from '../types/medicalRecord';

interface PatientData extends Omit<Patient, 'dateOfBirth'> {
  dateOfBirth: string;
}

interface MedicalRecordData extends Omit<MedicalRecord, 'date'> {
  date: string;
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
        details: record.details || {}
      }));
      
      console.log('Processed medical records:', this.medicalRecords.length);
      this.initialized = true;
    } catch (error) {
      console.error('Error loading mock data:', error);
      // Initialize with empty arrays rather than throwing
      this.patients = [];
      this.medicalRecords = [];
      this.initialized = true;
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
}

export const mockDataService = new MockDataService();
