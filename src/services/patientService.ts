import { Patient } from '../types';
import { mockPatients } from './mockData';

export class PatientService {
  static async getPatient(id: string): Promise<Patient> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const patient = mockPatients[id];
    if (!patient) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    
    return {
      ...patient,
      dateOfBirth: new Date(patient.dateOfBirth) // Ensure date is properly instantiated
    };
  }
}
