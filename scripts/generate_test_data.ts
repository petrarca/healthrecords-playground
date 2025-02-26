import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

interface Patient {
    patientId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    bloodType: string;
    height: string;
    weight: string;
    primaryPhysician: string;
    insuranceProvider: string;
    insuranceNumber: string;
    primaryAddressType: string;
    phone: string;
    email: string;
    conditions: string[];
    allergies: string[];
    addresses: Array<{
        addressType: string;
        addressLine: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }>;
}

interface MedicalRecord {
    recordId: string;
    patientId: string;
    recordedAt: string;
    recordType: string;
    title: string;
    description: string;
    details: Record<string, unknown>;
}

interface PatientsData {
    patients: Patient[];
}

interface MedicalRecordsData {
    records: MedicalRecord[];
}

// Define SQL templates
const templates = {
    cleanup: `
-- Clean up existing data
TRUNCATE TABLE patients CASCADE;`,

    patient: `
INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), :patientId, :firstName, :lastName, :dateOfBirth,
    :gender, :bloodType, :height, :weight, :primaryPhysician,
    :insuranceProvider, :insuranceNumber, :primaryAddressType,
    :phone, :email, :conditions, :allergies
);`,
    
    address: `
INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = :patientId),
    :addressType, :addressLine, :street, :city, :state, :zipCode, :country
);`,
    
    medicalRecord: `
INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    :recordId,
    (SELECT id FROM patients WHERE patient_id = :patientId),
    :recordType,
    :recordedAt,
    :title,
    :description,
    :details::jsonb
);`
};

// Helper function to escape SQL string values
function escapeSqlString(str: string | null | undefined): string {
    if (str === null || str === undefined) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

// Helper function to format array values
function formatArrayValues(arr: string[]): string {
    if (arr.length === 0) {
        return "ARRAY[]::varchar[]";
    }
    return `ARRAY[${arr.map(v => `${escapeSqlString(v)}`).join(', ')}]::varchar[]`;
}

// Process patient data
function generatePatientSql(patient: Patient): string {
    const sql = templates.patient
        .replace(':patientId', escapeSqlString(patient.patientId))
        .replace(':firstName', escapeSqlString(patient.firstName))
        .replace(':lastName', escapeSqlString(patient.lastName))
        .replace(':dateOfBirth', escapeSqlString(patient.dateOfBirth))
        .replace(':gender', escapeSqlString(patient.gender))
        .replace(':bloodType', escapeSqlString(patient.bloodType))
        .replace(':height', escapeSqlString(patient.height))
        .replace(':weight', escapeSqlString(patient.weight))
        .replace(':primaryPhysician', escapeSqlString(patient.primaryPhysician))
        .replace(':insuranceProvider', escapeSqlString(patient.insuranceProvider))
        .replace(':insuranceNumber', escapeSqlString(patient.insuranceNumber))
        .replace(':primaryAddressType', escapeSqlString(patient.primaryAddressType))
        .replace(':phone', escapeSqlString(patient.phone))
        .replace(':email', escapeSqlString(patient.email))
        .replace(':conditions', formatArrayValues(patient.conditions))
        .replace(':allergies', formatArrayValues(patient.allergies));

    let fullSql = sql;

    // Add addresses if present
    if (patient.addresses && Array.isArray(patient.addresses)) {
        patient.addresses.forEach((addr) => {
            const addressSql = templates.address
                .replace(':patientId', escapeSqlString(patient.patientId))
                .replace(':addressType', escapeSqlString(addr.addressType))
                .replace(':addressLine', escapeSqlString(addr.addressLine))
                .replace(':street', escapeSqlString(addr.street))
                .replace(':city', escapeSqlString(addr.city))
                .replace(':state', escapeSqlString(addr.state))
                .replace(':zipCode', escapeSqlString(addr.zipCode))
                .replace(':country', escapeSqlString(addr.country));
            fullSql += '\n' + addressSql;
        });
    }

    return fullSql;
}

// Process medical record data
function generateMedicalRecordSql(record: MedicalRecord): string {
    return templates.medicalRecord
        .replace(':recordId', escapeSqlString(record.recordId))
        .replace(':patientId', escapeSqlString(record.patientId))
        .replace(':recordType', escapeSqlString(record.recordType))
        .replace(':recordedAt', escapeSqlString(record.recordedAt))
        .replace(':title', escapeSqlString(record.title))
        .replace(':description', escapeSqlString(record.description))
        .replace(':details', escapeSqlString(JSON.stringify(record.details)));
}

// Main function to generate all SQL
async function generateTestData() {
    // Read input files
    const patientsData = JSON.parse(fs.readFileSync(
        path.join(fileURLToPath(import.meta.url), '../../public/data/patients.json'), 'utf8'
    )) as PatientsData;
    const medicalRecordsData = JSON.parse(fs.readFileSync(
        path.join(fileURLToPath(import.meta.url), '../../public/data/medical_records.json'), 'utf8'
    )) as MedicalRecordsData;

    // Generate SQL statements
    const sqlStatements = [
        '-- Generated test data SQL',
        '-- Generated at: ' + new Date().toISOString(),
        '',
        '-- Begin transaction',
        'BEGIN;',
        '',
        '-- Cleanup existing data',
        templates.cleanup,
        '',
        '-- Patient data'
    ];

    // Process patients
    patientsData.patients.forEach((patient) => {
        sqlStatements.push(generatePatientSql(patient));
    });

    sqlStatements.push('', '-- Medical records');

    // Process medical records
    medicalRecordsData.records.forEach((record) => {
        sqlStatements.push(generateMedicalRecordSql(record));
    });

    // Add transaction commit
    sqlStatements.push('', 'COMMIT;');

    // Write to output file
    const outputPath = path.join(fileURLToPath(import.meta.url), '../../db/test_data.sql');
    fs.writeFileSync(outputPath, sqlStatements.join('\n'));
    console.log(`SQL file generated at: ${outputPath}`);
}

// Execute the script
generateTestData().catch(console.error);
