import { IntentHandler } from './intentHandler';
import { PatientRecordIntentHandler } from './patientRecordIntent';
import { PatientListIntentHandler } from './patientListIntent';
import { SearchIntentHandler } from './searchIntent';
import { GreetingIntentHandler } from './greetingIntent';
import { CurrentPatientIntentHandler } from './currentPatientIntent';
import { HelpIntentHandler } from './helpIntent';
import { FallbackIntentHandler } from './fallbackIntent';

// Create and export all intent handlers
export const intentHandlers: IntentHandler[] = [
  new GreetingIntentHandler(),
  new HelpIntentHandler(),
  new PatientRecordIntentHandler(),
  new PatientListIntentHandler(),
  new SearchIntentHandler(),
  new CurrentPatientIntentHandler(),
  // The fallback handler should always be last
  new FallbackIntentHandler()
];

// Export types
export type { IntentHandler };
