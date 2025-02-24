import React from 'react';
import { Patient, Address, AddressType } from '../../../types/patient';
import { AddressCard } from './AddressCard';
import { ContactCard } from './ContactCard';
import { InsuranceCard } from './InsuranceCard';
import { PersonalInfoCard } from './PersonalInfoCard';

interface PatientDemographicsProps {
  patient: Patient;
  onUpdatePatient?: (updatedPatient: Patient) => void;
}

export const PatientDemographics: React.FC<PatientDemographicsProps> = ({
  patient,
  onUpdatePatient
}) => {
  const handleUpdateAddresses = (addresses: Address[]) => {
    if (onUpdatePatient) {
      onUpdatePatient({
        ...patient,
        addresses
      });
    }
  };

  const handleUpdatePrimaryAddress = (type: AddressType | undefined) => {
    if (onUpdatePatient) {
      onUpdatePatient({
        ...patient,
        primaryAddressType: type
      });
    }
  };

  const handleUpdateContact = (phone: string, email: string) => {
    if (onUpdatePatient) {
      onUpdatePatient({
        ...patient,
        phone,
        email
      });
    }
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {/* Left Column: Personal Info, Contact, Addresses */}
      <div className="space-y-3">
        <PersonalInfoCard
          firstName={patient.firstName}
          lastName={patient.lastName}
          dateOfBirth={patient.dateOfBirth}
          sex={patient.sex}
        />
        <ContactCard
          phone={patient.phone || ''}
          email={patient.email || ''}
          onUpdateContact={onUpdatePatient ? handleUpdateContact : undefined}
        />
        <AddressCard 
          addresses={patient.addresses || []}
          primaryAddressType={patient.primaryAddressType}
          onUpdateAddresses={onUpdatePatient ? handleUpdateAddresses : undefined}
          onUpdatePrimaryAddress={onUpdatePatient ? handleUpdatePrimaryAddress : undefined}
        />
      </div>

      {/* Right Column: Insurance */}
      <div>
        <InsuranceCard
          provider={patient.insuranceProvider}
          number={patient.insuranceNumber}
        />
      </div>
    </div>
  );
};
