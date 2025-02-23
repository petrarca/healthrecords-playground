import { SearchProvider, SearchResult, SearchResultType } from '../types/search';
import { mockPatients } from './mockData';
import { searchService } from './searchService';

export class PatientSearchProvider implements SearchProvider {
  type = SearchResultType.PATIENT;

  async search(query: string): Promise<SearchResult[]> {
    const searchTerms = query.toLowerCase().split(' ');
    
    return Object.values(mockPatients)
      .filter(patient => {
        const searchableText = [
          patient.id,
          patient.firstName,
          patient.lastName,
          new Date(patient.dateOfBirth).toLocaleDateString(),
          patient.insuranceProvider
        ].join(' ').toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
      })
      .map(patient => {
        const isIdMatch = patient.id.toLowerCase().includes(query.toLowerCase());
        return {
          id: patient.id,
          title: `${patient.firstName} ${patient.lastName}`,
          subtitle: isIdMatch 
            ? `ID: ${patient.id} • Born: ${new Date(patient.dateOfBirth).toLocaleDateString()}`
            : `Born: ${new Date(patient.dateOfBirth).toLocaleDateString()}`,
          type: this.type,
          data: patient
        };
      });
  }

  getDisplayName() {
    return 'Patients';
  }

  getIcon() {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  }
}

// Register the provider
searchService.registerProvider(new PatientSearchProvider());
