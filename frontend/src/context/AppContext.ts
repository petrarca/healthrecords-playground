import { createContext } from 'react';
import { contextService, ContextState } from '../services/contextService';

// Create context
export const AppContext = createContext<{
  state: ContextState;
  setCurrentPatient: typeof contextService.setCurrentPatient;
  setCurrentView: typeof contextService.setCurrentView;
  navigateTo: typeof contextService.navigateTo;
  toggleDebugMode: typeof contextService.toggleDebugMode;
}>({
  state: {
    currentPatient: null,
    currentView: 'landing',
    debugMode: false,
  },
  setCurrentPatient: () => {},
  setCurrentView: () => {},
  navigateTo: () => {},
  toggleDebugMode: () => {},
});
