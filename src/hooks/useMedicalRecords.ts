import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedRecord: MedicalRecord) => {
      await medicalRecordService.updateRecord(updatedRecord);
    },
    onSuccess: (_, updatedRecord) => {
      // Invalidate the patient's records query
      queryClient.invalidateQueries({
        queryKey: ['medicalRecords', updatedRecord.patientId],
      });
      // Invalidate any search queries
      queryClient.invalidateQueries({
        queryKey: ['medicalRecords', 'search'],
      });
    },
  });
};

export const useAddMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRecord: MedicalRecord) => {
      await medicalRecordService.addRecord(newRecord);
    },
    onSuccess: (_, newRecord) => {
      // Invalidate the patient's records query
      queryClient.invalidateQueries({
        queryKey: ['medicalRecords', newRecord.patientId],
      });
      // Invalidate any search queries
      queryClient.invalidateQueries({
        queryKey: ['medicalRecords', 'search'],
      });
    },
  });
};
