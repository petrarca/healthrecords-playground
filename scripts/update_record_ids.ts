import { generateShortId } from '../src/lib/utils';
import * as fs from 'fs';
import * as path from 'path';

interface MedicalRecord {
    id: string;
    recordId: string;
    patientId: string;
    recordedAt: string;
    recordType: string;
    title: string;
    description: string;
    details: Record<string, unknown>;
}

interface MedicalRecordsData {
    records: MedicalRecord[];
}

const filePath = path.join(__dirname, '../public/data/medical_records.json');

// Read the file
const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as MedicalRecordsData;

// Create a set to track used IDs
const usedIds = new Set<string>();

// Update recordIds with unique IDs
data.records = data.records.map((record: MedicalRecord) => {
    let newRecordId: string;
    do {
        newRecordId = generateShortId();
    } while (usedIds.has(newRecordId));
    
    usedIds.add(newRecordId);
    console.log(`Updating recordId: ${record.recordId} -> ${newRecordId}`);
    
    return {
        ...record,
        recordId: newRecordId
    };
});

// Write the updated data back to the file
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('\nUpdated all recordIds with unique IDs.');

// Verify no duplicates exist
const recordIds = data.records.map((r: MedicalRecord) => r.recordId);
const duplicates = recordIds.filter((id: string, index: number) => recordIds.indexOf(id) !== index);
if (duplicates.length > 0) {
    console.error('Error: Found duplicate recordIds:', duplicates);
} else {
    console.log('Verification: No duplicate recordIds found.');
}
