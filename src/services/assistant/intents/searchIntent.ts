import { searchService } from '../../search/searchService';
import { SearchResultType } from '../../../types/search';
import { navigationService } from '../../navigationService';
import { IntentHandler } from './intentHandler';

/**
 * Handler for the "show medical record of <patient>" intent
 */
export class SearchIntentHandler implements IntentHandler {
  /**
   * Checks if the message is asking for a patient record
   */
  canHandle(content: string): boolean {
    const lowerContent = content.toLowerCase();
    return lowerContent.includes('search') || lowerContent.includes('find') || lowerContent.startsWith('/');
  }

  /**
   * Handles the patient record request
   */
  async handle(content: string): Promise<string> {
    try {
      // Extract search query based on the format
      let searchQuery: string;
      
      if (content.startsWith('/')) {
        // For /query format, remove the leading slash
        searchQuery = content.substring(1).trim();
      } else {
        // For "search query" or "find query" format, remove the first word
        searchQuery = content.split(/\s+/).slice(1).join(' ').trim();
      }
      
      if (searchQuery) {
        const searchResults = await searchService.search(searchQuery, { type: SearchResultType.PATIENT });
        
        if (searchResults.length === 0) {
          return `I couldn't find anything with <span style="color: red">${searchQuery}</span>.`;
        } else if (searchResults.length === 1) {
          // If only one search item found, show message with clickable name and navigate directly
          const result = searchResults[0];
          
          // Navigate to the object 
          navigationService.navigateTo(result.type, result.id);
// TODO: Resolve URL          return `Found: <a href="/patients/${result.id}/timeline" class="text-blue-600 font-semibold hover:underline">${result.title}</a>${result.subtitle ? ` (${result.subtitle})` : ''}. Navigating to patient record...`;
          return `Found: ${result.title}${result.subtitle ? ` (${result.subtitle})` : ''}.`;
        } else {
          // If multiple items are found, show list
          const result = searchResults.map(result => {
  // TODO: Resolve URL            return `- <a href="/patients/${result.id}/timeline" class="text-blue-600 font-semibold hover:underline">${result.title}</a> ${result.subtitle ? `(${result.subtitle})` : ''}`;
            return `- ${result.title} ${result.subtitle ? `(${result.subtitle})` : ''}`;
          }).join('\n');
          
          return `I found multiple matches for "${searchQuery}":\n${result}`;
        }
      } else {
        return "I couldn't find the search query. Please use a format like 'search of John Smith' where 'John Smith' is the patient name.";
      }
    } catch (error) {
      console.error('Error searching for patient:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `I had trouble searching. Error: ${errorMessage}. Please try again later.`;
    }
  }
}
