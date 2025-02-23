import { MedicalTimeline, type MedicalRecord } from './components/MedicalTimeline';
import { PatientHeader, type Patient } from './components/PatientHeader';
import { Shell } from './components/Shell';

const samplePatient: Patient = {
  id: "P123456",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: new Date("1980-05-15"),
  sex: "M",
  bloodType: "O+",
  height: "180 cm",
  weight: "75 kg",
  allergies: ["Penicillin", "Pollen"],
  primaryPhysician: "Dr. Sarah Johnson",
  insuranceProvider: "HealthCare Plus",
  insuranceNumber: "HC987654321"
};

const sampleMedicalRecords: MedicalRecord[] = [
  // 2025 Records
  {
    id: 'rec1',
    type: 'diagnosis',
    title: 'Annual Physical Examination',
    description: 'Regular checkup shows all vital signs within normal ranges. Blood pressure: 120/80, Heart rate: 72 bpm.',
    date: new Date('2025-02-15T09:30:00'),
    details: {
      'Blood Pressure': '120/80 mmHg',
      'Heart Rate': '72 bpm',
      'Temperature': '98.6°F',
      'Weight': '150 lbs'
    }
  },
  {
    id: 'rec2',
    type: 'lab_result',
    title: 'Complete Blood Count',
    description: 'All blood cell counts within normal ranges. Hemoglobin: 14.2 g/dL, White blood cells: 7.5k/µL.',
    date: new Date('2025-02-15T10:15:00'),
    details: {
      'Hemoglobin': '14.2 g/dL',
      'White Blood Cells': '7.5k/µL',
      'Platelets': '250k/µL'
    }
  },

  // 2024 Records
  {
    id: 'rec3',
    type: 'complaint',
    title: 'Lower Back Pain',
    description: 'Patient reports persistent lower back pain, particularly after prolonged sitting. Pain level: 6/10.',
    date: new Date('2024-11-20T14:30:00'),
    details: {
      'Pain Level': '6/10',
      'Duration': '2 weeks',
      'Location': 'Lower back'
    }
  },
  {
    id: 'rec4',
    type: 'diagnosis',
    title: 'Lumbar Strain',
    description: 'Diagnosed with lumbar strain. Prescribed physical therapy and anti-inflammatory medication.',
    date: new Date('2024-11-20T15:00:00')
  },
  {
    id: 'rec5',
    type: 'vital_signs',
    title: 'Routine Check',
    description: 'Regular vital signs check during physical therapy session.',
    date: new Date('2024-09-05T11:00:00'),
    details: {
      'Blood Pressure': '118/78 mmHg',
      'Heart Rate': '68 bpm',
      'Temperature': '98.4°F'
    }
  },

  // 2023 Records
  {
    id: 'rec6',
    type: 'lab_result',
    title: 'Thyroid Function Test',
    description: 'TSH and T4 levels within normal range. No thyroid dysfunction detected.',
    date: new Date('2023-08-15T09:00:00'),
    details: {
      'TSH': '2.5 mIU/L',
      'T4': '1.2 ng/dL'
    }
  },
  {
    id: 'rec7',
    type: 'diagnosis',
    title: 'Seasonal Allergies',
    description: 'Presenting with seasonal allergy symptoms. Prescribed antihistamines.',
    date: new Date('2023-05-10T16:45:00')
  },
  {
    id: 'rec8',
    type: 'vital_signs',
    title: 'Follow-up Check',
    description: 'Vital signs check during allergy follow-up.',
    date: new Date('2023-05-25T14:30:00')
  },

  // 2022 Records
  {
    id: 'rec9',
    type: 'lab_result',
    title: 'Lipid Panel',
    description: 'Cholesterol levels slightly elevated. Recommended dietary changes.',
    date: new Date('2022-12-01T10:30:00'),
    details: {
      'Total Cholesterol': '210 mg/dL',
      'LDL': '130 mg/dL',
      'HDL': '45 mg/dL'
    }
  },
  {
    id: 'rec10',
    type: 'complaint',
    title: 'Migraine',
    description: 'Severe headache with visual aura. Duration: 4 hours.',
    date: new Date('2022-07-15T13:20:00'),
    details: {
      'Pain Level': '8/10',
      'Duration': '4 hours',
      'Symptoms': 'Visual aura, nausea'
    }
  },

  // 2021 Records
  {
    id: 'rec11',
    type: 'diagnosis',
    title: 'Ankle Sprain',
    description: 'Grade 2 ankle sprain from sports activity. RICE protocol recommended.',
    date: new Date('2021-09-20T17:15:00'),
    details: {
      'Grade': 'Grade 2',
      'Cause': 'Sports injury',
      'Treatment': 'RICE protocol'
    }
  },
  {
    id: 'rec12',
    type: 'vital_signs',
    title: 'Emergency Visit',
    description: 'Vital signs check during emergency visit for ankle injury.',
    date: new Date('2021-09-20T17:30:00')
  },
  {
    id: 'rec13',
    type: 'lab_result',
    title: 'Vitamin D Test',
    description: 'Vitamin D levels below normal range. Supplementation recommended.',
    date: new Date('2021-03-10T11:45:00'),
    details: {
      'Vitamin D Level': '18 ng/mL',
      'Reference Range': '30-100 ng/mL'
    }
  },

  // 2020 Records
  {
    id: 'rec14',
    type: 'diagnosis',
    title: 'Annual Wellness Visit',
    description: 'Comprehensive health assessment. All systems reviewed.',
    date: new Date('2020-11-05T09:00:00')
  },
  {
    id: 'rec15',
    type: 'lab_result',
    title: 'Comprehensive Metabolic Panel',
    description: 'All metabolic parameters within normal ranges.',
    date: new Date('2020-11-05T10:30:00'),
    details: {
      'Glucose': '85 mg/dL',
      'Creatinine': '0.9 mg/dL',
      'ALT': '25 U/L'
    }
  },

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
    <Shell>
      <div className="space-y-5">
        <PatientHeader patient={samplePatient} />
        <div className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
          <MedicalTimeline records={sampleMedicalRecords} />
        </div>
      </div>
    </Shell>
  );
}

export default App;