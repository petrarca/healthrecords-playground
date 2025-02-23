import { Patient, MedicalRecord } from '../types/types';

export async function loadCSVData() {
  try {
    // Load patients
    const patientsResponse = await fetch('/data/patients.csv');
    const patientsText = await patientsResponse.text();
    const patients = parseCSV(patientsText).map(row => ({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      dateOfBirth: new Date(row.dateOfBirth),
      gender: row.gender,
      bloodType: row.bloodType,
      allergies: row.allergies === 'None' ? [] : row.allergies.split(', '),
      insurance: row.insurance
    })) as Patient[];

    // Load medical records
    const recordsResponse = await fetch('/data/medical_records.csv');
    const recordsText = await recordsResponse.text();
    const records = parseCSV(recordsText).map(row => ({
      id: row.id,
      patientId: row.patientId,
      date: new Date(row.date),
      type: row.type as 'diagnosis' | 'lab_result' | 'complaint' | 'vital_signs',
      title: row.title,
      description: row.description,
      details: row.details ? JSON.parse(row.details) : undefined
    })) as MedicalRecord[];

    return { patients, records };
  } catch (error) {
    console.error('Error loading CSV data:', error);
    throw error;
  }
}

function parseCSV(csv: string): any[] {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',');
    const obj: { [key: string]: string } = {};
    
    headers.forEach((header, index) => {
      let value = values[index];
      // Handle quoted values (e.g., for allergies with commas)
      if (value?.startsWith('"') && !value.endsWith('"')) {
        while (!values[index].endsWith('"') && index < values.length) {
          index++;
          value += ',' + values[index];
        }
        value = value.slice(1, -1); // Remove quotes
      }
      obj[header.trim()] = value?.trim() ?? '';
    });
    
    return obj;
  });
}
