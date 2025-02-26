// Database table types that match our Supabase schema
export interface MedicalRecordTable {
  record_id: string;
  patient_id: string;
  record_type: string;
  recorded_at: string;
  title: string;
  description: string;
  details: Record<string, string | number>;
}

export interface PatientTable {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  blood_type: string | null;
  height: string | null;
  weight: string | null;
  primary_physician: string | null;
  insurance_provider: string | null;
  insurance_number: string | null;
  primary_address_type: string | null;
  phone: string | null;
  email: string | null;
  conditions: string[] | null;
  allergies: string[] | null;
  created_at: string;
  updated_at: string;
}
