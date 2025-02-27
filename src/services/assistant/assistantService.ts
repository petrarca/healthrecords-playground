import { patientService } from '../patientService';

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
      content: "Hello! I'm your medical assistant. I can help you find information about patients, medical records, or answer general healthcare questions. Try asking: \"Show me recent patients\" or \"What medical records are available?\"",
      sender: 'assistant',
      timestamp: new Date()
    });
  }

  // Subscribe to state changes
  subscribe(listener: (state: AssistantState) => void): () => void {
    this.listeners.push(listener);
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
    // Simple keyword-based response system
    // In a real implementation, this would connect to an AI service or backend
    const lowerContent = content.toLowerCase();
    
    // Wait to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));

    if (lowerContent.includes('patient') && (lowerContent.includes('list') || lowerContent.includes('recent'))) {
      try {
        const patients = await patientService.getMostRecentChangedPatients();
        
        // Create patient list with HTML links
        const patientList = patients.map(p => {
          const dob = p.dateOfBirth.toLocaleDateString();
          return `- <a href="/patients/${p.id}" class="text-blue-600 hover:underline">${p.firstName} ${p.lastName}</a> (${dob})`;
        }).join('\n');
        
        return `Here are the 10 most recent patients:\n${patientList}`;
      } catch (error) {
        console.error('Error retrieving patient list:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return `I had trouble retrieving the patient list. Error: ${errorMessage}. Please try again later.`;
      }
    }
      
    if (lowerContent.includes('hello') || lowerContent.includes('hi')) {
      return 'Hello! How can I help you with your medical inquiries today?';
    }  
      
    // Default response
    return "I'm not sure I understand your question. Could you provide more details or rephrase your query?";
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
      content: "Hello! I'm your medical assistant. I can help you find information about patients, medical records, or answer general healthcare questions. Try asking: \"Show me recent patients\" or \"What medical records are available?\"",
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
