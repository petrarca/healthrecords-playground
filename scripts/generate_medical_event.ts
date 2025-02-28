import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { subDays, subYears, addDays } from 'date-fns';

// Define interfaces
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

interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  // Other patient properties not needed for this script
}

// Common procedure types for realistic medical data
const procedureTypes = [
  "Colonoscopy",
  "Upper Endoscopy",
  "MRI",
  "CT Scan",
  "X-ray",
  "Ultrasound",
  "ECG/EKG",
  "Cardiac Stress Test",
  "Polysomnography",
  "Bronchoscopy",
  "Cystoscopy",
  "Biopsy",
  "Angiography",
  "Mammography",
  "Bone Density Scan",
  "Arthroscopy",
  "Lumbar Puncture",
  "Cardiac Catheterization",
  "PET Scan",
  "Echocardiogram"
];

// Realistic findings for procedures
const commonFindings = [
  "Normal findings",
  "Mild inflammation",
  "Moderate inflammation",
  "Polyps identified",
  "Small lesion detected",
  "Abnormal tissue growth",
  "Mild stenosis",
  "Moderate stenosis",
  "Severe stenosis",
  "Mild esophagitis",
  "Moderate esophagitis",
  "Hiatal hernia",
  "Mild sleep apnea",
  "Moderate sleep apnea",
  "Severe sleep apnea",
  "Small kidney stone",
  "Multiple kidney stones",
  "Mild arthritis",
  "Moderate arthritis",
  "Severe arthritis",
  "Bone spur",
  "Mild disc herniation",
  "Moderate disc herniation",
  "Severe disc herniation",
  "No significant abnormalities"
];

// Realistic recommendations for procedures
const commonRecommendations = [
  "No follow-up needed",
  "Follow-up in 6 months",
  "Follow-up in 1 year",
  "Follow-up in 3 years",
  "Follow-up in 5 years",
  "Repeat procedure in 1 month",
  "Repeat procedure in 3 months",
  "Refer to specialist",
  "Continue current medication",
  "Adjust medication dosage",
  "Consider surgical intervention",
  "Physical therapy recommended",
  "Dietary modifications recommended",
  "Lifestyle modifications recommended",
  "CPAP therapy recommended",
  "CPAP therapy adjustment",
  "Continue PPI medication",
  "Increase fluid intake",
  "Biopsy recommended",
  "Additional imaging recommended"
];

// Common medical conditions for diagnosis records
const medicalConditions = [
  "Hypertension",
  "Type 2 Diabetes",
  "Asthma",
  "Chronic Obstructive Pulmonary Disease",
  "Coronary Artery Disease",
  "Atrial Fibrillation",
  "Congestive Heart Failure",
  "Osteoarthritis",
  "Rheumatoid Arthritis",
  "Osteoporosis",
  "Chronic Kidney Disease",
  "Gastroesophageal Reflux Disease",
  "Irritable Bowel Syndrome",
  "Crohn's Disease",
  "Ulcerative Colitis",
  "Celiac Disease",
  "Hypothyroidism",
  "Hyperthyroidism",
  "Migraine",
  "Epilepsy",
  "Parkinson's Disease",
  "Multiple Sclerosis",
  "Depression",
  "Anxiety Disorder",
  "Bipolar Disorder",
  "Schizophrenia",
  "Alzheimer's Disease",
  "Obstructive Sleep Apnea",
  "Allergic Rhinitis",
  "Eczema",
  "Psoriasis",
  "Anemia",
  "Deep Vein Thrombosis",
  "Pulmonary Embolism",
  "Glaucoma",
  "Macular Degeneration",
  "Cataracts",
  "Hearing Loss",
  "Meniere's Disease",
  "Gout"
];

// Severity levels for diagnoses and complaints - aligned with metadataService.ts
const severityLevels = ["Mild", "Moderate", "Severe"];

// Status options for diagnoses - aligned with metadataService.ts
const statusOptions = ["Active", "Resolved", "Recurring"];

// Common medications with their typical dosages and frequencies
const medications = [
  { name: "Lisinopril", dosages: ["5mg", "10mg", "20mg", "40mg"], frequencies: ["once daily", "twice daily"] },
  { name: "Metformin", dosages: ["500mg", "850mg", "1000mg"], frequencies: ["once daily", "twice daily", "with meals"] },
  { name: "Atorvastatin", dosages: ["10mg", "20mg", "40mg", "80mg"], frequencies: ["once daily", "at bedtime"] },
  { name: "Levothyroxine", dosages: ["25mcg", "50mcg", "75mcg", "88mcg", "100mcg", "112mcg", "125mcg", "150mcg"], frequencies: ["once daily", "in the morning"] },
  { name: "Amlodipine", dosages: ["2.5mg", "5mg", "10mg"], frequencies: ["once daily"] },
  { name: "Metoprolol", dosages: ["25mg", "50mg", "100mg", "200mg"], frequencies: ["once daily", "twice daily"] },
  { name: "Omeprazole", dosages: ["10mg", "20mg", "40mg"], frequencies: ["once daily", "before breakfast"] },
  { name: "Albuterol", dosages: ["90mcg/actuation"], frequencies: ["as needed", "every 4-6 hours as needed"] },
  { name: "Gabapentin", dosages: ["100mg", "300mg", "400mg", "600mg", "800mg"], frequencies: ["three times daily", "at bedtime"] },
  { name: "Hydrochlorothiazide", dosages: ["12.5mg", "25mg", "50mg"], frequencies: ["once daily", "in the morning"] },
  { name: "Sertraline", dosages: ["25mg", "50mg", "100mg"], frequencies: ["once daily", "in the morning"] },
  { name: "Montelukast", dosages: ["10mg"], frequencies: ["once daily", "at bedtime"] },
  { name: "Losartan", dosages: ["25mg", "50mg", "100mg"], frequencies: ["once daily", "twice daily"] },
  { name: "Fluticasone", dosages: ["50mcg/actuation", "100mcg/actuation", "200mcg/actuation"], frequencies: ["twice daily", "once daily"] },
  { name: "Furosemide", dosages: ["20mg", "40mg", "80mg"], frequencies: ["once daily", "twice daily"] },
  { name: "Insulin Glargine", dosages: ["10 units", "15 units", "20 units", "30 units"], frequencies: ["once daily", "at bedtime"] },
  { name: "Warfarin", dosages: ["1mg", "2mg", "2.5mg", "3mg", "4mg", "5mg", "6mg", "7.5mg", "10mg"], frequencies: ["once daily", "as directed"] },
  { name: "Citalopram", dosages: ["10mg", "20mg", "40mg"], frequencies: ["once daily"] },
  { name: "Pantoprazole", dosages: ["20mg", "40mg"], frequencies: ["once daily", "before breakfast"] },
  { name: "Carvedilol", dosages: ["3.125mg", "6.25mg", "12.5mg", "25mg"], frequencies: ["twice daily"] }
];

// Medication instructions
const medicationInstructions = [
  "Take with food",
  "Take on an empty stomach",
  "Take with a full glass of water",
  "Do not crush or chew",
  "May cause drowsiness",
  "Avoid alcohol",
  "Take at the same time each day",
  "Store at room temperature",
  "Protect from light",
  "Do not stop taking without consulting your doctor",
  "May cause dizziness",
  "Take as directed",
  "Swallow whole"
];

// Common patient complaints
const patientComplaints = [
  {
    symptom: "Headache",
    descriptions: [
      "Patient reports severe headache lasting for 3 days",
      "Recurring headache, primarily in the morning",
      "Tension headache with pain radiating to neck",
      "Migraine-like headache with photosensitivity",
      "Headache unresponsive to over-the-counter pain relievers"
    ],
    durations: ["3 days", "1 week", "2 weeks", "recurring for months", "since yesterday"]
  },
  {
    symptom: "Chest Pain",
    descriptions: [
      "Sharp chest pain on exertion",
      "Dull chest pain radiating to left arm",
      "Intermittent chest discomfort",
      "Chest pain with shortness of breath",
      "Stabbing chest pain when lying down"
    ],
    durations: ["2 hours", "since yesterday", "on and off for a week", "during physical activity", "at night"]
  },
  {
    symptom: "Fatigue",
    descriptions: [
      "Persistent fatigue despite adequate rest",
      "Extreme fatigue affecting daily activities",
      "Fatigue with muscle weakness",
      "Morning fatigue that improves throughout the day",
      "Fatigue accompanied by dizziness"
    ],
    durations: ["2 weeks", "several months", "since starting new medication", "1 month", "gradually worsening"]
  },
  {
    symptom: "Abdominal Pain",
    descriptions: [
      "Lower right quadrant abdominal pain",
      "Diffuse abdominal pain with bloating",
      "Cramping abdominal pain after meals",
      "Intermittent sharp abdominal pain",
      "Dull abdominal pain with nausea"
    ],
    durations: ["24 hours", "3 days", "after eating", "1 week", "comes and goes"]
  },
  {
    symptom: "Joint Pain",
    descriptions: [
      "Multiple joint pain with morning stiffness",
      "Knee pain worsening with activity",
      "Joint pain and swelling in hands",
      "Ankle pain after minor injury",
      "Shoulder pain limiting range of motion"
    ],
    durations: ["several weeks", "since injury 2 months ago", "chronic", "worse in cold weather", "3 days"]
  },
  {
    symptom: "Shortness of Breath",
    descriptions: [
      "Shortness of breath on minimal exertion",
      "Sudden onset of breathlessness",
      "Shortness of breath when lying flat",
      "Difficulty breathing with wheezing",
      "Breathlessness with chest tightness"
    ],
    durations: ["during exercise", "at night", "2 days", "with anxiety", "1 week"]
  },
  {
    symptom: "Dizziness",
    descriptions: [
      "Vertigo with position changes",
      "Lightheadedness when standing quickly",
      "Dizziness with nausea",
      "Room-spinning sensation",
      "Intermittent dizziness throughout the day"
    ],
    durations: ["when standing up", "episodes lasting minutes", "constant for 2 days", "with head movements", "morning only"]
  },
  {
    symptom: "Back Pain",
    descriptions: [
      "Lower back pain radiating to leg",
      "Upper back pain between shoulder blades",
      "Back pain worsening with bending",
      "Constant dull back ache",
      "Sharp back pain with certain movements"
    ],
    durations: ["1 month", "since lifting heavy object", "chronic for years", "worse in the morning", "3 days"]
  },
  {
    symptom: "Cough",
    descriptions: [
      "Dry persistent cough",
      "Productive cough with yellow sputum",
      "Nighttime cough disrupting sleep",
      "Cough with sore throat",
      "Cough worsening with deep breaths"
    ],
    durations: ["2 weeks", "since cold 3 weeks ago", "only at night", "5 days", "with seasonal allergies"]
  },
  {
    symptom: "Rash",
    descriptions: [
      "Itchy red rash on arms",
      "Raised rash with blisters",
      "Spreading rash with burning sensation",
      "Localized rash at site of new soap use",
      "Rash with skin flaking"
    ],
    durations: ["appeared yesterday", "1 week", "comes and goes", "after sun exposure", "3 days"]
  }
];

// Severity levels for complaints - aligned with metadataService.ts
const complaintSeverityLevels = ["Mild", "Moderate", "Severe"];

// Define interfaces for lab components
interface QuantitativeLabComponent {
  test_name: string;
  unit: string;
  reference_range: string;
  min: number;
  max: number;
}

interface QualitativeLabComponent {
  test_name: string;
  unit: string;
  reference_range: string;
  values: string[];
}

type LabComponent = QuantitativeLabComponent | QualitativeLabComponent;

interface LabTest {
  name: string;
  components: LabComponent[];
}

interface LabResultComponent {
  test_name: string;
  value: number | string;
  unit: string;
  reference_range: string;
}

// Lab tests with reference ranges and units
const labTests: LabTest[] = [
  {
    name: "Complete Blood Count (CBC)",
    components: [
      {
        test_name: "White Blood Cell Count (WBC)",
        unit: "10^3/µL",
        reference_range: "4.5-11.0",
        min: 3.0,
        max: 15.0
      },
      {
        test_name: "Red Blood Cell Count (RBC)",
        unit: "10^6/µL",
        reference_range: "4.5-5.9 (male), 4.1-5.1 (female)",
        min: 3.5,
        max: 6.5
      },
      {
        test_name: "Hemoglobin (Hgb)",
        unit: "g/dL",
        reference_range: "13.5-17.5 (male), 12.0-15.5 (female)",
        min: 10.0,
        max: 18.0
      },
      {
        test_name: "Hematocrit (Hct)",
        unit: "%",
        reference_range: "41-50 (male), 36-44 (female)",
        min: 30,
        max: 55
      },
      {
        test_name: "Platelet Count",
        unit: "10^3/µL",
        reference_range: "150-450",
        min: 100,
        max: 500
      }
    ]
  },
  {
    name: "Basic Metabolic Panel (BMP)",
    components: [
      {
        test_name: "Glucose",
        unit: "mg/dL",
        reference_range: "70-99",
        min: 60,
        max: 200
      },
      {
        test_name: "Calcium",
        unit: "mg/dL",
        reference_range: "8.5-10.2",
        min: 7.5,
        max: 11.0
      },
      {
        test_name: "Sodium",
        unit: "mmol/L",
        reference_range: "135-145",
        min: 130,
        max: 150
      },
      {
        test_name: "Potassium",
        unit: "mmol/L",
        reference_range: "3.5-5.0",
        min: 3.0,
        max: 6.0
      },
      {
        test_name: "Chloride",
        unit: "mmol/L",
        reference_range: "96-106",
        min: 90,
        max: 110
      },
      {
        test_name: "Carbon Dioxide",
        unit: "mmol/L",
        reference_range: "23-29",
        min: 20,
        max: 32
      },
      {
        test_name: "Blood Urea Nitrogen (BUN)",
        unit: "mg/dL",
        reference_range: "7-20",
        min: 5,
        max: 30
      },
      {
        test_name: "Creatinine",
        unit: "mg/dL",
        reference_range: "0.6-1.2 (male), 0.5-1.1 (female)",
        min: 0.4,
        max: 2.0
      }
    ]
  },
  {
    name: "Lipid Panel",
    components: [
      {
        test_name: "Total Cholesterol",
        unit: "mg/dL",
        reference_range: "<200",
        min: 120,
        max: 300
      },
      {
        test_name: "HDL Cholesterol",
        unit: "mg/dL",
        reference_range: ">40 (male), >50 (female)",
        min: 25,
        max: 100
      },
      {
        test_name: "LDL Cholesterol",
        unit: "mg/dL",
        reference_range: "<100",
        min: 50,
        max: 200
      },
      {
        test_name: "Triglycerides",
        unit: "mg/dL",
        reference_range: "<150",
        min: 50,
        max: 300
      }
    ]
  },
  {
    name: "Liver Function Tests",
    components: [
      {
        test_name: "Alanine Aminotransferase (ALT)",
        unit: "U/L",
        reference_range: "7-56 (male), 7-45 (female)",
        min: 5,
        max: 100
      },
      {
        test_name: "Aspartate Aminotransferase (AST)",
        unit: "U/L",
        reference_range: "8-48 (male), 8-43 (female)",
        min: 5,
        max: 100
      },
      {
        test_name: "Alkaline Phosphatase (ALP)",
        unit: "U/L",
        reference_range: "45-115",
        min: 30,
        max: 200
      },
      {
        test_name: "Total Bilirubin",
        unit: "mg/dL",
        reference_range: "0.1-1.2",
        min: 0.1,
        max: 3.0
      },
      {
        test_name: "Albumin",
        unit: "g/dL",
        reference_range: "3.4-5.4",
        min: 2.5,
        max: 6.0
      }
    ]
  },
  {
    name: "Thyroid Function Tests",
    components: [
      {
        test_name: "Thyroid Stimulating Hormone (TSH)",
        unit: "mIU/L",
        reference_range: "0.4-4.0",
        min: 0.1,
        max: 10.0
      },
      {
        test_name: "Free Thyroxine (T4)",
        unit: "ng/dL",
        reference_range: "0.8-1.8",
        min: 0.5,
        max: 2.5
      },
      {
        test_name: "Free Triiodothyronine (T3)",
        unit: "pg/mL",
        reference_range: "2.3-4.2",
        min: 1.5,
        max: 6.0
      }
    ]
  },
  {
    name: "Hemoglobin A1C",
    components: [
      {
        test_name: "Hemoglobin A1C",
        unit: "%",
        reference_range: "<5.7",
        min: 4.0,
        max: 14.0
      }
    ]
  },
  {
    name: "Urinalysis",
    components: [
      {
        test_name: "pH",
        unit: "",
        reference_range: "4.5-8.0",
        min: 4.0,
        max: 9.0
      },
      {
        test_name: "Specific Gravity",
        unit: "",
        reference_range: "1.005-1.030",
        min: 1.001,
        max: 1.035
      },
      {
        test_name: "Glucose",
        unit: "",
        reference_range: "Negative",
        values: ["Negative", "Trace", "1+", "2+", "3+", "4+"]
      },
      {
        test_name: "Protein",
        unit: "",
        reference_range: "Negative",
        values: ["Negative", "Trace", "1+", "2+", "3+", "4+"]
      },
      {
        test_name: "Blood",
        unit: "",
        reference_range: "Negative",
        values: ["Negative", "Trace", "1+", "2+", "3+", "4+"]
      },
      {
        test_name: "Ketones",
        unit: "",
        reference_range: "Negative",
        values: ["Negative", "Trace", "1+", "2+", "3+", "4+"]
      }
    ]
  }
];

// Helper functions for generating vital data (copied from Vitals.tsx)
const generateHeartRate = (dayOffset: number): number => {
  // Convert dayOffset to a value between 0 and 30 for compatibility with existing logic
  const normalizedOffset = dayOffset % 30;
  
  if (normalizedOffset === 24) {
    // High heart rate (above 100)
    return 110 + Math.round(Math.random() * 15); // 110-125
  } else if (normalizedOffset === 12) {
    // Low heart rate (below 60)
    return 45 + Math.round(Math.random() * 10); // 45-55
  } else {
    // Normal range with variation
    const baseHeartRate = 75;
    const variation = Math.sin(normalizedOffset * 0.5) * 15;
    return Math.round(baseHeartRate + variation);
  }
};

const generateBloodPressure = (dayOffset: number): { systolic: number; diastolic: number } => {
  // Convert dayOffset to a value between 0 and 30 for compatibility with existing logic
  const normalizedOffset = dayOffset % 30;
  
  if (normalizedOffset === 20) {
    // High blood pressure (hypertension)
    return {
      systolic: 145 + Math.round(Math.random() * 15), // 145-160
      diastolic: 95 + Math.round(Math.random() * 10), // 95-105
    };
  } else if (normalizedOffset === 8) {
    // Low blood pressure (hypotension)
    return {
      systolic: 85 + Math.round(Math.random() * 10), // 85-95
      diastolic: 50 + Math.round(Math.random() * 10), // 50-60
    };
  } else {
    // Normal range with variation
    const baseSystolic = 120;
    const baseDiastolic = 80;
    const variation = Math.sin(normalizedOffset * 0.5) * 10;
    return {
      systolic: Math.round(baseSystolic + variation),
      diastolic: Math.round(baseDiastolic + variation * 0.6),
    };
  }
};

const generateTemperature = (dayOffset: number): number | undefined => {
  // Convert dayOffset to a value between 0 and 30 for compatibility with existing logic
  const normalizedOffset = dayOffset % 30;
  
  if (normalizedOffset % 6 !== 0) return undefined;
  
  if (normalizedOffset === 18) {
    // Fever
    return 38.2 + (Math.random() * 0.8); // 38.2-39.0
  } else if (normalizedOffset === 6) {
    // Low temperature
    return 35.5 + (Math.random() * 0.5); // 35.5-36.0
  } else {
    // Normal range
    return 36.5 + (Math.random() * 0.7); // 36.5-37.2
  }
};

const generateRespiratoryRate = (dayOffset: number): number | undefined => {
  // Convert dayOffset to a value between 0 and 30 for compatibility with existing logic
  const normalizedOffset = dayOffset % 30;
  
  if (normalizedOffset % 5 !== 0) return undefined;
  
  if (normalizedOffset === 10) {
    // High respiratory rate
    return 22 + Math.round(Math.random() * 8); // 22-30
  } else if (normalizedOffset === 20) {
    // Low respiratory rate
    return 8 + Math.round(Math.random() * 3); // 8-11
  } else {
    // Normal range
    return 14 + Math.round(Math.random() * 4); // 14-18
  }
};

// Generate random title and description for vital signs
const generateTitleAndDescription = (): { title: string; description: string } => {
  const titles = [
    'Routine Vital Signs Check',
    'Vital Signs Monitoring',
    'Health Check',
    'Wellness Assessment',
    'Vital Signs Screening',
    'Nurse Check-in',
    'Triage Assessment',
    'Follow-up Vitals',
    'Pre-appointment Vitals',
    'Periodic Health Check'
  ];
  
  const descriptions = [
    'Regular monitoring of vital signs',
    'Routine health parameters check',
    'Part of ongoing health monitoring',
    'Patient reports feeling well',
    'Checked during routine visit',
    'Post-medication monitoring',
    'Patient reports mild fatigue',
    'No significant changes noted',
    'Slight improvement from last check',
    'Patient recovering well',
    'Monitored after physical activity',
    'Morning assessment',
    'Evening check before discharge',
    'Pre-procedure baseline',
    'Vital signs within expected range'
  ];
  
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)]
  };
};

// Generate unique record ID
const generateRecordId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 12;
  let result = 'm7mfb285'; // Prefix to match existing IDs
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper functions for lab result analysis
const isOutsideNumericRange = (value: number, rangeStr: string): boolean => {
  const range = rangeStr.split('-');
  if (range.length === 2) {
    const min = parseFloat(range[0]);
    const max = parseFloat(range[1]);
    return value < min || value > max;
  }
  return false;
};

const isAboveThreshold = (value: number, rangeStr: string): boolean => {
  if (rangeStr.startsWith('<')) {
    const threshold = parseFloat(rangeStr.substring(1));
    return value >= threshold;
  }
  return false;
};

const isBelowThreshold = (value: number, rangeStr: string): boolean => {
  if (rangeStr.startsWith('>')) {
    const threshold = parseFloat(rangeStr.substring(1));
    return value <= threshold;
  }
  return false;
};

// Function to determine if a lab result is abnormal
const isAbnormalResult = (result: LabResultComponent): boolean => {
  // Check string values (like "Positive" when reference is "Negative")
  if (typeof result.value === 'string' && 
      result.value !== 'Negative' && 
      result.reference_range === 'Negative') {
    return true;
  }
  
  // Check numeric values against reference ranges
  if (typeof result.value === 'number') {
    return isOutsideNumericRange(result.value, result.reference_range) ||
           isAboveThreshold(result.value, result.reference_range) ||
           isBelowThreshold(result.value, result.reference_range);
  }
  
  return false;
};

// Helper function to generate a random date within the past 3 years
const generateRandomLabDate = (): Date => {
  const now = new Date();
  const threeYearsAgo = subYears(now, 3);
  
  // Calculate total days in the 3-year period
  const totalDays = Math.floor((now.getTime() - threeYearsAgo.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate date with randomness to make it realistic
  const daysAgo = Math.floor(Math.random() * totalDays);
  return subDays(now, daysAgo);
};

// Helper function to generate a value for a lab component
const generateLabComponentValue = (component: LabComponent): number | string => {
  if ('values' in component && Array.isArray(component.values)) {
    // For qualitative tests (like urinalysis)
    const qualComponent = component as QualitativeLabComponent;
    return qualComponent.values[Math.floor(Math.random() * qualComponent.values.length)];
  } else {
    // For quantitative tests
    const quantComponent = component as QuantitativeLabComponent;
    // Generate a random value within the min-max range
    const value = quantComponent.min + Math.random() * (quantComponent.max - quantComponent.min);
    
    // Round to appropriate precision based on the typical values for this test
    if (value < 1) {
      return parseFloat(value.toFixed(2));
    } else if (value < 10) {
      return parseFloat(value.toFixed(1));
    } else {
      return Math.round(value);
    }
  }
};

// Helper function to create a description for lab results
const createLabResultDescription = (panelName: string, abnormalResults: LabResultComponent[]): string => {
  let description = `${panelName} lab test results`;
  
  if (abnormalResults.length === 0) {
    return description + ` - all values within normal range`;
  }
  
  description += ` with ${abnormalResults.length} abnormal value${abnormalResults.length > 1 ? 's' : ''}`;
  
  // Add up to 3 abnormal results to the description
  const abnormalSummary = abnormalResults.slice(0, 3).map((comp) => 
    `${comp.test_name}: ${comp.value}${comp.unit ? ' ' + comp.unit : ''}`
  ).join(', ');
  
  if (abnormalSummary) {
    description += `: ${abnormalSummary}`;
    if (abnormalResults.length > 3) {
      description += `, and ${abnormalResults.length - 3} more`;
    }
  }
  
  return description;
};

// Generate vital signs records for a patient
const generateVitalSignsRecords = (patientId: string, startId: number): MedicalRecord[] => {
  const records: MedicalRecord[] = [];
  const now = new Date();
  const threeYearsAgo = subYears(now, 3);
  
  // Calculate total days in the 3-year period
  const totalDays = Math.floor((now.getTime() - threeYearsAgo.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate approximately 12-20 data points over 3 years (reduced from 36-72)
  // This should result in ~500 vital signs records for 30 patients
  const numDataPoints = 12 + Math.floor(Math.random() * 8); // Random between 12-20 points
  const dayStep = Math.floor(totalDays / numDataPoints);
  
  // Generate data points over the last 3 years
  for (let i = 0; i < numDataPoints; i++) {
    // Calculate date with some randomness to avoid perfectly regular intervals
    const randomOffset = Math.floor(Math.random() * (dayStep - 1)); // Random offset within the step
    const daysAgo = totalDays - (i * dayStep + randomOffset);
    const date = subDays(now, daysAgo);
    
    // Generate vital signs using the day offset for variation
    const dayOffset = daysAgo; // Use days ago as offset for generating values
    const heartRate = generateHeartRate(dayOffset);
    const { systolic, diastolic } = generateBloodPressure(dayOffset);
    const temperature = generateTemperature(dayOffset);
    const respiratoryRate = generateRespiratoryRate(dayOffset);
    
    // Randomly decide which vital signs to include
    // Increase randomness to sometimes skip recording certain vitals
    const includeHeartRate = Math.random() > 0.2; // 80% chance to include
    const includeBloodPressure = Math.random() > 0.25; // 75% chance to include
    const includeTemperature = temperature !== undefined && Math.random() > 0.3; // 70% chance to include if available
    const includeRespiratoryRate = respiratoryRate !== undefined && Math.random() > 0.4; // 60% chance to include if available
    
    // Generate title and description
    const { title, description } = generateTitleAndDescription();
    
    // Create details object with only the included vital signs
    const details: Record<string, unknown> = {};
    if (includeHeartRate) {
      details.heart_rate = {
        value: heartRate,
        unit: "/min"
      };
    }
    if (includeBloodPressure) {
      details.blood_pressure = {
        value: `${systolic}/${diastolic}`,
        unit: "mmHg"
      };
    }
    if (includeTemperature) {
      details.temperature = {
        value: parseFloat(temperature.toFixed(1)),
        unit: "degC"
      };
    }
    if (includeRespiratoryRate) {
      details.respiratory_rate = {
        value: respiratoryRate,
        unit: "/min"
      };
    }
    
    // Only create a record if at least one vital sign is included
    if (Object.keys(details).length > 0) {
      records.push({
        id: `${startId + i}`,
        patientId,
        recordId: generateRecordId(),
        recordedAt: date.toISOString(),
        recordType: 'vital_signs',
        title,
        description,
        details
      });
    }
  }
  
  // Sort records by date (newest first)
  records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  
  return records;
};

// Generate procedure records for a patient
const generateProcedureRecords = (patientId: string, startId: number): MedicalRecord[] => {
  const records: MedicalRecord[] = [];
  const now = new Date();
  const threeYearsAgo = subYears(now, 3);
  
  // Calculate total days in the 3-year period
  const totalDays = Math.floor((now.getTime() - threeYearsAgo.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate approximately 5-15 procedures over 3 years
  const numProcedures = 5 + Math.floor(Math.random() * 10);
  
  // Generate procedure records
  for (let i = 0; i < numProcedures; i++) {
    // Calculate date with randomness to make it realistic
    const daysAgo = Math.floor(Math.random() * totalDays);
    const date = subDays(now, daysAgo);
    
    // Select random procedure type
    const procedureType = procedureTypes[Math.floor(Math.random() * procedureTypes.length)];
    
    // Select random finding
    const finding = commonFindings[Math.floor(Math.random() * commonFindings.length)];
    
    // Select random recommendation
    const recommendation = commonRecommendations[Math.floor(Math.random() * commonRecommendations.length)];
    
    // Create title and description
    const title = procedureType;
    const description = `${procedureType} performed. ${finding}.`;
    
    // Create details
    const details = {
      procedure_type: procedureType,
      findings: finding,
      recommendations: recommendation
    };
    
    records.push({
      id: `${startId + i}`,
      patientId,
      recordId: generateRecordId(),
      recordedAt: date.toISOString(),
      recordType: 'procedure',
      title,
      description,
      details
    });
  }
  
  // Sort records by date (newest first)
  records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  
  return records;
};

// Generate diagnosis records for a patient
const generateDiagnosisRecords = (patientId: string, startId: number): MedicalRecord[] => {
  const records: MedicalRecord[] = [];
  const now = new Date();
  const threeYearsAgo = subYears(now, 3);
  
  // Calculate total days in the 3-year period
  const totalDays = Math.floor((now.getTime() - threeYearsAgo.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate approximately 3-10 diagnoses over 3 years
  const numDiagnoses = 3 + Math.floor(Math.random() * 7);
  
  // Select random conditions for this patient without duplicates
  const selectedConditions = [...medicalConditions]
    .sort(() => 0.5 - Math.random())
    .slice(0, numDiagnoses);
  
  // Generate diagnosis records
  for (let i = 0; i < numDiagnoses; i++) {
    // Calculate date with randomness to make it realistic
    const daysAgo = Math.floor(Math.random() * totalDays);
    const date = subDays(now, daysAgo);
    
    const condition = selectedConditions[i];
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    // Create title and description
    const title = `${condition} Assessment`;
    let description = "";
    
    if (status === "Active") {
      description = `Diagnosed with ${severity.toLowerCase()} ${condition}. Ongoing management required.`;
    } else if (status === "Resolved") {
      description = `${condition} has resolved. No further treatment needed at this time.`;
    } else { // Recurring
      description = `${condition} shows recurring pattern. Adjusting treatment plan.`;
    }
    
    // Create details
    const details = {
      condition,
      severity,
      status
    };
    
    records.push({
      id: `${startId + i}`,
      patientId,
      recordId: generateRecordId(),
      recordedAt: date.toISOString(),
      recordType: 'diagnosis',
      title,
      description,
      details
    });
  }
  
  // Sort records by date (newest first)
  records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  
  return records;
};

// Generate medication records for a patient
const generateMedicationRecords = (patientId: string, startId: number, diagnosisRecords: MedicalRecord[]): MedicalRecord[] => {
  const records: MedicalRecord[] = [];
  const now = new Date();
  const _threeYearsAgo = subYears(now, 3);
  
  // If there are no diagnosis records, return empty array
  if (diagnosisRecords.length === 0) {
    return records;
  }
  
  // For each diagnosis, potentially create 0-2 medication records
  diagnosisRecords.forEach((diagnosis, index) => {
    const condition = diagnosis.details.condition as string;
    const status = diagnosis.details.status as string;
    
    // Only create medications for active or recurring conditions
    if (status === "Resolved") {
      // 20% chance to still have a medication for a resolved condition
      if (Math.random() > 0.2) {
        return;
      }
    }
    
    // Determine number of medications for this condition (0-2)
    const numMedications = Math.floor(Math.random() * 3);
    
    // Get the diagnosis date
    const diagnosisDate = new Date(diagnosis.recordedAt);
    
    // Create medication records
    for (let i = 0; i < numMedications; i++) {
      // Select a random medication
      const medication = medications[Math.floor(Math.random() * medications.length)];
      const dosage = medication.dosages[Math.floor(Math.random() * medication.dosages.length)];
      const frequency = medication.frequencies[Math.floor(Math.random() * medication.frequencies.length)];
      
      // Create a date a few days after diagnosis (1-7 days)
      const daysAfterDiagnosis = 1 + Math.floor(Math.random() * 7);
      const medicationDate = addDays(diagnosisDate, daysAfterDiagnosis);
      
      // If medication date is in the future, use diagnosis date
      const recordDate = medicationDate > now ? diagnosisDate : medicationDate;
      
      // Select 1-2 random instructions
      const numInstructions = 1 + Math.floor(Math.random() * 2);
      const instructions = [...medicationInstructions]
        .sort(() => 0.5 - Math.random())
        .slice(0, numInstructions)
        .join(". ") + ".";
      
      // Create title and description
      const title = `${medication.name} Prescription`;
      const description = `Prescribed ${medication.name} ${dosage} ${frequency} for ${condition}.`;
      
      // Create details
      const details = {
        medication_name: medication.name,
        dosage,
        frequency,
        instructions,
        for_condition: condition
      };
      
      records.push({
        id: `${startId + index * numMedications + i}`,
        patientId,
        recordId: generateRecordId(),
        recordedAt: recordDate.toISOString(),
        recordType: 'medication',
        title,
        description,
        details
      });
    }
  });
  
  // Sort records by date (newest first)
  records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  
  return records;
};

// Generate complaint records for a patient
const generateComplaintRecords = (patientId: string, startId: number): MedicalRecord[] => {
  const records: MedicalRecord[] = [];
  const now = new Date();
  const threeYearsAgo = subYears(now, 3);
  
  // Calculate total days in the 3-year period
  const totalDays = Math.floor((now.getTime() - threeYearsAgo.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate approximately 5-15 complaints over 3 years
  const numComplaints = 5 + Math.floor(Math.random() * 10);
  
  // Generate complaint records
  for (let i = 0; i < numComplaints; i++) {
    // Calculate date with randomness to make it realistic
    const daysAgo = Math.floor(Math.random() * totalDays);
    const date = subDays(now, daysAgo);
    
    // Select a random complaint
    const complaintType = patientComplaints[Math.floor(Math.random() * patientComplaints.length)];
    const symptom = complaintType.symptom;
    const description = complaintType.descriptions[Math.floor(Math.random() * complaintType.descriptions.length)];
    const duration = complaintType.durations[Math.floor(Math.random() * complaintType.durations.length)];
    const severity = complaintSeverityLevels[Math.floor(Math.random() * complaintSeverityLevels.length)];
    
    // Create title and detailed description
    const title = `${symptom} Complaint`;
    const detailedDescription = `${description}. Duration: ${duration}. Severity: ${severity.toLowerCase()}.`;
    
    // Create details
    const details = {
      symptom,
      duration,
      severity
    };
    
    records.push({
      id: `${startId + i}`,
      patientId,
      recordId: generateRecordId(),
      recordedAt: date.toISOString(),
      recordType: 'complaint',
      title,
      description: detailedDescription,
      details
    });
  }
  
  // Sort records by date (newest first)
  records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  
  return records;
};

// Generate lab result records for a patient
const generateLabResultRecords = (patientId: string, startId: number): MedicalRecord[] => {
  const records: MedicalRecord[] = [];
  
  // Generate approximately 10-20 lab tests over 3 years
  const numLabPanels = 10 + Math.floor(Math.random() * 10);
  
  // Generate lab result records
  for (let i = 0; i < numLabPanels; i++) {
    const date = generateRandomLabDate();
    
    // Select a random lab test panel
    const labPanel = labTests[Math.floor(Math.random() * labTests.length)];
    const panelName = labPanel.name;
    
    // Create details object for all components in this panel
    const details: Record<string, unknown> = {
      panel_name: panelName,
      components: [] as LabResultComponent[]
    };
    
    // Generate results for each component
    for (const component of labPanel.components) {
      const value = generateLabComponentValue(component);
      
      (details.components as LabResultComponent[]).push({
        test_name: component.test_name,
        value: value,
        unit: component.unit,
        reference_range: component.reference_range
      });
    }
    
    // Create a summary of the results for the title and description
    const typedComponents = details.components as LabResultComponent[];
    const abnormalResults = typedComponents.filter(isAbnormalResult);
    
    const title = `${panelName} Results`;
    const description = createLabResultDescription(panelName, abnormalResults);
    
    records.push({
      id: `${startId + i}`,
      patientId,
      recordId: generateRecordId(),
      recordedAt: date.toISOString(),
      recordType: 'lab_result',
      title,
      description,
      details
    });
  }
  
  // Sort records by date (newest first)
  records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  
  return records;
};

// Main function to generate medical records and create medical_records.json from scratch
async function generateMedicalRecords() {
  try {
    // Define file paths
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const patientsFilePath = path.join(__dirname, '../public/data/patients.json');
    const medicalRecordsFilePath = path.join(__dirname, '../public/data/medical_records.json');
    
    // Read patients data
    const patientsData = JSON.parse(fs.readFileSync(patientsFilePath, 'utf8')) as { patients: Patient[] };
    
    // Generate new records for each patient
    let allRecords: MedicalRecord[] = [];
    let startId = 1;
    
    console.log(`Generating medical records for ${patientsData.patients.length} patients...`);
    
    for (const patient of patientsData.patients) {
      console.log(`Generating records for patient ${patient.firstName} ${patient.lastName} (ID: ${patient.patientId})`);
      
      // Generate vital signs
      const patientVitalRecords = generateVitalSignsRecords(patient.patientId, startId);
      allRecords = [...allRecords, ...patientVitalRecords];
      startId += patientVitalRecords.length;
      
      // Generate procedure records
      const patientProcedureRecords = generateProcedureRecords(patient.patientId, startId);
      allRecords = [...allRecords, ...patientProcedureRecords];
      startId += patientProcedureRecords.length;
      
      // Generate diagnosis records
      const patientDiagnosisRecords = generateDiagnosisRecords(patient.patientId, startId);
      allRecords = [...allRecords, ...patientDiagnosisRecords];
      startId += patientDiagnosisRecords.length;
      
      // Generate medication records based on diagnoses
      const patientMedicationRecords = generateMedicationRecords(patient.patientId, startId, patientDiagnosisRecords);
      allRecords = [...allRecords, ...patientMedicationRecords];
      startId += patientMedicationRecords.length;
      
      // Generate complaint records
      const patientComplaintRecords = generateComplaintRecords(patient.patientId, startId);
      allRecords = [...allRecords, ...patientComplaintRecords];
      startId += patientComplaintRecords.length;
      
      // Generate lab result records
      const patientLabResultRecords = generateLabResultRecords(patient.patientId, startId);
      allRecords = [...allRecords, ...patientLabResultRecords];
      startId += patientLabResultRecords.length;
    }
    
    // Sort all records by recordedAt date (newest first)
    allRecords.sort((a, b) => {
      return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
    });
    
    // Create the medical_records.json file from scratch
    fs.writeFileSync(
      medicalRecordsFilePath,
      JSON.stringify({ records: allRecords }, null, 2)
    );
    
    // Count records by type
    const vitalSignsCount = allRecords.filter(r => r.recordType === 'vital_signs').length;
    const procedureCount = allRecords.filter(r => r.recordType === 'procedure').length;
    const diagnosisCount = allRecords.filter(r => r.recordType === 'diagnosis').length;
    const medicationCount = allRecords.filter(r => r.recordType === 'medication').length;
    const complaintCount = allRecords.filter(r => r.recordType === 'complaint').length;
    const labResultCount = allRecords.filter(r => r.recordType === 'lab_result').length;
    
    console.log(`Successfully created ${medicalRecordsFilePath}`);
    console.log(`Generated ${allRecords.length} total records:`);
    console.log(`- ${vitalSignsCount} vital signs records`);
    console.log(`- ${procedureCount} procedure records`);
    console.log(`- ${diagnosisCount} diagnosis records`);
    console.log(`- ${medicationCount} medication records`);
    console.log(`- ${complaintCount} complaint records`);
    console.log(`- ${labResultCount} lab result records`);
    console.log(`For ${patientsData.patients.length} patients`);
  } catch (error) {
    console.error('Error generating medical records:', error);
  }
}

// Execute the script
generateMedicalRecords().catch(console.error);
