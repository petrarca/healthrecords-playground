export type Gender = 'male' | 'female' | 'other' | 'unknown';

export interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodType?: string;
  height?: string;
  weight?: string;
  allergies?: string[];
  conditions?: string[];
  primaryPhysician?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  primaryAddress?: string;
  phone?: string;
  email?: string;
}
