export enum SearchResultType {
  PATIENT = 'PATIENT'
}

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: SearchResultType;
  data: any;
}

export interface SearchProvider {
  type: SearchResultType;
  search: (query: string) => Promise<SearchResult[]>;
  getDisplayName: () => string;
  getIcon: () => string;
}
