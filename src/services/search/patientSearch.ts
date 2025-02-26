import { Patient } from '../../types/types';
import { getClient } from '../../lib/supabase';
import { PatientTable } from '../../models/databaseModel';
import { mapDatabaseToPatient } from '../mappers/patientMapper';
import { SEARCH_CONSTANTS } from '../../constants/search';

type ParsedSearchQuery = {
  type: 'all' | 'text';
  value: string;
};

function parseSearchQuery(query: string): ParsedSearchQuery {
  const trimmedQuery = query.trim();
  
  if (!trimmedQuery) {
    return { type: 'text', value: '' };
  }

  if (trimmedQuery === SEARCH_CONSTANTS.SHOW_ALL_RESULTS) {
    return { type: 'all', value: '' };
  }

  return { type: 'text', value: trimmedQuery };
}

async function searchAll(): Promise<Patient[]> {
  const { data, error } = await getClient()
    .from('patients')
    .select()
    .limit(100) as { data: PatientTable[] | null, error: Error | null };

  if (error) {
    console.error('Error fetching all patients:', error);
    return [];
  }

  return (data || []).map(mapDatabaseToPatient);
}

async function searchByText(query: string): Promise<Patient[]> {
  if (!query.trim()) {
    return [];
  }

  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  const { data, error } = await getClient()
    .rpc('search_patients', {
      search_terms: searchTerms
    }) as { data: PatientTable[] | null, error: Error | null };

  if (error) {
    console.error('Error searching patients:', error);
    return [];
  }

  return (data || []).map(mapDatabaseToPatient);
}

async function executeSearch(parsedQuery: ParsedSearchQuery): Promise<Patient[]> {
  switch (parsedQuery.type) {
    case 'all':
      return searchAll();
    case 'text':
      return searchByText(parsedQuery.value);
    default:
      return [];
  }
}

export async function searchPatients(query: string): Promise<Patient[]> {
  const parsedQuery = parseSearchQuery(query);
  return executeSearch(parsedQuery);
}
