import React, { ReactNode, useEffect, useState } from 'react';
import { contextService, ContextState } from '../services/contextService';
import { AppContext } from '../context/AppContext';

// Provider component
export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ContextState>(contextService.getState());

  useEffect(() => {
    // Subscribe to context changes
    const subscription = contextService.subscribe(setState);
    
    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const value = {
    state,
    setCurrentPatient: contextService.setCurrentPatient.bind(contextService),
    setCurrentView: contextService.setCurrentView.bind(contextService),
    navigateTo: contextService.navigateTo.bind(contextService),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
