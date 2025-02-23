import { Patient, MedicalRecord } from '../types/types';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  insuranceProvider: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  type: string;
  title: string;
  description: string;
  provider: string;
}

export const mockPatients: Record<string, Patient> = {
  'P123456': {
    id: 'P123456',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1980-05-15',
    insuranceProvider: 'Blue Cross'
  },
  'P234567': {
    id: 'P234567',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1992-08-22',
    insuranceProvider: 'Aetna'
  },
  'P345678': {
    id: 'P345678',
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1975-12-03',
    insuranceProvider: 'United Healthcare'
  }
};

export const mockMedicalRecords: Record<string, MedicalRecord[]> = {
  'P123456': [
    {
      id: 'M1',
      patientId: 'P123456',
      date: '2025-02-15T09:30:00',
      type: 'Consultation',
      title: 'Annual Check-up',
      description: 'Regular health check-up. Blood pressure normal. Weight stable.',
      provider: 'Dr. Sarah Wilson'
    },
    {
      id: 'M2',
      patientId: 'P123456',
      date: '2025-02-15T10:15:00',
      type: 'Lab Test',
      title: 'Blood Work Results',
      description: 'Complete blood count and metabolic panel. All results within normal range.',
      provider: 'Quest Diagnostics'
    },
    {
      id: 'M3',
      patientId: 'P123456',
      date: '2025-01-10T14:20:00',
      type: 'Vaccination',
      title: 'Flu Shot',
      description: 'Annual influenza vaccination administered.',
      provider: 'Dr. Sarah Wilson'
    }
  ],
  'P234567': [
    {
      id: 'M4',
      patientId: 'P234567',
      date: '2025-02-20T11:00:00',
      type: 'Procedure',
      title: 'Dental Cleaning',
      description: 'Routine dental cleaning and examination. No cavities found.',
      provider: 'Dr. Michael Brown'
    },
    {
      id: 'M5',
      patientId: 'P234567',
      date: '2025-01-05T15:30:00',
      type: 'Consultation',
      title: 'Follow-up Visit',
      description: 'Follow-up for previous treatment. Recovery progressing well.',
      provider: 'Dr. Emily Chen'
    }
  ],
  'P345678': [
    {
      id: 'M6',
      patientId: 'P345678',
      date: '2025-02-10T13:45:00',
      type: 'Lab Test',
      title: 'Lipid Panel',
      description: 'Cholesterol and triglycerides screening. Results show normal levels.',
      provider: 'LabCorp'
    },
    {
      id: 'M7',
      patientId: 'P345678',
      date: '2025-01-20T09:00:00',
      type: 'Procedure',
      title: 'Physical Therapy',
      description: 'Lower back rehabilitation exercises and assessment.',
      provider: 'Dr. James Wilson'
    }
  ]
};
