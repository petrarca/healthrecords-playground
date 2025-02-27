import { Patient, Gender } from '../../types/types';
import { PatientTable } from '../../models/databaseModel';

function mapDbGenderToPatientGender(gender: string | null): Gender {
  if (!gender) return 'unknown';
  switch (gender) {
    case 'male':
    case 'female':
    case 'other':
      return gender;
    default:
      return 'unknown';
  }
}

export function mapDatabaseToPatient(data: PatientTable): Patient {
  return {
    id: data.id,
    patientId: data.patient_id,
    firstName: data.first_name,
    lastName: data.last_name,
    dateOfBirth: new Date(data.date_of_birth),
    gender: mapDbGenderToPatientGender(data.gender),
    bloodType: data.blood_type ?? undefined,
    height: data.height ?? undefined,
    weight: data.weight ?? undefined,
    primaryPhysician: data.primary_physician ?? undefined,
    insuranceProvider: data.insurance_provider ?? undefined,
    insuranceNumber: data.insurance_number ?? undefined,
    primaryAddress: data.primary_address ?? undefined,
    phone: data.phone ?? undefined,
    email: data.email ?? undefined,
    conditions: data.conditions ?? [],
    allergies: data.allergies ?? [],
  };
}

export function mapPatientToDatabase(patient: Patient): Omit<PatientTable, 'id' | 'created_at' | 'updated_at'> {
  return {
    patient_id: patient.patientId,
    first_name: patient.firstName,
    last_name: patient.lastName,
    date_of_birth: patient.dateOfBirth.toISOString().split('T')[0],
    gender: patient.gender,
    blood_type: patient.bloodType ?? null,
    height: patient.height ?? null,
    weight: patient.weight ?? null,
    primary_physician: patient.primaryPhysician ?? null,
    insurance_provider: patient.insuranceProvider ?? null,
    insurance_number: patient.insuranceNumber ?? null,
    primary_address: patient.primaryAddress ?? null,
    phone: patient.phone ?? null,
    email: patient.email ?? null,
    conditions: patient.conditions ?? [],
    allergies: patient.allergies ?? [],
  };
}
