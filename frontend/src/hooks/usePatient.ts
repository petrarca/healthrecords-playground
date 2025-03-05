import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Patient } from '../types/types';
import { patientService } from '../services/patientService';
import { searchPatients } from '../services/search//patientSearch';

export const usePatient = (patientId: string) => {
  return useQuery<Patient | null>({
    queryKey: ['patient', patientId],
    queryFn: () => patientService.getPatient(patientId),
    gcTime: 0,
  });
};

export const useSearchPatients = (query: string) => {
  return useQuery<Patient[]>({
    queryKey: ['patients', 'search', query],
    queryFn: () => searchPatients(query),
    enabled: !!query,
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patient: Patient) => patientService.updatePatient(patient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient'] });
    },
  });
};

export const useUpdatePrimaryAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, addressId }: { patientId: string; addressId: string | null }) => 
      patientService.updatePrimaryAddress(patientId, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient'] });
    },
  });
};
