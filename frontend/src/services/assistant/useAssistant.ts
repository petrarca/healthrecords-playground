import { useState, useEffect } from 'react';
import { assistantService, AssistantState } from './assistantService';

export const useAssistant = () => {
  const [state, setState] = useState<AssistantState>(assistantService.getState());

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = assistantService.subscribe(newState => {
      setState(newState);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return {
    messages: state.messages,
    isProcessing: state.isProcessing,
    sendMessage: (content: string) => assistantService.sendMessage(content),
    clearMessages: () => assistantService.clearMessages()
  };
};
