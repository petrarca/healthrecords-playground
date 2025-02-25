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
      return updatedRecord;
    },
    onSuccess: (updatedRecord) => {
      // Update the cache directly instead of invalidating
      queryClient.setQueryData(['medicalRecords', updatedRecord.patientId], (oldData: MedicalRecord[] | undefined) => {
        if (!oldData) return [updatedRecord];
        return oldData.map(record => record.id === updatedRecord.id ? updatedRecord : record);
      });
      
      // Update any search queries that might contain this record
      queryClient.setQueriesData(
        { queryKey: ['medicalRecords', 'search'] },
        (oldData: MedicalRecord[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(record => record.id === updatedRecord.id ? updatedRecord : record);
        }
      );
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
