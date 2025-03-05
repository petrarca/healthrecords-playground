import { patientService } from '../../patientService';
import { IntentHandler } from './intentHandler';

/**
 * Handler for the "show recent patients" intent
 */
export class PatientListIntentHandler implements IntentHandler {
  /**
   * Checks if the message is asking for a list of patients
   */
  canHandle(content: string): boolean {
    const lowerContent = content.toLowerCase();
    return lowerContent.includes('patient') && 
           (lowerContent.includes('list') || lowerContent.includes('recent'));
  }

  /**
   * Handles the patient list request
   */
  async handle(_content: string): Promise<string> {
    try {
      const patients = await patientService.getMostRecentChangedPatients();
      
      // Create patient list with HTML links
      const patientList = patients.map(p => {
        const dob = p.dateOfBirth.toLocaleDateString();
        return `- <a href="/patients/${p.id}" class="text-blue-600 font-semibold hover:underline">${p.firstName} ${p.lastName}</a> (${dob})`;
      }).join('\n');
      
      return `Here are the 10 most recent patients:\n${patientList}`;
    } catch (error) {
      console.error('Error retrieving patient list:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `I had trouble retrieving the patient list. Error: ${errorMessage}. Please try again later.`;
    }
  }
}
