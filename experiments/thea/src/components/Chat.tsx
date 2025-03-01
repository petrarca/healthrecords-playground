import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../services/contextService';
import { getResponseForIntent } from '../utils/intentUtils';
import { recognizeIntent, setStatusCallback, getLoadingStatus } from '../services/tensorflowService';

// Define message interface
interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'assistant' | 'debug';
  timestamp: string;
}

// Get welcome message
const getWelcomeMessage = (): string => {
  return "Welcome to the HealthRecords Assistant! I can help you navigate and find information in your health records.\n\n" +
         "Try these commands:\n" +
         "- Show patient summary\n" +
         "- Show timeline\n" +
         "- Find allergies\n" +
         "- Find medications\n" +
         "- Show lab results\n\n" +
         "Type 'help' anytime to see this list again.";
};

// Generate a unique ID for messages
const generateUniqueId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000000);
};

// Chat component for interacting with the assistant
const Chat: React.FC = () => {
  // Get current context
  const appContext = useAppContext();
  
  // Ref to track previous context values
  const prevContextRef = useRef({
    patient: null as any,
    view: ''
  });
  
  // State for chat messages with unique IDs
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: generateUniqueId(), 
      text: getWelcomeMessage(), 
      sender: "assistant", 
      timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  
  // State for user input
  const [input, setInput] = useState<string>("");
  
  // State for TensorFlow model loading status
  const [loadingStatus, setLoadingStatus] = useState({ message: '', percentage: 0 });
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Reference for scrolling to bottom of messages
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Helper to add a new message
  const addMessage = (text: string, sender: 'user' | 'assistant' | 'debug') => {
    const newMessage: ChatMessage = {
      id: generateUniqueId(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  // Add context message when context changes
  useEffect(() => {
    // Compare with previous values to prevent duplicate messages
    const patientChanged = 
      (prevContextRef.current.patient?.id !== appContext.currentPatient?.id);
    const viewChanged = 
      (prevContextRef.current.view !== appContext.currentView);
    
    // Only add a message if something actually changed (not on initial render)
    if ((patientChanged || viewChanged) && (prevContextRef.current.view !== '')) {
      const contextMessage: ChatMessage = {
        id: generateUniqueId(),
        text: appContext.currentPatient 
          ? `Context updated: Now viewing ${appContext.currentView} for patient ${appContext.currentPatient.firstName} ${appContext.currentPatient.lastName}`
          : `Context updated: Now viewing ${appContext.currentView} page`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, contextMessage]);
    }
    
    // Update the ref with current values
    prevContextRef.current = {
      patient: appContext.currentPatient,
      view: appContext.currentView
    };
  }, [appContext.currentPatient, appContext.currentView]);
  
  // Set up status callback
  useEffect(() => {
    // Set callback for loading status updates
    setStatusCallback(setLoadingStatus);

    // Check loading status periodically
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
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  // Helper function to navigate between views
  const navigateTo = (view: string) => {
    // In a real app, this would use a router
    // For this demo, we'll just update the context
    contextService.navigateTo(view as any);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't process empty inputs
    if (!input.trim()) return;
    
    // Add user message
    addMessage(input, 'user');
    
    // Clear input
    setInput('');
    
    // Detect intent using TensorFlow
    try {
      const result = await recognizeIntent(input, appContext);
      
      // Add debug info if debug mode is enabled
      if (appContext.debugMode) {
        addMessage(JSON.stringify(result, null, 2), 'debug');
      }
      
      // Get response for the detected intent
      let response = '';
      if (result.topIntent) {
        response = getResponseForIntent(result.topIntent.intent, appContext);
      } else {
        response = "I'm not sure what you mean. Try asking for help to see what I can do.";
      }
      
      console.log("Chat handleSubmit - Response:", response);
      
      // Add assistant message
      addMessage(response, 'assistant');
    } catch (error) {
      console.error('Error detecting intent:', error);
      addMessage("I'm sorry, I encountered an error processing your request.", 'assistant');
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-lg font-medium">HealthRecords Assistant</h2>
        <div className="flex items-center gap-4">
          {appContext.currentPatient ? (
            <div className="text-xs text-blue-600">
              Patient: {appContext.currentPatient.firstName} {appContext.currentPatient.lastName}
            </div>
          ) : (
            <div className="text-xs text-blue-600">
              No patient selected
            </div>
          )}
          <div className={`text-xs px-2 py-1 rounded-full ${isModelLoaded ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
            {isModelLoaded ? 'Ready' : `Loading... ${loadingStatus.percentage}%`}
          </div>
        </div>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={messagesContainerRef}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === 'user'
                ? 'text-right'
                : message.sender === 'debug'
                ? 'text-left'
                : 'text-left'
            }`}
          >
            <div
              className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                message.sender === 'user'
                  ? 'bg-blue-100 text-blue-900'
                  : message.sender === 'debug'
                  ? 'bg-gray-800 text-green-300 font-mono text-xs overflow-x-auto'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.sender === 'debug' ? (
                <pre className="whitespace-pre-wrap break-words">{message.text}</pre>
              ) : (
                message.text
              )}
            </div>
            <div className="text-base text-gray-500 mt-1">
              {message.timestamp}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-blue-600 text-white rounded-r font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
