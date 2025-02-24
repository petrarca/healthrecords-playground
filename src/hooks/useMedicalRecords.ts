import { useQuery } from '@tanstack/react-query';
import { MedicalRecord } from '../types/types';
import { medicalRecordService } from '../services/medicalRecordService';

export const useMedicalRecords = (patientId: string) => {
  return useQuery<MedicalRecord[]>({
    queryKey: ['medicalRecords', patientId],
    queryFn: () => medicalRecordService.getPatientRecords(patientId),
    gcTime: 0,
  });
};

export const useSearchMedicalRecords = (query: string) => {
  return useQuery<MedicalRecord[]>({
    queryKey: ['medicalRecords', 'search', query],
    queryFn: () => medicalRecordService.searchRecords(query),
    enabled: !!query,
  });
};
