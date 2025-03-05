import { SearchProvider, SearchResult, SearchResultType } from '../../types/search';
import { Patient } from '../../types/types';
import { searchPatients } from './patientSearch';
import { searchService } from './searchService';

export class PatientSearchProvider implements SearchProvider<Patient> {
  type = SearchResultType.PATIENT;

  async search(query: string): Promise<SearchResult<Patient>[]> {
    const patients = await searchPatients(query);
    return patients.map(patient => ({
      id: patient.id,
      title: `${patient.firstName} ${patient.lastName}`,
      subtitle: `Born: ${patient.dateOfBirth.toLocaleDateString('en-GB')} | ID: ${patient.patientId}`,
      type: this.type,
      data: patient
    }));
  }

  getKey(patient: Patient): string {
    return patient.id;
  }

  getTitle(patient: Patient): string {
    return `${patient.firstName} ${patient.lastName}`;
  }

  getSubtitle(patient: Patient): string {
    return `ID: ${patient.patientId}`;
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
