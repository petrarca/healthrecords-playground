export type AddressType = 'HOME' | 'WORK' | 'OTHER';

export interface Address {
  label: AddressType;
  addressLine: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

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
  addresses: Address[];
  primaryAddressType?: AddressType;
  phone?: string;
  email?: string;
}
