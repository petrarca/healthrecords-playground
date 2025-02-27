import { IntentHandler } from './intentHandler';
import { contextService } from '../../contextService';

/**
 * Handler for queries about the current patient
 */
export class CurrentPatientIntentHandler implements IntentHandler {
  /**
   * Checks if the message is asking about the current patient
   */
  canHandle(content: string): boolean {
    // Only handle if we have a current patient
    const currentPatient = contextService.getState().currentPatient;
    if (!currentPatient) {
      return false;
    }

    const lowerContent = content.toLowerCase();
    
    // Check for queries about the current patient
    return (
      lowerContent.includes('patient') ||
      lowerContent.includes('demographics') ||
      lowerContent.includes('timeline') ||
      lowerContent.includes('summary') ||
      lowerContent.includes('medical profile') ||
      lowerContent.includes('show me') ||
      lowerContent.includes('navigate to')
    );
  }

  /**
   * Handles queries about the current patient
   */
  async handle(content: string): Promise<string> {
    const context = contextService.getState();
    const patient = context.currentPatient;
    
    if (!patient) {
      return "I don't have a current patient in context. Please specify which patient you'd like to view.";
    }

    const lowerContent = content.toLowerCase();
    
    // Handle navigation requests
    if (lowerContent.includes('demographics') || 
        (lowerContent.includes('show me') && lowerContent.includes('demographics'))) {
      contextService.navigateTo('demographics', patient.id);
      return `Navigating to demographics for ${patient.firstName} ${patient.lastName}.`;
    }
    
    if (lowerContent.includes('timeline') || 
        (lowerContent.includes('show me') && lowerContent.includes('timeline'))) {
      contextService.navigateTo('timeline', patient.id);
      return `Navigating to timeline for ${patient.firstName} ${patient.lastName}.`;
    }
    
    if (lowerContent.includes('summary') || 
        (lowerContent.includes('show me') && lowerContent.includes('summary'))) {
      contextService.navigateTo('summary', patient.id);
      return `Navigating to summary for ${patient.firstName} ${patient.lastName}.`;
    }
    
    if (lowerContent.includes('medical profile') || lowerContent.includes('profile') || 
        (lowerContent.includes('show me') && (lowerContent.includes('medical profile') || lowerContent.includes('profile')))) {
      contextService.navigateTo('profile', patient.id);
      return `Navigating to medical profile for ${patient.firstName} ${patient.lastName}.`;
    }
    
    // Default response with patient info
    return `You're currently viewing ${patient.firstName} ${patient.lastName}'s ${context.currentView} information. 
    
What would you like to know about this patient? You can ask to see their:
- Demographics
- Timeline
- Summary
- Medical Profile`;
  }
}
