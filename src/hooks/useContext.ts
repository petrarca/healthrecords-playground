import { useEffect, useState } from 'react';
import { contextService, ContextState } from '../services/contextService';

/**
 * Custom hook to access the application context
 * @returns The current context state and methods to update it
 */
export function useAppContext() {
  const [state, setState] = useState<ContextState>(contextService.getState());

  useEffect(() => {
    // Subscribe to context changes
    const subscription = contextService.subscribe(setState);
    
    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  return {
    // Current state
    currentPatient: state.currentPatient,
    currentView: state.currentView,
    currentRecordId: state.currentRecordId,
    
    // Methods to update context
    setCurrentPatient: contextService.setCurrentPatient.bind(contextService),
    setCurrentView: contextService.setCurrentView.bind(contextService),
    navigateTo: contextService.navigateTo.bind(contextService),
  };
}
