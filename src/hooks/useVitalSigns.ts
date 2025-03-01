import { useState, useEffect, useCallback } from 'react';
import { MedicalRecord, MedicalRecordType } from '../types/medicalRecord';
import { medicalRecordService } from '../services/medicalRecordService';

/**
 * Hook for fetching vital signs data for a patient
 * @param patientId The ID of the patient
 * @returns Object containing vital signs data, loading state, error state, and a refetch function
 */
export const useVitalSigns = (patientId: string) => {
  const [data, setData] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVitalSigns = useCallback(async () => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const vitalSignsData = await medicalRecordService.getPatientRecordsByType(patientId, MedicalRecordType.VITAL_SIGNS);
      setData(vitalSignsData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching vital signs:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchVitalSigns();
  }, [fetchVitalSigns]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchVitalSigns
  };
};
