import { IntentHandler } from './intentHandler';

/**
 * Handler for help requests
 */
export class HelpIntentHandler implements IntentHandler {
  /**
   * Checks if the message is a help request
   */
  canHandle(content: string): boolean {
    const lowerContent = content.toLowerCase().trim();
    return lowerContent === 'help' || 
           lowerContent === '?' || 
           lowerContent.includes('help me') || 
           lowerContent.includes('how to use') || 
           lowerContent.includes('what can you do');
  }

  /**
   * Handles the help request
   */
  async handle(_content: string): Promise<string> {
    return `<span style="color: #3b82f6; font-weight: bold;">Quick Help Guide</span>
<strong>General Commands:</strong>
• "hello" or "hi" - Greeting
• "help" or "?" - Show this help
• Press <kbd>Shift</kbd>+<kbd>Space</kbd> to toggle the assistant

<strong>General search:</strong>
• "search ..."
• "search 4711"
• "search Anderson 1988"
• "find ..."
• "find John Anderson"
• "/..."
• "/Anderson"


<strong>Patient List:</strong>
• "show recent patients"
• "patient list"
• "recent patients"

<strong>Find Patient Records:</strong>
• "medical record of John Smith"
• "record of Jane Doe"

<strong>When Viewing a Patient:</strong>
• "show vitals"
• "show demographics"
• "show timeline"
• "show summary"
• "show profile"
or say simply vitals, timeline and so on.`;
  }
}
