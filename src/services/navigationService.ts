import { NavigateFunction } from 'react-router-dom';
import { SearchResultType } from '../types/search';

class NavigationService {
  private navigateFunc: NavigateFunction | null = null;

  setNavigate(navigate: NavigateFunction) {
    this.navigateFunc = navigate;
  }

  navigateTo(type: SearchResultType, id: string) {
    if (!this.navigateFunc) {
      console.error('Navigation not initialized');
      return;
    }

    switch (type) {
      case SearchResultType.PATIENT:
        this.navigateToPatientTimeline(id);
        break;
      case SearchResultType.LANDING:
        this.navigateFunc('/');
        break;
      default:
        console.error('Unknown result type:', type);
    }
  }

  public navigateToPatientTimeline(id: string, recordId?: string) {
    if (!this.navigateFunc) {
      console.error('Navigation not initialized');
      return;
    }
    const path = recordId ? `/patients/${id}/timeline/${recordId}` : `/patients/${id}/timeline`;

    this.navigateFunc(path, { replace: true });
  }
  
  public navigateToPatientSummary(id: string) {
    if (!this.navigateFunc) {
      console.error('Navigation not initialized');
      return;
    }
    this.navigateFunc(`/patients/${id}/summary`, { replace: true });
  }
  
  public navigateToPatientDemographics(id: string) {
    if (!this.navigateFunc) {
      console.error('Navigation not initialized');
      return;
    }
    this.navigateFunc(`/patients/${id}/demographics`, { replace: true });
  }
  
  public navigateToPatientMedicalProfile(id: string) {
    if (!this.navigateFunc) {
      console.error('Navigation not initialized');
      return;
    }
    this.navigateFunc(`/patients/${id}/medical-profile`, { replace: true });
  }

  public navigate(path: string, options?: { replace?: boolean; state?: object }) {
    if (!this.navigateFunc) {
      console.error('Navigation not initialized');
      return;
    }
    this.navigateFunc(path, options);
  }
}

export const navigationService = new NavigationService();
