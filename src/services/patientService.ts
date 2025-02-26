import { Patient } from '../types/types';
import { getClient } from '../lib/supabase';
import { PatientTable } from '../models/databaseModel';
import { mapDatabaseToPatient } from './mappers/patientMapper';

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
      .update({
        first_name: updatedPatient.firstName,
        last_name: updatedPatient.lastName,
        date_of_birth: updatedPatient.dateOfBirth.toISOString().split('T')[0],
        gender: updatedPatient.gender,
        blood_type: updatedPatient.bloodType,
        height: updatedPatient.height,
        weight: updatedPatient.weight,
        primary_physician: updatedPatient.primaryPhysician,
        insurance_provider: updatedPatient.insuranceProvider,
        insurance_number: updatedPatient.insuranceNumber,
        primary_address_type: updatedPatient.primaryAddressType,
        phone: updatedPatient.phone,
        email: updatedPatient.email,
        allergies: updatedPatient.allergies,
        updated_at: new Date().toISOString()
      })
      .eq('patient_id', updatedPatient.patientId);

    if (error) {
      throw new Error(`Failed to update patient: ${error.message}`);
    }
  }
}

export const patientService = new PatientService();
