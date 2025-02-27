import React from 'react';
import { Patient } from '../../../types/patient';
import { useAddresses } from '../../../hooks/useAddresses';
import { useUpdatePrimaryAddress } from '../../../hooks/usePatient';
import { Address } from '../../../types/address';
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
  const { 
    addresses, 
    loading: addressesLoading, 
    error: addressesError,
    createAddress,
    updateAddress,
    deleteAddress
  } = useAddresses(patient.id);

  const { mutate: updatePrimaryAddress } = useUpdatePrimaryAddress();

  const handleUpdateContact = (phone: string, email: string) => {
    if (onUpdatePatient) {
      onUpdatePatient({
        ...patient,
        phone,
        email
      });
    }
  };

  const handleUpdatePrimaryAddress = (addressId: string | null) => {
    updatePrimaryAddress({ patientId: patient.id, addressId });
  };

  if (addressesLoading) {
    return <div className="p-4">Loading addresses...</div>;
  }

  if (addressesError) {
    return <div className="p-4 text-red-500">Error loading addresses: {addressesError.message}</div>;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Personal Info, Contact, Addresses */}
          <div className="space-y-3">
            <PersonalInfoCard
              firstName={patient.firstName}
              lastName={patient.lastName}
              dateOfBirth={patient.dateOfBirth}
              gender={patient.gender}
            />
            <ContactCard
              phone={patient.phone ?? ''}
              email={patient.email ?? ''}
              onUpdateContact={onUpdatePatient ? handleUpdateContact : undefined}
            />
            <AddressCard 
              addresses={addresses}
              primaryAddress={patient.primaryAddress}
              onCreateAddress={async (address: Address) => {
                await createAddress(address);
              }}
              onUpdateAddress={async (id: string, address: Address) => {
                await updateAddress(id, address);
              }}
              onDeleteAddress={async (id: string) => {
                try {
                  console.log('Deleting address with ID:', id);
                  await deleteAddress(id);
                } catch (error) {
                  console.error('Error deleting address:', error);
                  throw error;
                }
              }}
              onUpdatePrimaryAddress={handleUpdatePrimaryAddress}
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
      </div>
    </div>
  );
};
