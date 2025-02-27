import { IntentHandler } from './intentHandler';

/**
 * Handler for greeting intents like "hello" or "hi"
 */
export class GreetingIntentHandler implements IntentHandler {
  /**
   * Checks if the message is a greeting
   */
  canHandle(content: string): boolean {
    const lowerContent = content.toLowerCase();
    return lowerContent.includes('hello') || lowerContent.includes('hi');
  }

  /**
   * Handles the greeting
   */
  async handle(_content: string): Promise<string> {
    return 'Hello! How can I help you with your medical inquiries today?';
  }
}
