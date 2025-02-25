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

// Create a map to track occurrences of each ID
const idCounts = new Map<string, number>();

// Fix duplicate IDs
data.records = data.records.map((record: MedicalRecord) => {
    const id = record.id;
    const count = (idCounts.get(id) ?? 0) + 1;
    idCounts.set(id, count);
    
    if (count > 1) {
        // If this is a duplicate, append a unique suffix
        const newId = `${id}_${count}`;
        console.log(`Fixing duplicate ID: ${id} -> ${newId}`);
        return { ...record, id: newId };
    }
    
    return record;
});

// Write the fixed data back to the file
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Fixed all duplicate IDs and saved the file.');
