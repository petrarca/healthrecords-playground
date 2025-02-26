export type AddressType = 'HOME' | 'WORK' | 'OTHER';

export interface Address {
  addressType: AddressType;
  addressLine: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

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
  addresses: Address[];
  primaryAddressType?: AddressType;
  phone?: string;
  email?: string;
}
