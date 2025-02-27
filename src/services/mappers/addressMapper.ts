import { Address, AddressType } from '../../types/address';
import { AddressTable } from '../../models/databaseModel';

function validateAddressType(type: string): AddressType {
  const upperType = type.toUpperCase();
  if (upperType === 'HOME' || upperType === 'WORK' || upperType === 'OTHER') {
    return upperType as AddressType;
  }
  return 'OTHER';
}

export function mapDatabaseToAddress(data: AddressTable): Address {
  return {
    id: data.id,
    addressType: validateAddressType(data.address_type),
    addressLine: data.address_line,
    street: data.street ?? undefined,
    city: data.city ?? undefined,
    state: data.state ?? undefined,
    zipCode: data.zip_code ?? undefined,
    country: data.country ?? undefined,
  };
}

export function mapAddressToDatabase(address: Address, patientId: string): Omit<AddressTable, 'id' | 'created_at' | 'updated_at'> {
  return {
    patient_id: patientId,
    address_type: address.addressType,
    address_line: address.addressLine ?? '',
    street: address.street ?? null,
    city: address.city ?? null,
    state: address.state ?? null,
    zip_code: address.zipCode ?? null,
    country: address.country ?? null,
  };
}
