import { intentHandlers } from './intents';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface AssistantState {
  messages: Message[];
  isProcessing: boolean;
}

class AssistantService {
  private state: AssistantState = {
    messages: [],
    isProcessing: false
  };

  private listeners: ((state: AssistantState) => void)[] = [];

  constructor() {
    // Initialize with a welcome message
    this.addMessage({
      id: this.generateId(),
      content: "Hello! I'm your medical assistant. I can help you find information about patients, medical records, or answer general healthcare questions. Try asking: \"Show me recent patients\", \"Medical record of John Miller\", or \"What medical records are available?\"",
      sender: 'assistant',
      timestamp: new Date()
    });
  }

  // Subscribe to state changes
  subscribe(listener: (state: AssistantState) => void): () => void {
    this.listeners.push(listener);
    // Call the listener immediately with the current state
    listener({ ...this.state });
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of state changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  // Generate a unique ID for messages
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Add a new message to the conversation
  addMessage(message: Message): void {
    this.state = {
      ...this.state,
      messages: [...this.state.messages, message]
    };
    this.notifyListeners();
  }

  // Send a user message and get a response
  async sendMessage(content: string): Promise<void> {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: this.generateId(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    this.addMessage(userMessage);
    
    // Set processing state
    this.state = { ...this.state, isProcessing: true };
    this.notifyListeners();

    try {
      // Process the message and generate a response
      const response = await this.processMessage(content);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: this.generateId(),
        content: response,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      this.addMessage(assistantMessage);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: this.generateId(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      this.addMessage(errorMessage);
    } finally {
      // Clear processing state
      this.state = { ...this.state, isProcessing: false };
      this.notifyListeners();
    }
  }

  // Process the user message and generate a response
  private async processMessage(content: string): Promise<string> {
    // Wait to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));

    // Find the first handler that can handle this message
    for (const handler of intentHandlers) {
      if (handler.canHandle(content)) {
        return await handler.handle(content);
      }
    }
    
    // This should never happen as we have a fallback handler
    return "I'm sorry, I couldn't process your request.";
  }

  // Clear all messages
  clearMessages(): void {
    this.state = {
      ...this.state,
      messages: []
    };
    
    // Add welcome message back
    this.addMessage({
      id: this.generateId(),
      content: "Hello! I'm your medical assistant. I can help you find information about patients, medical records, or answer general healthcare questions. Try asking: \"Show me recent patients\", \"Medical record of John Miller\", or \"What medical records are available?\"",
      sender: 'assistant',
      timestamp: new Date()
    });
  }

  // Get current state
  getState(): AssistantState {
    return { ...this.state };
  }
}

export const assistantService = new AssistantService();
