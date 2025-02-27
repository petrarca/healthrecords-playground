import { Patient } from '../types/types';
import { getClient } from '../lib/supabase';
import { PatientTable } from '../models/databaseModel';
import { mapDatabaseToPatient, mapPatientToDatabase } from './mappers/patientMapper';

class PatientService {
  async getPatient(id: string): Promise<Patient | null> {
    const { data, error } = await getClient()
      .from('patients')
      .select()
      .eq('id', id)
      .limit(1) as { data: PatientTable[] | null, error: Error | null };

    if (error) {
      throw new Error(`Failed to fetch patient: ${error.message}`);
    }

    if (!data?.length) {
      return null;
    }

    return mapDatabaseToPatient(data[0]);
  }

  async updatePatient(updatedPatient: Patient): Promise<void> {
    const { error } = await getClient()
      .from('patients')
      .update(mapPatientToDatabase(updatedPatient))
      .eq('id', updatedPatient.patientId);

    if (error) {
      throw new Error(`Failed to update patient: ${error.message}`);
    }
  }

  async updatePrimaryAddress(id: string, addressId: string | null): Promise<void> {
    const { error } = await getClient()
      .from('patients')
      .update({ primary_address: addressId })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update patient's primary address: ${error.message}`);
    }
  }
}

export const patientService = new PatientService();
