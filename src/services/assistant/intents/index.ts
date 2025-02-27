import { IntentHandler } from './intentHandler';
import { PatientRecordIntentHandler } from './patientRecordIntent';
import { PatientListIntentHandler } from './patientListIntent';
import { GreetingIntentHandler } from './greetingIntent';
import { CurrentPatientIntentHandler } from './currentPatientIntent';
import { FallbackIntentHandler } from './fallbackIntent';

// Create and export all intent handlers
export const intentHandlers: IntentHandler[] = [
  new GreetingIntentHandler(),
  new PatientRecordIntentHandler(),
  new PatientListIntentHandler(),
  new CurrentPatientIntentHandler(),
  // The fallback handler should always be last
  new FallbackIntentHandler()
];

// Export types
export type { IntentHandler };
