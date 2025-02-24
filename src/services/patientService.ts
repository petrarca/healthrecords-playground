import { Patient } from '../types/types';
import { mockDataService } from './mockData';

class PatientService {
  private patients: Patient[] = [];
  private initialized = false;

  private async initialize() {
    if (this.initialized) return;
    this.patients = await mockDataService.getPatients();
    this.initialized = true;
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    await this.initialize();
    return this.patients.find(p => p.id === id);
  }

  async getAllPatients(): Promise<Patient[]> {
    await this.initialize();
    return this.patients;
  }

  async searchPatients(query: string): Promise<Patient[]> {
    await this.initialize();
    
    if (!query || query.trim() === '') {
      return [];
    }

    // Special case for "*" to return all patients
    if (query.trim() === '*') {
      return this.patients;
    }

    const searchTerms = query.toLowerCase().trim().split(' ').filter(term => term.length > 0);
    
    return this.patients.filter(patient => {
      const searchableText = [
        patient.id,
        patient.firstName,
        patient.lastName,
        patient.dateOfBirth.toLocaleDateString(),
        patient.insuranceProvider,
        patient.primaryPhysician,
        patient.bloodType,
        ...(patient.allergies || [])
      ].filter(Boolean).join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  async updatePatient(updatedPatient: Patient): Promise<void> {
    await this.initialize();
    const index = this.patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
      this.patients[index] = updatedPatient;
      // In a real app, we would make an API call here
      await mockDataService.updatePatient(updatedPatient);
    }
  }
}

export const patientService = new PatientService();
