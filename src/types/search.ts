import { ReactNode } from 'react';

export enum SearchResultType {
  PATIENT = 'PATIENT',
  LANDING = 'LANDING'
}

export interface SearchResult<T = unknown> {
  id: string;
  title: string;
  subtitle?: string;
  type: SearchResultType;
  data: T;
}

export interface SearchProvider<T = unknown> {
  type: SearchResultType;
  search: (query: string) => Promise<SearchResult<T>[]>;
  getDisplayName: () => string;
  getIcon: () => ReactNode;
}
