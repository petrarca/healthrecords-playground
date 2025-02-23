import { Patient, MedicalRecord } from '../types/types';

export const mockPatients: Record<string, Patient> = {
  'P123456': {
    id: "P123456",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: new Date("1980-05-15"),
    sex: "M",
    bloodType: "O+",
    height: "180 cm",
    weight: "75 kg",
    allergies: ["Penicillin", "Pollen"],
    primaryPhysician: "Dr. Sarah Johnson",
    insuranceProvider: "HealthCare Plus",
    insuranceNumber: "HC987654321"
  }
};

export const mockMedicalRecords: Record<string, MedicalRecord[]> = {
  'P123456': [
    {
      id: 'rec1',
      type: 'diagnosis',
      title: 'Annual Physical Examination',
      description: 'Regular checkup shows all vital signs within normal ranges. Blood pressure: 120/80, Heart rate: 72 bpm.',
      date: new Date('2025-02-15T09:30:00'),
      details: {
        'Blood Pressure': '120/80 mmHg',
        'Heart Rate': '72 bpm',
        'Temperature': '98.6°F',
        'Weight': '150 lbs'
      }
    },
    {
      id: 'rec2',
      type: 'lab_result',
      title: 'Complete Blood Count',
      description: 'All blood cell counts within normal ranges. Hemoglobin: 14.2 g/dL, White blood cells: 7.5k/µL.',
      date: new Date('2025-02-15T10:15:00'),
      details: {
        'Hemoglobin': '14.2 g/dL',
        'White Blood Cells': '7.5k/µL',
        'Platelets': '250k/µL'
      }
    },
    {
      id: 'rec3',
      type: 'complaint',
      title: 'Seasonal Allergies',
      description: 'Patient reports increased nasal congestion and sneezing during spring months.',
      date: new Date('2024-04-10T14:20:00'),
      details: {
        'Symptoms': 'Nasal congestion, sneezing',
        'Duration': '2 weeks',
        'Severity': 'Moderate'
      }
    }
  ]
};
