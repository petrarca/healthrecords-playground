import { Address } from '../types/address';
import { getClient } from '../lib/supabase';
import { AddressTable } from '../models/databaseModel';
import { mapDatabaseToAddress, mapAddressToDatabase } from './mappers/addressMapper';

class AddressService {
  async getAddresses(patientId: string): Promise<Address[]> {
    const { data, error } = await getClient()
      .from('addresses')
      .select()
      .eq('patient_id', patientId)
      .order('created_at') as { data: AddressTable[] | null, error: Error | null };

    if (error) {
      throw new Error(`Failed to fetch addresses: ${error.message}`);
    }

    if (!data?.length) {
      return [];
    }

    return data.map(mapDatabaseToAddress);
  }

  async createAddress(patientId: string, address: Address): Promise<Address> {
    const { data, error } = await getClient()
      .from('addresses')
      .insert(mapAddressToDatabase(address, patientId))
      .select()
      .single() as { data: AddressTable | null, error: Error | null };

    if (error) {
      throw new Error(`Failed to create address: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned after creating address');
    }

    return mapDatabaseToAddress(data);
  }

  async updateAddress(id: string, patientId: string, address: Address): Promise<Address> {
    const { data, error } = await getClient()
      .from('addresses')
      .update(mapAddressToDatabase(address, patientId))
      .eq('id', id)
      .eq('patient_id', patientId) // Extra safety check
      .select()
      .single() as { data: AddressTable | null, error: Error | null };

    if (error) {
      throw new Error(`Failed to update address: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned after updating address');
    }

    return mapDatabaseToAddress(data);
  }

  async deleteAddress(id: string, patientId: string): Promise<void> {
    const { error } = await getClient()
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('patient_id', patientId); // Extra safety check

    if (error) {
      console.error('Database error deleting address:', error);
      throw new Error(`Failed to delete address: ${error.message}`);
    }
  }
}

export const addressService = new AddressService();
