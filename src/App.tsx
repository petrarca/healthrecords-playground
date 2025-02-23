import { MedicalTimeline, type MedicalRecord } from './components/MedicalTimeline';

const sampleMedicalRecords: MedicalRecord[] = [
  // February 23, 2025
  {
    id: '1',
    date: new Date('2025-02-23T09:30:00'),
    type: 'diagnosis',
    title: 'Hypertension Diagnosis',
    description: 'Essential (primary) hypertension',
  },
  {
    id: '2',
    date: new Date('2025-02-23T09:35:00'),
    type: 'vital_signs',
    title: 'Vital Signs Check',
    description: 'Regular checkup measurements',
    details: {
      'Blood Pressure': '140/90 mmHg',
      'Heart Rate': '78 bpm',
      'Temperature': '36.6 °C',
      'SpO2': '98%'
    },
  },
  {
    id: '3',
    date: new Date('2025-02-23T09:45:00'),
    type: 'lab_result',
    title: 'Lipid Panel Results',
    description: 'Comprehensive lipid testing',
    details: {
      'Total Cholesterol': '220 mg/dL',
      'HDL': '45 mg/dL',
      'LDL': '140 mg/dL',
      'Triglycerides': '150 mg/dL'
    },
  },

  // February 20, 2025
  {
    id: '4',
    date: new Date('2025-02-20T14:15:00'),
    type: 'complaint',
    title: 'Patient Complaint',
    description: 'Recurring headaches and dizziness',
  },
  {
    id: '5',
    date: new Date('2025-02-20T14:30:00'),
    type: 'vital_signs',
    title: 'Emergency Vital Check',
    description: 'Vital signs during headache episode',
    details: {
      'Blood Pressure': '150/95 mmHg',
      'Heart Rate': '88 bpm',
      'Temperature': '36.8 °C',
      'SpO2': '97%'
    },
  },
  {
    id: '6',
    date: new Date('2025-02-20T15:30:00'),
    type: 'lab_result',
    title: 'Blood Test Results',
    description: 'Complete Blood Count (CBC)',
    details: {
      'WBC': '7.5 x10^9/L',
      'RBC': '4.8 x10^12/L',
      'Hemoglobin': '14.2 g/dL',
      'Platelets': '250 x10^9/L'
    },
  },

  // February 15, 2025
  {
    id: '7',
    date: new Date('2025-02-15T10:00:00'),
    type: 'complaint',
    title: 'Initial Consultation',
    description: 'First report of headaches and high blood pressure symptoms',
  },
  {
    id: '8',
    date: new Date('2025-02-15T10:15:00'),
    type: 'vital_signs',
    title: 'Initial Vital Signs',
    description: 'Baseline measurements',
    details: {
      'Blood Pressure': '145/92 mmHg',
      'Heart Rate': '82 bpm',
      'Temperature': '36.7 °C',
      'SpO2': '98%'
    },
  },
  {
    id: '9',
    date: new Date('2025-02-15T11:00:00'),
    type: 'lab_result',
    title: 'Basic Metabolic Panel',
    description: 'Kidney and blood sugar analysis',
    details: {
      'Glucose': '95 mg/dL',
      'Creatinine': '0.9 mg/dL',
      'Potassium': '4.0 mEq/L',
      'Sodium': '140 mEq/L'
    },
  },

  // February 10, 2025
  {
    id: '10',
    date: new Date('2025-02-10T08:30:00'),
    type: 'vital_signs',
    title: 'Regular Checkup',
    description: 'Annual physical examination',
    details: {
      'Blood Pressure': '135/85 mmHg',
      'Heart Rate': '75 bpm',
      'Temperature': '36.5 °C',
      'BMI': '24.5'
    },
  },
  {
    id: '11',
    date: new Date('2025-02-10T09:00:00'),
    type: 'lab_result',
    title: 'Thyroid Function Test',
    description: 'Routine thyroid screening',
    details: {
      'TSH': '2.5 mIU/L',
      'T4': '1.2 ng/dL',
      'T3': '120 ng/dL'
    },
  },
  {
    id: '12',
    date: new Date('2025-02-10T09:30:00'),
    type: 'diagnosis',
    title: 'Annual Assessment',
    description: 'Overall health evaluation and recommendations',
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 px-4">Medical Timeline</h1>
        <MedicalTimeline records={sampleMedicalRecords} />
      </div>
    </div>
  );
}

export default App;