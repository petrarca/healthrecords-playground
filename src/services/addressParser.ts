import { Address } from '../types/patient';

/**
 * Simply stores the full address line and returns an empty object for other fields
 * Example: "Am Eisbach 100, 8000 Munich, Germany"
 */
export function parseAddressString(addressString: string): Partial<Omit<Address, 'label'>> {
  if (!addressString.trim()) {
    return {};
  }
  
  return {
    addressLine: addressString.trim()
  };
}

/**
 * Formats structured address components into a single line string
 */
export function formatAddressToString(address: Omit<Address, 'label'>): string {
  return address.addressLine || '';
}
