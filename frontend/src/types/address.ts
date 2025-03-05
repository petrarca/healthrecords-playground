export interface Address {
  id?: string;
  addressType: AddressType;
  addressLine?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export type AddressType = 'HOME' | 'WORK' | 'OTHER';
