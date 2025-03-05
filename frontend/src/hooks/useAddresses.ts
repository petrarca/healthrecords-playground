import { useState, useEffect } from 'react';
import { Address } from '../types/address';
import { addressService } from '../services/addressService';

export function useAddresses(patientId: string | undefined) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAddresses() {
      if (!patientId) {
        setAddresses([]);
        setLoading(false);
        return;
      }

      try {
        const data = await addressService.getAddresses(patientId);
        setAddresses(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch addresses'));
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchAddresses();
  }, [patientId]);

  const createAddress = async (address: Address) => {
    if (!patientId) return;

    try {
      const newAddress = await addressService.createAddress(patientId, address);
      setAddresses(prev => [...prev, newAddress]);
      setError(null);
      return newAddress;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create address'));
      throw err;
    }
  };

  const updateAddress = async (id: string, address: Address) => {
    if (!patientId) return;

    try {
      const updatedAddress = await addressService.updateAddress(id, patientId, address);
      setAddresses(prev => prev.map(addr => addr.id === id ? updatedAddress : addr));
      setError(null);
      return updatedAddress;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update address'));
      throw err;
    }
  };

  const deleteAddress = async (id: string) => {
    if (!patientId) {
      console.error('Cannot delete address: No patient ID provided');
      return;
    }

    try {
      await addressService.deleteAddress(id, patientId);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      setError(null);
    } catch (err) {
      console.error('Failed to delete address:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete address'));
      throw err;
    }
  };

  return {
    addresses,
    loading,
    error,
    createAddress,
    updateAddress,
    deleteAddress
  };
}
