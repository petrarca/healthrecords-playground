import { searchService } from '../../search/searchService';
import { SearchResultType } from '../../../types/search';
import { navigationService } from '../../navigationService';
import { IntentHandler } from './intentHandler';

/**
 * Handler for the "show medical record of <patient>" intent
 */
export class PatientRecordIntentHandler implements IntentHandler {
  /**
   * Checks if the message is asking for a patient record
   */
  canHandle(content: string): boolean {
    const lowerContent = content.toLowerCase();
    return lowerContent.includes('record of') || lowerContent.includes('medical record of');
  }

  /**
   * Handles the patient record request
   */
  async handle(content: string): Promise<string> {
    try {
      // Extract patient name (everything after "of ")
      const ofIndex = content.toLowerCase().indexOf('of ');
      if (ofIndex !== -1) {
        const patientSearchQuery = content.substring(ofIndex + 3).trim();
        
        // Search for patient using searchService
        const searchResults = await searchService.search(patientSearchQuery, { type: SearchResultType.PATIENT });
        
        if (searchResults.length === 0) {
          return `I couldn't find any patients matching "${patientSearchQuery}". Please try a different name or check the spelling.`;
        } else if (searchResults.length === 1) {
          // If only one patient found, show message with clickable name and navigate directly
          const result = searchResults[0];
          
          // Navigate to the patient's timeline
          navigationService.navigateToPatientTimeline(result.id);
          return `Found patient: <a href="/patients/${result.id}/timeline" class="text-blue-600 font-semibold hover:underline">${result.title}</a>${result.subtitle ? ` (${result.subtitle})` : ''}. Navigating to patient record...`;
        } else {
          // If multiple patients found, show list
          const patientList = searchResults.map(result => {
            return `- <a href="/patients/${result.id}/timeline" class="text-blue-600 font-semibold hover:underline">${result.title}</a> ${result.subtitle ? `(${result.subtitle})` : ''}`;
          }).join('\n');
          
          return `I found multiple patients matching "${patientSearchQuery}":\n${patientList}`;
        }
      } else {
        return "I couldn't find the patient name. Please use a format like 'record of John Smith' where 'John Smith' is the patient name.";
      }
    } catch (error) {
      console.error('Error searching for patient:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `I had trouble searching for the patient. Error: ${errorMessage}. Please try again later.`;
    }
  }
}
