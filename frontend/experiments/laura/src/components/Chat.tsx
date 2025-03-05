import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../services/contextService';
import { getResponseForIntent } from '../utils/intentUtils';
import { recognizeIntent, setStatusCallback, getLoadingStatus } from '../services/tensorflowService';
import { IntentMatch } from '../types/intents';

// Define message interface
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant' | 'debug';
  timestamp: string;
  intents?: IntentMatch[];
}

// Get welcome message
function getWelcomeMessage(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Good morning! I'm Laura, your virtual assistant. How can I help you today?";
  } else if (hour < 18) {
    return "Good afternoon! I'm Laura, your virtual assistant. How can I help you today?";
  } else {
    return "Good evening! I'm Laura, your virtual assistant. How can I help you today?";
  }
}

// Generate a unique ID for messages
function generateUniqueId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

/**
 * Chat component for interacting with the intent recognition system
 */
export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateUniqueId(),
      text: getWelcomeMessage(),
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState({ message: "Not started", percentage: 0 });
  const appContext = useAppContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Helper to add a new message
  const addMessage = (text: string, sender: 'user' | 'assistant' | 'debug', intents?: IntentMatch[]) => {
    const newMessage: ChatMessage = {
      id: generateUniqueId(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString(),
      intents
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Initialize with status callback
  useEffect(() => {
    // Set up status callback
    setStatusCallback(setLoadingStatus);
    
    // Check model status periodically
    const checkModelStatus = () => {
      const status = getLoadingStatus();
      setLoadingStatus(status);
      
      if (status.percentage === 100) {
        setIsModelLoaded(true);
      }
    };
    
    // Check status immediately
    checkModelStatus();
    
    // Set up interval to check status periodically
    const interval = setInterval(checkModelStatus, 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isProcessing) {
      return;
    }
    
    // Add user message
    addMessage(inputValue, 'user');
    
    // Clear input and set processing state
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // Check if model is loaded
      if (!isModelLoaded) {
        addMessage("I'm still loading. Please wait a moment...", 'assistant');
        setIsProcessing(false);
        return;
      }
      
      // Process intent
      console.log("Chat handleSubmit - Recognizing intent for:", inputValue);
      const result = await recognizeIntent(inputValue, appContext);
      console.log("Chat handleSubmit - Recognition result:", result);
      
      // Generate response based on intent
      const intentName = result.topIntent?.intent || 'unknown';
      const response = getResponseForIntent(intentName, appContext);
      console.log("Chat handleSubmit - Response:", response);
      
      // Add assistant message
      addMessage(response, 'assistant', result.intents);
    } catch (error) {
      console.error('Error detecting intent:', error);
      addMessage("I'm sorry, I encountered an error processing your request.", 'assistant');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 p-3">
        <h2 className="text-lg font-medium">Laura Assistant</h2>
        <div className={`text-xs px-2 py-1 rounded-full ${isModelLoaded ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
          {isModelLoaded ? 'Ready' : `Loading... ${loadingStatus.percentage}%`}
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-3">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-100 text-blue-900' 
                    : message.sender === 'debug'
                    ? 'bg-gray-100 text-gray-800 text-xs italic'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.text}</div>
                <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-200 bg-gray-50">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={isProcessing ? "Processing..." : "Type a message..."}
            disabled={isProcessing}
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isProcessing || !inputValue.trim()}
            className={`p-2 rounded-r-lg ${
              inputValue.trim() && !isProcessing
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
        {!isModelLoaded && (
          <div className="text-xs text-orange-600 mt-2">
            {loadingStatus.message || 'Loading TensorFlow model...'}
          </div>
        )}
      </form>
    </div>
  );
}
