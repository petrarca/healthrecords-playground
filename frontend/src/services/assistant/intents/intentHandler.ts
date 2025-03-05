/**
 * Interface for intent handlers in the assistant service
 */
export interface IntentHandler {
  /**
   * Checks if this handler can process the given message
   * @param content The user message content
   * @param context The current assistant context
   * @returns True if this handler can process the message
   */
  canHandle(content: string): boolean;
  
  /**
   * Processes the message and generates a response
   * @param content The user message content
   * @param context The current assistant context
   * @returns A promise resolving to the response message
   */
  handle(content: string): Promise<string>;
}
