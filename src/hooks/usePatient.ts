import { useQuery } from '@tanstack/react-query';
import { Patient } from '../types/types';
import { patientService } from '../services/patientService';

export const usePatient = (patientId: string) => {
  return useQuery<Patient | undefined>({
    queryKey: ['patient', patientId],
    queryFn: () => patientService.getPatient(patientId),
    gcTime: 0,
  });
};

export const useSearchPatients = (query: string) => {
  return useQuery<Patient[]>({
    queryKey: ['patients', 'search', query],
    queryFn: () => patientService.searchPatients(query),
    enabled: !!query,
  });
};
