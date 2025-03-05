// Context Service for Laura
// This service tracks the current application context using RxJS BehaviorSubject

import { BehaviorSubject } from 'rxjs';
import { useState, useEffect } from 'react';

// Define the patient type
export interface Patient {
  patientId: string;
  id?: string; 
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
}

// Define the view types available in the application
export type ViewType = 'summary' | 'timeline' | 'demographics' | 'profile' | 'landing' | 'vitals';

// Define the context state interface
export interface ContextState {
  currentPatient: Patient | null;
  currentView: ViewType;
  currentRecordId?: string;
  debugMode: boolean;
}

// Initial state
const initialState: ContextState = {
  currentPatient: null,
  currentView: 'landing',
  debugMode: false,
};

class ContextService {
  // Use BehaviorSubject to allow components to subscribe to context changes
  private readonly contextState = new BehaviorSubject<ContextState>(initialState);
  
  constructor() {
  }
  
  // Method to get the current state as a snapshot
  public getState(): ContextState {
    return this.contextState.getValue();
  }
  
  // Method to subscribe to context changes
  public subscribe(callback: (state: ContextState) => void) {
    return this.contextState.subscribe(callback);
  }
  
  // Method to set the current patient
  public setCurrentPatient(patient: Patient | null) {
    const currentState = this.getState();
    this.contextState.next({
      ...currentState,
      currentPatient: patient,
    });
  }
  
  // Method to set the current view
  public setCurrentView(view: ViewType, recordId?: string) {
    const currentState = this.getState();
    
    // If navigating to landing page, clear the patient and record ID
    if (view === 'landing') {
      this.contextState.next({
        ...currentState,
        currentView: view,
        currentPatient: null,
        currentRecordId: undefined,
      });
    } else {
      this.contextState.next({
        ...currentState,
        currentView: view,
        currentRecordId: recordId,
      });
    }
  }
  
  // Method to toggle debug mode
  public toggleDebugMode() {
    const currentState = this.getState();
    const newDebugMode = !currentState.debugMode;
    
    // Update context state
    this.contextState.next({
      ...currentState,
      debugMode: newDebugMode,
    });
  }
  
  // Method to set debug mode
  public setDebugMode(enabled: boolean) {
    const currentState = this.getState();
    
    // Only update if the value is changing
    if (currentState.debugMode !== enabled) {
      // Update context state
      this.contextState.next({
        ...currentState,
        debugMode: enabled,
      });
    }
  }
  
  // Method to update the context based on URL
  public updateFromUrl(pathname: string, _patientId?: string, recordId?: string) {
    let view: ViewType = 'landing';
    
    if (pathname.includes('/patients/')) {
      if (pathname.includes('/timeline')) view = 'timeline';
      else if (pathname.includes('/demographics')) view = 'demographics';
      else if (pathname.includes('/profile')) view = 'profile';
      else if (pathname.includes('/vitals')) view = 'vitals';
      else view = 'summary';
    }
    
    // If the view is landing, clear the patient
    if (view === 'landing') {
      this.contextState.next({
        ...this.getState(),
        currentView: view,
        currentPatient: null,
        currentRecordId: undefined,
      });
    } else {
      // Update the context state
      this.setCurrentView(view, recordId);
    }
  }
  
  // Method to navigate while updating context
  public navigateTo(view: ViewType, patientId?: string, recordId?: string) {
    const currentState = this.getState();
    
    // If navigating to landing page, clear the patient and record ID
    if (view === 'landing') {
      this.contextState.next({
        ...currentState,
        currentView: view,
        currentPatient: null,
        currentRecordId: undefined,
      });
      console.log(`Navigating to landing page`);
      return;
    }
    
    const patient = currentState.currentPatient;
    const id = patientId ?? patient?.patientId;
    
    if (!id) {
      console.error('Cannot navigate: No patient ID available');
      return;
    }
    
    // First update the context state
    this.setCurrentView(view, recordId);
    
    // Then navigate (in a real app, this would use a router)
    console.log(`Navigating to ${view} view for patient ${id || 'none'} ${recordId ? `with record ${recordId}` : ''}`);
  }
}

// Export a singleton instance
export const contextService = new ContextService();

// React hook for using context in components
export function useAppContext() {
  const [context, setContext] = useState<ContextState>(contextService.getState());
  
  useEffect(() => {
    // Subscribe to context changes
    const subscription = contextService.subscribe(state => {
      setContext(state);
    });
    
    // Unsubscribe on component unmount
    return () => subscription.unsubscribe();
  }, []);
  
  return context;
}
