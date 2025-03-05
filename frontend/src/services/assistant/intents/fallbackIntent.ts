import { IntentHandler } from './intentHandler';

/**
 * Fallback handler for when no other intent matches
 */
export class FallbackIntentHandler implements IntentHandler {
  /**
   * Always returns true as this is the fallback handler
   */
  canHandle(_content: string): boolean {
    return true;
  }

  /**
   * Provides a default response
   */
  async handle(_content: string): Promise<string> {
    return "I'm not sure I understand your question. Could you provide more details or rephrase your query?";
  }
}
