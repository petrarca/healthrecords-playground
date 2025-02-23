import { Patient, MedicalRecord } from '../types/types';

export const mockPatients: Record<string, Patient> = {
  '4711': {
    id: '4711',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1980-05-15'),
    sex: 'M',
    bloodType: 'O+',
    height: '180cm',
    weight: '70kg',
    allergies: ['Penicillin'],
    primaryPhysician: 'Dr. Sarah Wilson',
    insuranceProvider: 'Blue Cross',
    insuranceNumber: 'BC123456'
  },
  '4712': {
    id: '4712',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: new Date('1992-08-22'),
    sex: 'F',
    bloodType: 'A+',
    height: '165cm',
    weight: '58kg',
    allergies: ['None'],
    primaryPhysician: 'Dr. Emily Chen',
    insuranceProvider: 'Aetna',
    insuranceNumber: 'AE234567'
  },
  '4713': {
    id: '4713',
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: new Date('1975-12-03'),
    sex: 'M',
    bloodType: 'B-',
    height: '175cm',
    weight: '82kg',
    allergies: ['Sulfa drugs'],
    primaryPhysician: 'Dr. James Wilson',
    insuranceProvider: 'United Healthcare',
    insuranceNumber: 'UH345678'
  }
};

export const mockMedicalRecords: Record<string, MedicalRecord[]> = {
  '4711': [
    {
      id: 'M1',
      patientId: '4711',
      date: new Date('2025-02-15T09:30:00'),
      type: 'vital_signs',
      title: 'Annual Check-up',
      description: 'Regular health check-up. Blood pressure normal. Weight stable.',
      details: {
        'bloodPressure': '120/80',
        'weight': '70',
        'temperature': '36.6'
      }
    },
    {
      id: 'M2',
      patientId: '4711',
      date: new Date('2025-02-15T10:15:00'),
      type: 'lab_result',
      title: 'Blood Work Results',
      description: 'Complete blood count and metabolic panel. All results within normal range.',
      details: {
        'wbc': '7.2',
        'rbc': '4.8',
        'platelets': '250'
      }
    },
    {
      id: 'M3',
      patientId: '4711',
      date: new Date('2025-01-10T14:20:00'),
      type: 'vital_signs',
      title: 'Vital Signs Check',
      description: 'Routine vital signs monitoring during clinic visit.',
      details: {
        'heartRate': '72',
        'spO2': '98',
        'respiratoryRate': '16'
      }
    }
  ],
  '4712': [
    {
      id: 'M4',
      patientId: '4712',
      date: new Date('2025-02-20T11:00:00'),
      type: 'complaint',
      title: 'Lower Back Pain',
      description: 'Patient reports persistent lower back pain, particularly when bending or sitting for long periods.',
      details: {
        'painLevel': '6',
        'duration': '14',
        'location': 'Lower lumbar'
      }
    },
    {
      id: 'M5',
      patientId: '4712',
      date: new Date('2025-01-05T15:30:00'),
      type: 'diagnosis',
      title: 'Follow-up Visit',
      description: 'Follow-up for previous treatment. Recovery progressing well.'
    }
  ],
  '4713': [
    {
      id: 'M6',
      patientId: '4713',
      date: new Date('2025-02-10T13:45:00'),
      type: 'lab_result',
      title: 'Lipid Panel',
      description: 'Cholesterol and triglycerides screening. Results show normal levels.',
      details: {
        'totalCholesterol': '180',
        'hdl': '55',
        'ldl': '110'
      }
    },
    {
      id: 'M7',
      patientId: '4713',
      date: new Date('2025-01-20T09:00:00'),
      type: 'complaint',
      title: 'Shoulder Discomfort',
      description: 'Patient experiencing right shoulder discomfort during overhead movements.',
      details: {
        'painLevel': '4',
        'movement': 'Limited',
        'side': 'Right'
      }
    }
  ]
};
