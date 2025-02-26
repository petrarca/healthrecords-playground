import { Patient, AddressType, Gender } from '../../types/types';
import { PatientTable } from '../../models/databaseModel';

function validateAddressType(type: string | null): AddressType | undefined {
  if (!type) return undefined;
  
  // Convert to uppercase to match enum values
  const upperType = type.toUpperCase();
  
  // Check if the type is a valid AddressType
  if (upperType === 'HOME' || upperType === 'WORK' || upperType === 'OTHER') {
    return upperType as AddressType;
  }
  
  return undefined;
}

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
    primaryAddressType: validateAddressType(data.primary_address_type),
    phone: data.phone ?? undefined,
    email: data.email ?? undefined,
    conditions: data.conditions ?? undefined,
    allergies: data.allergies ?? undefined,
    addresses: [] // Note: We'll need to fetch addresses separately if needed
  };
}
