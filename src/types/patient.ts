export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  sex: 'M' | 'F' | 'Other';
  bloodType?: string;
  height?: string;
  weight?: string;
  allergies?: string[];
  primaryPhysician?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}
