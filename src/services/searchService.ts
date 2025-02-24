import { SearchProvider, SearchResult, SearchResultType } from '../types/search';
import { mockDataService } from './mockData';

export interface SearchOptions {
  type?: SearchResultType | 'ALL';
}

const patientProvider: SearchProvider = {
  type: SearchResultType.PATIENT,
  search: async (query: string) => {
    const patients = await mockDataService.getPatients();
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return patients
      .filter(patient => {
        const searchableText = [
          patient.id,
          patient.firstName,
          patient.lastName,
          patient.dateOfBirth.toLocaleDateString(),
          patient.insuranceProvider,
          patient.primaryPhysician,
          patient.bloodType,
          ...(patient.allergies || [])
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
      })
      .map(patient => ({
        id: patient.id,
        title: `${patient.firstName} ${patient.lastName}`,
        subtitle: `DOB: ${patient.dateOfBirth.toLocaleDateString()}`,
        type: SearchResultType.PATIENT,
        data: patient
      }));
  },
  getDisplayName: () => 'Patients',
  getIcon: () => '👤'
};

class SearchService {
  private readonly providers: SearchProvider[] = [];

  constructor() {
    this.registerProvider(patientProvider);
  }

  registerProvider(provider: SearchProvider) {
    this.providers.push(provider);
  }

  async search(query: string, options: SearchOptions = { type: 'ALL' }): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      // Filter providers based on type if specified
      const activeProviders = options.type === 'ALL' 
        ? this.providers
        : this.providers.filter(provider => provider.type === options.type);

      // Search across all active providers in parallel
      const results = await Promise.all(
        activeProviders.map(provider => provider.search(query))
      );
      
      // Flatten and remove duplicates based on ID
      const flatResults = results.flat();
      const uniqueResults = flatResults.filter((result, index) => {
        const firstIndex = flatResults.findIndex(r => r.id === result.id);
        return firstIndex === index;
      });
      
      // Sort results
      return uniqueResults.sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  getProviderByType(type: string): SearchProvider | undefined {
    return this.providers.find(provider => provider.type === type);
  }

  getProviders(): SearchProvider[] {
    return this.providers;
  }
}

// Create and export singleton instance
export const searchService = new SearchService();
