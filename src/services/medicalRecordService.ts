import { MedicalRecord, MedicalRecordType } from '../types/types';
import { generateShortId } from '../lib/utils';
import { getClient } from '../lib/supabase';
import { MedicalRecordTable } from '../models/databaseModel';

interface CreateMedicalRecordParams {
  patientId: string;
  type: MedicalRecordType;
  title?: string;
  description?: string;
  details?: Record<string, string | number>;
}

class MedicalRecordService {

  async getPatientRecords(patientId: string): Promise<MedicalRecord[]> {    
    const { data, error } = await getClient()
      .from('medical_records')
      .select()
      .eq('patient_id', patientId) as { data: MedicalRecordTable[] | null, error: Error | null };

    if (error) {
      throw new Error(`Failed to fetch medical records: ${error.message}`);
    }

    return (data || []).map(record => ({
      id: record.record_id,
      recordId: record.record_id,
      patientId: record.patient_id,
      recordType: record.record_type as MedicalRecordType,
      recordedAt: new Date(record.recorded_at),
      title: record.title,
      description: record.description,
      details: record.details
    }));
  }

  async updateRecord(updatedRecord: MedicalRecord): Promise<void> {
    const { error } = await getClient()
      .from('medical_records')
      .update({
        record_type: updatedRecord.recordType,
        title: updatedRecord.title,
        description: updatedRecord.description,
        details: updatedRecord.details,
        updated_at: new Date().toISOString()
      })
      .eq('record_id', updatedRecord.recordId);

    if (error) {
      throw new Error(`Failed to update medical record: ${error.message}`);
    }
  }

  async addRecord(newRecord: MedicalRecord): Promise<void> {
    const { error } = await getClient()
      .from('medical_records')
      .insert({
        record_id: newRecord.recordId,
        patient_id: newRecord.patientId,
        record_type: newRecord.recordType,
        recorded_at: newRecord.recordedAt.toISOString(),
        title: newRecord.title,
        description: newRecord.description,
        details: newRecord.details
      });

    if (error) {
      throw new Error(`Failed to add medical record: ${error.message}`);
    }
  }

  createRecord(params: CreateMedicalRecordParams): MedicalRecord {
    return {
      id: generateShortId(),
      recordId: generateShortId(),
      patientId: params.patientId,
      recordType: params.type,
      recordedAt: new Date(),
      title: params.title ?? '',
      description: params.description ?? '',
      details: params.details ?? {}
    };
  }
}

export const medicalRecordService = new MedicalRecordService();
