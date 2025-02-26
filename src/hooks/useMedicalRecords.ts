import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MedicalRecord } from '../types/types';
import { medicalRecordService } from '../services/medicalRecordService';

export const useMedicalRecords = (patientId: string) => {
  return useQuery<MedicalRecord[]>({
    queryKey: ['medicalRecords', patientId],
    queryFn: () => medicalRecordService.getPatientRecords(patientId),
    //gcTime: 0,
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
      // Update the specific record in the cache
      queryClient.setQueryData<MedicalRecord[]>(['medicalRecords', updatedRecord.patientId], (oldRecords) => {
        if (!oldRecords) return oldRecords;
        return oldRecords.map(record => 
          record.id === updatedRecord.id ? updatedRecord : record
        );
      });
    },
  });
};

export const useAddMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRecord: MedicalRecord) => {
      await medicalRecordService.addRecord(newRecord);
      return newRecord;
    },
    onSuccess: (newRecord) => {
      // Update the cache by appending the new record to existing data
      queryClient.setQueryData<MedicalRecord[]>(['medicalRecords', newRecord.patientId], (oldData) => {
        return oldData ? [...oldData, newRecord] : [newRecord];
      });
    },
  });
};
