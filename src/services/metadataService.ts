import { MedicalRecordType, MedicalRecordTypeMetaData, FieldMetaData, QuantityValue } from '../types/medicalRecord';

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
        panel_name: {
          label: 'Panel Name',
          description: 'Name of the lab result panel',
          type: 'string',
          required: false
        },
        components: {
          label: 'Components',
          description: 'Components of lab result',
          type: 'json',
          required: false,
          rendererType: 'labComponents'
        },
      }
    },
    [MedicalRecordType.MEDICATION]: {
      type: MedicalRecordType.MEDICATION,
      name: 'Medication',
      description: 'Prescribed or over-the-counter medications',
      icon: 'pill',
      fields: {
        medication_name: {
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
        instructions: {
          label: 'Instructions',
          description: 'Specific instructions for taking the medication',
          type: 'string',
          required: false
        },
        for_condition: {
          label: 'For Condition',
          description: 'The medical condition this medication is treating',
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
        heart_rate: {
          label: 'Heart Rate',
          description: 'Heart beats per minute',
          type: 'quantity',
          required: false,
          quantityUnits: [
            { unit: "/min", default: true, validation: { min: 30, max: 250 }},
            { unit: "bpm", validation: { min: 30, max: 250 }}
          ],
          quantityType: 'number',
          precision: 0,
        },
        temperature: {
          label: 'Temperature',
          description: 'Body temperature',
          type: 'quantity',
          required: false,
          quantityUnits: [
            { unit: "degC", default: true, validation: { min: 35, max: 42 }, display_name: "°C" },
            { unit: "degF", validation: { min: 95, max: 108 }, display_name: "°F" }
          ],
          quantityType: 'number',
          precision: 1,
        },
        blood_pressure: {
          label: 'Blood Pressure',
          description: 'Systolic/diastolic blood pressure',
          type: 'quantity',
          required: false,
          quantityUnits: [
            { unit: "mmHg", default: true }
          ],
          quantityType: 'string',
        },
        respiratory_rate: {
          label: 'Respiratory Rate',
          description: 'Breaths per minute',
          type: 'quantity',
          required: false,
          quantityUnits: [
            { unit: "/min", default: true, validation: { min: 8, max: 40 }}
          ],
          quantityType: 'number',
          precision: 0
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
    },
    [MedicalRecordType.PROCEDURE]: {
      type: MedicalRecordType.PROCEDURE,
      name: 'Procedure',
      description: 'Medical procedures performed on the patient',
      icon: 'activity',
      fields: {
        procedure_type: {
          label: 'Procedure Type',
          description: 'The type of medical procedure performed',
          type: 'string',
          required: false
        },
        findings: {
          label: 'Findings',
          description: 'Results or observations from the procedure',
          type: 'string',
          required: false
        },
        recommendations: {
          label: 'Recommendations',
          description: 'Suggested follow-up actions or treatments',
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
    return this.typeMetadata[type]?.name ?? type;
  }

  getTypeDescription(type: MedicalRecordType): string {
    return this.typeMetadata[type]?.description ?? '';
  }

  getTypeIcon(type: MedicalRecordType): string | undefined {
    return this.typeMetadata[type]?.icon;
  }

  getFieldMetadata(recordType: MedicalRecordType, fieldName: string): FieldMetaData | undefined {
    const typeMetadata = this.typeMetadata[recordType];
    if (!typeMetadata) {
      return undefined;
    }
    return typeMetadata.fields[fieldName];
  }

  formatQuantity(value: number | string, unit?: string, fieldMetadata?: FieldMetaData): string {
    // Apply precision if specified and value is a number
    let formattedValue = value;
    if (typeof value === 'number' && fieldMetadata?.precision !== undefined) {
      formattedValue = value.toFixed(fieldMetadata.precision);
    }
    
    // Add unit if provided or available from metadata
    if (unit) {
      return `${formattedValue} ${unit}`;
    } else if (fieldMetadata && fieldMetadata.type === 'quantity') {
      if (fieldMetadata.quantityUnits?.length) {
        const defaultUnit = fieldMetadata.quantityUnits.find(u => u.default) || fieldMetadata.quantityUnits[0];
        return `${formattedValue} ${defaultUnit.unit}`;
      } else if (fieldMetadata.defaultUnit) {
        return `${formattedValue} ${fieldMetadata.defaultUnit}`;
      }
    }
    
    return `${formattedValue}`;
  }

  parseQuantity(quantityString: string, fieldMetadata?: FieldMetaData): { value: number | string; unit: string } | null {
    // Simple regex to extract value and unit
    const regex = /^([\d.-]+)\s*(.*)$/;
    const match = regex.exec(quantityString);
    if (!match) {
      return null;
    }
    
    const [, valueStr, unitStr] = match;
    
    // Determine value type based on field metadata
    let value: number | string = valueStr;
    if (fieldMetadata?.type === 'quantity') {
      if (fieldMetadata.quantityType === 'number') {
        const numValue = parseFloat(valueStr);
        if (!isNaN(numValue)) {
          // Apply precision if specified
          if (fieldMetadata.precision !== undefined) {
            value = Number(numValue.toFixed(fieldMetadata.precision));
          } else {
            value = numValue;
          }
        }
      }
    }
    
    return { value, unit: unitStr.trim() };
  }

  createQuantityValue(value: number | string, unit?: string, fieldMetadata?: FieldMetaData): QuantityValue {
    if (!fieldMetadata || fieldMetadata.type !== 'quantity') {
      // If no field metadata or not a quantity type, just return as is
      return { value, unit: unit ?? '' };
    }
    
    // Process the value based on type
    const typedValue = this.processQuantityValue(value, fieldMetadata);
    
    // Determine the unit to use
    const finalUnit = this.determineQuantityUnit(unit, fieldMetadata);
    
    return { value: typedValue, unit: finalUnit };
  }

  private processQuantityValue(value: number | string, fieldMetadata: FieldMetaData): number | string {
    // If metadata doesn't specify conversion, return as is
    if (!fieldMetadata.quantityType) {
      return value;
    }
    
    // Convert to number if needed
    if (fieldMetadata.quantityType === 'number' && typeof value === 'string') {
      return this.convertStringToNumber(value);
    } 
    
    // Convert to string if needed
    if (fieldMetadata.quantityType === 'string' && typeof value === 'number') {
      return value.toString();
    }
    
    // Return original value if no conversion needed
    return value;
  }

  private convertStringToNumber(value: string): number | string {
    // Handle decimal separator (replace comma with period)
    const normalizedValue = value.replace(',', '.');
    
    // Skip conversion for empty values or partial numeric inputs
    if (normalizedValue === '' || normalizedValue === '.' || 
        normalizedValue === '-' || normalizedValue === '-.') {
      return normalizedValue;
    }
    
    const numValue = parseFloat(normalizedValue);
    return isNaN(numValue) ? value : numValue;
  }

  private determineQuantityUnit(unit: string | undefined, fieldMetadata: FieldMetaData): string {
    // If unit is already provided, use it
    if (unit) {
      return unit;
    }
    
    // Try to find a unit from metadata
    if (fieldMetadata.quantityUnits?.length) {
      // Find the default unit or use the first one
      const defaultUnit = fieldMetadata.quantityUnits.find(u => u.default) || 
                          fieldMetadata.quantityUnits[0];
      return defaultUnit.unit;
    } 
    
    // Fallback to legacy defaultUnit
    if (fieldMetadata.defaultUnit) {
      return fieldMetadata.defaultUnit;
    }
    
    // No unit found
    return '';
  }

  getAllTypes(): MedicalRecordType[] {
    return Object.keys(this.typeMetadata) as MedicalRecordType[];
  }
}

export const metadataService = new MetadataService();
