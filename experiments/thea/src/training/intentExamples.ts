// Define intent examples for training
export const intentExamples: Record<string, string[]> = {
  greeting: [
    'Hello',
    'Hi',
    'Hey there',
    'Good morning',
    'Good afternoon',
    'Good evening',
    'How are you?',
    'What\'s up?'
  ],
  help: [
    'Help',
    'I need help',
    'What can you do?',
    'What commands are available?',
    'Show me what you can do',
    'How do I use this?',
    'Give me some examples',
    'What are my options?'
  ],
  show_patient: [
    'Show patient information',
    'Display patient details',
    'Show me the patient',
    'Who is the patient?',
    'Tell me about the patient',
    'Patient info',
    'Show patient {patientId}',
    'Tell me about {patientName}',
    'Show patient John Doe',
    'Tell me about Mary Smith',
    'Display information for patient James Wilson'
  ],
  show_records: [
    'Show medical records',
    'Display health records',
    'Show me the records',
    'List all records',
    'What records are available?',
    'Show records for patient {patientId}',
    'Show {firstName}\'s records',
    'Show John Doe\'s medical records',
    'Display recent health records for Mary Smith',
    'What records are available for James Wilson?',
    'Show latest records for Sarah Johnson'
  ],
  show_medications: [
    'Show medications',
    'Display current medications',
    'What medications is the patient on?',
    'List all medications',
    'Show me the medication list',
    'What drugs is {firstName} taking?',
    'Show {patientName}\'s medications',
    'What medications is John Doe taking?',
    'Show Mary Smith\'s current medications',
    'List all medications for James Wilson',
    'Display recent medications for Sarah Johnson'
  ],
  show_allergies: [
    'Show allergies',
    'Display patient allergies',
    'What allergies does the patient have?',
    'List all allergies',
    'Show me the allergy list',
    'What is {firstName} allergic to?',
    'Show {patientName}\'s allergies',
    'What allergies does John Doe have?',
    'Show Mary Smith\'s allergies',
    'List all allergies for James Wilson',
    'Display Sarah Johnson\'s recent allergies'
  ],
  show_vitals: [
    'Show vital signs',
    'Display vitals',
    'What are the patient\'s vitals?',
    'Show me the vital signs',
    'Show blood pressure',
    'What\'s the heart rate?',
    'Show {patientName}\'s vitals',
    'Display John Doe\'s vital signs',
    'What are Mary Smith\'s vitals?',
    'Show latest vitals for James Wilson',
    'What were Sarah Johnson\'s vitals yesterday?',
    'Show blood pressure from last week'
  ],
  show_labs: [
    'Show lab results',
    'Display laboratory tests',
    'What lab work has been done?',
    'Show me the lab results',
    'Show recent labs',
    'What are {firstName}\'s lab values?',
    'Show {patientName}\'s lab results',
    'Display John Doe\'s lab results',
    'What are Mary Smith\'s recent lab values?',
    'Show lab results for James Wilson from yesterday',
    'Display Sarah Johnson\'s lab work from last week',
    'Show latest lab results for David Miller'
  ],
  navigate: [
    'Go to summary',
    'Navigate to timeline',
    'Show demographics',
    'Take me to profile',
    'Switch to vitals view',
    'Go back to landing page',
    'Open the timeline'
  ],
  show_record_details: [
    'Show record details',
    'Display record information',
    'Tell me more about this record',
    'What\'s in this record?',
    'Show details for record {recordId}',
    'Open record {recordId}',
    'Show details for John Doe\'s latest record',
    'Display information for Mary Smith\'s record from yesterday',
    'Tell me more about James Wilson\'s lab record from last week'
  ],
  thanks: [
    'Thank you',
    'Thanks',
    'Thanks a lot',
    'I appreciate it',
    'That was helpful',
    'Thanks for your help'
  ],
  goodbye: [
    'Goodbye',
    'Bye',
    'See you later',
    'I\'m done',
    'That\'s all for now',
    'Exit'
  ],
  show_conditions: [
    'Show conditions',
    'Display diagnoses',
    'What conditions does the patient have?',
    'List all diagnoses',
    'Show me the condition list',
    'What diseases does {firstName} have?',
    'Show {patientName}\'s conditions',
    'What conditions does John Doe have?',
    'Show Mary Smith\'s diagnoses',
    'List all conditions for James Wilson',
    'Display Sarah Johnson\'s recent diagnoses'
  ],
  tensorflow_status: [
    'Is TensorFlow loaded?',
    'TensorFlow status',
    'Model status',
    'Is the model ready?',
    'Check TensorFlow',
    'Is AI ready?'
  ],
  fallback: [
    'I don\'t understand',
    'What do you mean?',
    'Can you clarify?',
    'I\'m confused',
    'That doesn\'t make sense'
  ]
};
