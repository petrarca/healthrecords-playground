import { MedicalRecordType, MedicalRecordTypeMetaData, FieldMetaData } from '../types/medicalRecord';

export class MetadataService {
  private readonly typeMetadata: Record<MedicalRecordType, MedicalRecordTypeMetaData> = {
    [MedicalRecordType.DIAGNOSIS]: {
      type: MedicalRecordType.DIAGNOSIS,
      name: 'Diagnosis',
      description: 'Medical condition or disease diagnosed by a healthcare provider',
      icon: 'stethoscope',
      fields: {
        condition: {
          label: 'Condition',
          description: 'The diagnosed medical condition',
          type: 'string',
          required: false
        },
        severity: {
          label: 'Severity',
          description: 'The severity level of the condition',
          type: 'enum',
          enumValues: ['Mild', 'Moderate', 'Severe'],
          required: false
        },
        status: {
          label: 'Status',
          description: 'Current status of the diagnosis',
          type: 'enum',
          enumValues: ['Active', 'Resolved', 'Recurring'],
          required: false
        }
      }
    },
    [MedicalRecordType.LAB_RESULT]: {
      type: MedicalRecordType.LAB_RESULT,
      name: 'Lab Result',
      description: 'Results from laboratory tests and medical examinations',
      icon: 'microscope',
      fields: {
        test_name: {
          label: 'Test Name',
          description: 'Name of the laboratory test',
          type: 'string',
          required: false
        },
        value: {
          label: 'Value',
          description: 'Numerical result of the test',
          type: 'number',
          required: false
        },
        unit: {
          label: 'Unit',
          description: 'Unit of measurement',
          type: 'string',
          required: false
        },
        reference_range: {
          label: 'Reference Range',
          description: 'Normal range for this test result',
          type: 'string',
          required: false
        }
      }
    },
    [MedicalRecordType.MEDICATION]: {
      type: MedicalRecordType.MEDICATION,
      name: 'Medication',
      description: 'Prescribed or over-the-counter medications',
      icon: 'pill',
      fields: {
        name: {
          label: 'Medication Name',
          description: 'Name of the medication',
          type: 'string',
          required: false
        },
        dosage: {
          label: 'Dosage',
          description: 'Amount of medication to be taken',
          type: 'string',
          required: false
        },
        frequency: {
          label: 'Frequency',
          description: 'How often to take the medication',
          type: 'string',
          required: false
        },
        duration: {
          label: 'Duration',
          description: 'How long to take the medication',
          type: 'string',
          required: false
        }
      }
    },
    [MedicalRecordType.VITAL_SIGNS]: {
      type: MedicalRecordType.VITAL_SIGNS,
      name: 'Vital Signs',
      description: 'Basic measurements of body function',
      icon: 'activity',
      fields: {
        blood_pressure: {
          label: 'Blood Pressure',
          description: 'Systolic/Diastolic blood pressure reading',
          type: 'string',
          pattern: '\\d{2,3}\\/\\d{2,3}',
          required: false
        },
        heart_rate: {
          label: 'Heart Rate',
          description: 'Heart beats per minute',
          type: 'number',
          validation: {
            min: 30,
            max: 250
          },
          required: false
        },
        temperature: {
          label: 'Temperature',
          description: 'Body temperature',
          type: 'number',
          validation: {
            min: 35,
            max: 43
          },
          required: false
        },
        respiratory_rate: {
          label: 'Respiratory Rate',
          description: 'Breaths per minute',
          type: 'number',
          validation: {
            min: 8,
            max: 40
          },
          required: false
        }
      }
    },
    [MedicalRecordType.COMPLAINT]: {
      type: MedicalRecordType.COMPLAINT,
      name: 'Complaint',
      description: 'Patient-reported symptoms or health concerns',
      icon: 'alert-circle',
      fields: {
        symptom: {
          label: 'Symptom',
          description: 'The primary symptom or complaint',
          type: 'string',
          required: false
        },
        severity: {
          label: 'Severity',
          description: 'How severe the symptom is',
          type: 'enum',
          enumValues: ['Mild', 'Moderate', 'Severe'],
          required: false
        },
        duration: {
          label: 'Duration',
          description: 'How long the symptom has been present',
          type: 'string',
          required: false
        }
      }
    }
  };

  getMetaDataForType(type: MedicalRecordType): MedicalRecordTypeMetaData {
    const metadata = this.typeMetadata[type];
    if (!metadata) {
      throw new Error(`No metadata found for type: ${type}`);
    }
    return metadata;
  }

  getTypeName(type: MedicalRecordType): string {
    return this.typeMetadata[type]?.name || type;
  }

  getTypeDescription(type: MedicalRecordType): string {
    return this.typeMetadata[type]?.description || '';
  }

  getTypeIcon(type: MedicalRecordType): string | undefined {
    return this.typeMetadata[type]?.icon;
  }

  getFieldMetadata(type: MedicalRecordType, fieldName: string): FieldMetaData | undefined {
    return this.typeMetadata[type]?.fields[fieldName];
  }

  getAllTypes(): MedicalRecordType[] {
    return Object.keys(this.typeMetadata) as MedicalRecordType[];
  }
}

export const metadataService = new MetadataService();
