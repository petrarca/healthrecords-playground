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

  public navigateToPatientTimeline(id: string, recordId?: string) {
    if (!this.navigate) {
      console.error('Navigation not initialized');
      return;
    }
    const path = recordId ? `/patients/${id}/timeline/${recordId}` : `/patients/${id}/timeline`;

    this.navigate(path, { replace: true });
  }
}

export const navigationService = new NavigationService();
