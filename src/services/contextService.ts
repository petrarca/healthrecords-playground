import { BehaviorSubject } from 'rxjs';
import { Patient } from '../types/patient';
import { navigationService } from './navigationService';

// Define the view types available in the application
export type ViewType = 'summary' | 'timeline' | 'demographics' | 'profile' | 'landing';

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
  private contextState = new BehaviorSubject<ContextState>(initialState);
  
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
    this.contextState.next({
      ...currentState,
      currentView: view,
      currentRecordId: recordId,
    });
  }
  
  // Method to update the context based on URL
  public updateFromUrl(pathname: string, _patientId?: string, recordId?: string) {
    let view: ViewType = 'landing';
    
    if (pathname.includes('/patients/')) {
      if (pathname.includes('/timeline')) view = 'timeline';
      else if (pathname.includes('/demographics')) view = 'demographics';
      else if (pathname.includes('/profile')) view = 'profile';
      else view = 'summary';
    }
    
    const currentState = this.getState();
    this.contextState.next({
      ...currentState,
      currentView: view,
      currentRecordId: recordId,
    });
  }
  
  // Method to navigate while updating context
  public navigateTo(view: ViewType, patientId?: string, recordId?: string) {
    const patient = this.getState().currentPatient;
    const id = patientId || patient?.patientId;
    
    if (!id && view !== 'landing') {
      console.error('Cannot navigate: No patient ID available');
      return;
    }
    
    switch (view) {
      case 'landing':
        navigationService.navigate('/');
        break;
      case 'summary':
        navigationService.navigateToPatientSummary(id!);
        break;
      case 'timeline':
        navigationService.navigateToPatientTimeline(id!, recordId);
        break;
      case 'demographics':
        navigationService.navigateToPatientDemographics(id!);
        break;
      case 'profile':
        if (id) navigationService.navigate(`/patients/${id}/profile`, { replace: true });
        break;
    }
    
    // Update the context state
    this.setCurrentView(view, recordId);
  }
  
  // Method to toggle debug mode
  public toggleDebugMode() {
    const currentState = this.getState();
    this.contextState.next({
      ...currentState,
      debugMode: !currentState.debugMode,
    });
  }
}

// Export a singleton instance
export const contextService = new ContextService();
