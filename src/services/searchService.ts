import { SearchResult, SearchProvider } from '../types/search';

export interface SearchProvider {
  type: string;
  search: (query: string) => Promise<SearchResult[]>;
  getDisplayName: () => string;
  getIcon: () => JSX.Element;
}

class SearchService {
  private providers: SearchProvider[] = [];

  registerProvider(provider: SearchProvider) {
    this.providers.push(provider);
  }

  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      // Get results from all providers
      const results = await Promise.all(
        this.providers.map(provider => provider.search(query))
      );
      
      // Flatten and remove duplicates based on ID
      const flatResults = results.flat();
      const uniqueResults = flatResults.filter((result, index) => {
        const firstIndex = flatResults.findIndex(r => r.id === result.id);
        return firstIndex === index;
      });
      
      // Sort results by title
      return uniqueResults.sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }
}

export const searchService = new SearchService();
