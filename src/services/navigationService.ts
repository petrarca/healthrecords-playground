import { NavigateFunction } from 'react-router-dom';
import { SearchResultType } from '../types/search';

class NavigationService {
  private navigate: NavigateFunction | null = null;

  setNavigate(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  navigateTo(type: SearchResultType, id: string) {
    if (!this.navigate) {
      console.error('Navigation not initialized');
      return;
    }

    switch (type) {
      case SearchResultType.PATIENT:
        this.navigateToPatientTimeline(id);
        break;
      case SearchResultType.LANDING:
        this.navigate('/');
        break;
      default:
        console.error('Unknown result type:', type);
    }
  }

  public navigateToPatientTimeline(id: string) {
    if (!this.navigate) {
      console.error('Navigation not initialized');
      return;
    }
    this.navigate(`/patients/${id}/timeline`, { replace: true });
  }
}

export const navigationService = new NavigationService();
