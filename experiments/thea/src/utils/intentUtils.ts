// Intent utilities for Thea
import { ContextState } from '../services/contextService';

// Define intent interface
export interface Intent {
  name: string;
  examples: string[];
  contextRelevance?: {
    views?: string[];
    requiresPatient?: boolean;
    requiresRecord?: boolean;
  };
}

// Define intents with examples
export const intents: Intent[] = [
  {
    name: 'greeting',
    examples: [
      'Hello',
      'Hi',
      'Hey there',
      'Good morning',
      'Good afternoon',
      'Good evening',
      'How are you?',
      'What\'s up?'
    ],
    contextRelevance: {
      views: ['*'],
      requiresPatient: false,
      requiresRecord: false
    }
  },
  {
    name: 'help',
    examples: [
      'Help',
      'I need help',
      'What can you do?',
      'What commands are available?',
      'Show me what you can do',
      'How do I use this?',
      'Give me some examples',
      'What are my options?'
    ],
    contextRelevance: {
      views: ['*'],
      requiresPatient: false,
      requiresRecord: false
    }
  },
  {
    name: 'show_patient',
    examples: [
      'Show patient information',
      'Display patient details',
      'Show me the patient',
      'Who is the patient?',
      'Tell me about the patient',
      'Patient info',
      'Show patient {patientId}',
      'Tell me about {patientName}'
    ],
    contextRelevance: {
      requiresPatient: true
    }
  },
  {
    name: 'show_records',
    examples: [
      'Show medical records',
      'Display health records',
      'Show me the records',
      'List all records',
      'What records are available?',
      'Show records for patient {patientId}',
      'Show {firstName}\'s records'
    ],
    contextRelevance: {
      views: ['summary', 'timeline'],
      requiresPatient: true
    }
  },
  {
    name: 'show_medications',
    examples: [
      'Show medications',
      'Display current medications',
      'What medications is the patient on?',
      'List all medications',
      'Show me the medication list',
      'What drugs is {firstName} taking?',
      'Show {patientName}\'s medications'
    ],
    contextRelevance: {
      views: ['summary'],
      requiresPatient: true
    }
  },
  {
    name: 'show_allergies',
    examples: [
      'Show allergies',
      'Display patient allergies',
      'What allergies does the patient have?',
      'List all allergies',
      'Show me the allergy list',
      'What is {firstName} allergic to?',
      'Show {patientName}\'s allergies'
    ],
    contextRelevance: {
      views: ['summary'],
      requiresPatient: true
    }
  },
  {
    name: 'show_vitals',
    examples: [
      'Show vital signs',
      'Display vitals',
      'What are the patient\'s vitals?',
      'Show me the vital signs',
      'Show blood pressure',
      'What\'s the heart rate?',
      'Show {patientName}\'s vitals'
    ],
    contextRelevance: {
      views: ['summary', 'vitals'],
      requiresPatient: true
    }
  },
  {
    name: 'show_labs',
    examples: [
      'Show lab results',
      'Display laboratory tests',
      'What lab work has been done?',
      'Show me the lab results',
      'Show recent labs',
      'What are {firstName}\'s lab values?',
      'Show {patientName}\'s lab results'
    ],
    contextRelevance: {
      views: ['summary', 'timeline'],
      requiresPatient: true
    }
  },
  {
    name: 'navigate',
    examples: [
      'Go to summary',
      'Navigate to timeline',
      'Show demographics',
      'Take me to profile',
      'Switch to vitals view',
      'Go back to landing page',
      'Open the timeline'
    ],
    contextRelevance: {
      views: ['*'],
      requiresPatient: false,
      requiresRecord: false
    }
  },
  {
    name: 'show_record_details',
    examples: [
      'Show record details',
      'Display record information',
      'Tell me more about this record',
      'What\'s in this record?',
      'Show details for record {recordId}',
      'Open record {recordId}'
    ],
    contextRelevance: {
      views: ['timeline'],
      requiresPatient: true,
      requiresRecord: true
    }
  },
  {
    name: 'thanks',
    examples: [
      'Thank you',
      'Thanks',
      'Thanks a lot',
      'I appreciate it',
      'That was helpful',
      'Thanks for your help'
    ],
    contextRelevance: {
      views: ['*'],
      requiresPatient: false,
      requiresRecord: false
    }
  },
  {
    name: 'goodbye',
    examples: [
      'Goodbye',
      'Bye',
      'See you later',
      'I\'m done',
      'That\'s all',
      'Exit',
      'Close'
    ],
    contextRelevance: {
      views: ['*'],
      requiresPatient: false,
      requiresRecord: false
    }
  },
  {
    name: 'tensorflow_status',
    examples: [
      'Is TensorFlow loaded?',
      'TensorFlow status',
      'Model status',
      'Is the model ready?',
      'Check TensorFlow',
      'Is AI ready?'
    ],
    contextRelevance: {
      views: ['*'],
      requiresPatient: false,
      requiresRecord: false
    }
  },
  {
    name: 'show_conditions',
    examples: [
      'Show conditions',
      'Display diagnoses',
      'What conditions does the patient have?',
      'List all diagnoses',
      'Show me the problem list',
      'What is {firstName} diagnosed with?',
      'Show {patientName}\'s conditions'
    ],
    contextRelevance: {
      views: ['summary'],
      requiresPatient: true
    }
  },
  {
    name: 'show_visits',
    examples: [
      'Show visits',
      'Display encounters',
      'What visits has the patient had?',
      'List all appointments',
      'Show me the visit history',
      'When did {firstName} last see a doctor?',
      'Show {patientName}\'s visits'
    ],
    contextRelevance: {
      views: ['timeline'],
      requiresPatient: true
    }
  },
  {
    name: 'fallback',
    examples: [
      'I don\'t understand',
      'What do you mean?',
      'Can you clarify?',
      'I\'m confused',
      'That doesn\'t make sense'
    ],
    contextRelevance: {
      views: ['*'],
      requiresPatient: false,
      requiresRecord: false
    }
  }
];

/**
 * Get a response for a specific intent based on the current context
 * @param intentName The name of the intent
 * @param context The current application context
 * @returns A response string for the intent
 */
export function getResponseForIntent(intentName: string, context: ContextState): string {
  // Navigation intents
  if (intentName === 'navigate') {
    if (context.currentView === 'landing') {
      return "Navigating to landing page.";
    } else if (context.currentView === 'summary') {
      return "Navigating to patient summary view.";
    } else if (context.currentView === 'timeline') {
      return "Navigating to timeline view.";
    } else if (context.currentView === 'demographics') {
      return "Navigating to demographics view.";
    } else if (context.currentView === 'profile') {
      return "Navigating to profile view.";
    } else if (context.currentView === 'vitals') {
      return "Navigating to vitals view.";
    }
  }
  
  // Check if we're in landing page with no patient
  if (context.currentView === 'landing' && !context.currentPatient) {
    if (intentName !== 'greeting' && 
        intentName !== 'goodbye' && 
        intentName !== 'thanks' && 
        intentName !== 'help' && 
        intentName !== 'navigate') {
      return "Please select a patient first to use this feature. You can select a patient using the dropdown at the top, or say 'go to summary' to navigate with a demo patient.";
    }
  }
  
  // Patient info intent
  if (intentName === 'show_patient') {
    if (context.currentPatient) {
      const patient = context.currentPatient;
      return `Current patient: ${patient.firstName} ${patient.lastName}\nPatient ID: ${patient.patientId}\nDate of Birth: ${patient.dateOfBirth}\nGender: ${patient.gender}`;
    } else {
      return "No patient is currently selected.";
    }
  }
  
  // Context-aware responses based on current view
  if (context.currentView === 'summary') {
    if (intentName === 'show_allergies') {
      return "Patient has allergies to: Penicillin, Peanuts, Latex";
    } else if (intentName === 'show_medications') {
      return "Current medications: Lisinopril 10mg daily, Atorvastatin 20mg daily, Metformin 500mg twice daily";
    } else if (intentName === 'show_conditions') {
      return "Active conditions: Hypertension, Type 2 Diabetes, Hyperlipidemia";
    }
  } else if (context.currentView === 'timeline') {
    if (intentName === 'show_records') {
      return "Recent visits:\n- 2024-12-15: Annual physical\n- 2024-10-03: Diabetes follow-up\n- 2024-07-22: Urgent care (respiratory infection)";
    } else if (intentName === 'show_labs') {
      return "Recent lab results:\n- 2024-12-15: Comprehensive metabolic panel (normal)\n- 2024-12-15: Lipid panel (elevated LDL)\n- 2024-10-03: HbA1c (6.8%)";
    }
  }
  
  // Default responses for other intents
  switch (intentName) {
    case 'greeting':
      return "Hello! I'm your HealthRecords Assistant. How can I help you today?";
    
    case 'help':
      return "I can help you with:\n- Viewing patient information\n- Checking medications, allergies, and conditions\n- Viewing lab results and medical records\n- Navigating between different views\n\nTry asking me something like 'Show medications' or 'What are the patient's allergies?'";
    
    case 'thanks':
      return "You're welcome! Is there anything else I can help you with?";
    
    case 'goodbye':
      return "Goodbye! Feel free to ask if you need any assistance later.";
    
    case 'show_labs':
      return "Here are your recent lab results: Glucose: 95 mg/dL, HbA1c: 5.7%, Cholesterol: 180 mg/dL";
    
    case 'show_medications':
      return "Your current medications are: Lisinopril 10mg daily, Atorvastatin 20mg daily, Metformin 500mg twice daily";
    
    case 'show_allergies':
      return "You have the following allergies on record: Penicillin, Peanuts, Latex";
    
    case 'show_vitals':
      return "Recent vitals: BP 120/80, HR 72, Temp 98.6°F, Weight 180 lbs";
    
    default:
      if (context.currentView === 'landing') {
        return "I'm not sure I understand. You can select a patient using the dropdown, or type 'help' to see what I can do.";
      } else {
        return "I'm sorry, I don't understand that request. Type 'help' to see a list of commands and features I can assist you with.";
      }
  }
};

// Simple intent matching function
export function matchIntent(input: string, context?: ContextState): string {
  input = input.toLowerCase();
  
  // Default to unknown intent
  let bestMatch = 'unknown';
  let highestScore = 0;
  
  // Check each intent
  for (const intent of intents) {
    for (const example of intent.examples) {
      const exampleLower = example.toLowerCase();
      
      // Calculate similarity (very simple for demo)
      let score = 0;
      const words = exampleLower.split(' ');
      for (const word of words) {
        if (input.includes(word) && word.length > 2) {
          score += 1;
        }
      }
      
      // Normalize by number of words
      score = score / words.length;
      
      // Apply context boost if applicable
      if (context && intent.contextRelevance) {
        // Boost score if intent is relevant to current view
        if (intent.contextRelevance.views) {
          if (intent.contextRelevance.views.includes('*') || 
              intent.contextRelevance.views.includes(context.currentView)) {
            score *= 1.2;
          } else {
            // Intent is not relevant to current view, but still available
            score *= 0.8;
          }
        }
        
        // Reduce score if intent requires patient but none is set
        if (intent.contextRelevance.requiresPatient && !context.currentPatient) {
          score *= 0.5;
        }
        
        // Reduce score if intent requires record but none is set
        if (intent.contextRelevance.requiresRecord && !context.currentRecordId) {
          score *= 0.5;
        }
      }
      
      // Update best match if score is higher
      if (score > highestScore) {
        highestScore = score;
        bestMatch = intent.name;
      }
    }
  }
  
  // Threshold for matching
  if (highestScore < 0.3) {
    return 'unknown';
  }
  
  return bestMatch;
}
