import React from 'react';
import { Patient, AddressType } from '../../types/patient';
import { 
  User2, 
  Home, 
  Phone, 
  BadgeAlert,
  Star,
  Settings2,
  MapPin
} from 'lucide-react';
import { CardDropdown } from '../ui/cardDropdown';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant: 'blue' | 'green' | 'purple' | 'amber';
  headerContent?: React.ReactNode;
}

const cardStyles = {
  blue: 'border-blue-200',
  green: 'border-green-200',
  purple: 'border-purple-200',
  amber: 'border-amber-200'
} as const;

const headerStyles = {
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  purple: 'bg-purple-50 border-purple-200',
  amber: 'bg-amber-50 border-amber-200'
} as const;

const iconStyles = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  amber: 'text-amber-600'
} as const;

const Card: React.FC<CardProps> = ({ title, icon, children, variant, headerContent }) => (
  <div className={`bg-white rounded shadow-sm overflow-hidden border ${cardStyles[variant]}`}>
    <div className={`border-b px-3 py-2 ${headerStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 ${iconStyles[variant]}`}>
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center">
          {headerContent}
        </div>
      </div>
    </div>
    <div className="p-3">
      {children}
    </div>
  </div>
);

interface PatientDemographicsProps {
  patient: Patient;
  onUpdatePatient?: (updatedPatient: Patient) => void;
}

const handleSetPrimaryAddress = (addressType: AddressType | '', patient: Patient, onUpdatePatient?: (updatedPatient: Patient) => void) => {
  if (onUpdatePatient) {
    onUpdatePatient({
      ...patient,
      primaryAddressType: addressType || undefined
    });
  }
};

export const PatientDemographics: React.FC<PatientDemographicsProps> = ({
  patient,
  onUpdatePatient
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleSetPrimaryAddressLocal = (addressType: AddressType | '') => {
    if (onUpdatePatient) {
      onUpdatePatient({
        ...patient,
        primaryAddressType: addressType || undefined
      });
    }
    setIsMenuOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get unique address types from patient's addresses
  const addressTypes = patient.addresses?.map(addr => addr.label) || [];

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="space-y-3">
        {/* Personal Data Card */}
        <Card title="Personal Information" icon={<User2 size={16} />} variant="blue">
          <div className="grid gap-2 text-sm">
            <div className="flex gap-4">
              <span className="text-gray-500 w-20">Name:</span>
              <span className="text-gray-900">{`${patient.firstName} ${patient.lastName}`}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-500 w-20">DOB:</span>
              <span className="text-gray-900">{patient.dateOfBirth.toLocaleDateString()}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-500 w-20">Sex:</span>
              <span className="text-gray-900">{patient.sex}</span>
            </div>
          </div>
        </Card>

        {/* Addresses Card */}
        <div className={`bg-white rounded shadow-sm overflow-hidden border border-green-200`}>
          <div className="border-b px-3 py-2 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 text-green-600">
                  <Home size={16} />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Addresses</h3>
              </div>
              {addressTypes.length > 0 && onUpdatePatient && (
                <CardDropdown
                  options={[
                    ...(patient.primaryAddressType ? [{
                      value: '',
                      label: 'No Primary Address',
                      icon: <MapPin size={14} className="text-gray-500" />
                    }] : []),
                    ...addressTypes
                      .filter(type => type !== patient.primaryAddressType)
                      .map(type => ({
                        value: type,
                        label: `Set ${type} as Primary`,
                        icon: <MapPin size={14} className="text-gray-500" />
                      }))
                  ]}
                  onSelect={handleSetPrimaryAddressLocal}
                  className="relative z-[5]"
                />
              )}
            </div>
          </div>
          <div className="p-3">
            <div className="grid gap-1.5 text-sm">
              {(!patient.addresses || patient.addresses.length === 0) ? (
                <div className="text-gray-500 italic">No addresses defined</div>
              ) : (
                patient.addresses.map((address, index) => {
                  const isPrimary = address.label === patient.primaryAddressType;
                  return (
                    <div key={index} className="flex gap-2">
                      <span className="text-gray-500 w-14">{address.label}:</span>
                      <span className="flex-1 flex items-center gap-2">
                        <span>{address.street}, {address.city}, {address.state} {address.zipCode}</span>
                        {isPrimary && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded whitespace-nowrap">
                            Primary Address
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Contact Data Card */}
        <Card title="Contact" icon={<Phone size={16} />} variant="purple">
          <div className="grid gap-2 text-sm">
            {patient.phone && (
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Phone:</span>
                <span>{patient.phone}</span>
              </div>
            )}
            {patient.email && (
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Email:</span>
                <span>{patient.email}</span>
              </div>
            )}
            {!patient.phone && !patient.email && (
              <div className="text-gray-500 italic">No contact information available</div>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        {/* Insurance Card */}
        <Card title="Insurance" icon={<BadgeAlert size={16} />} variant="amber">
          <div className="grid gap-2 text-sm">
            {patient.insuranceProvider && (
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Provider:</span>
                <span>{patient.insuranceProvider}</span>
              </div>
            )}
            {patient.insuranceNumber && (
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Number:</span>
                <span>{patient.insuranceNumber}</span>
              </div>
            )}
            {!patient.insuranceProvider && !patient.insuranceNumber && (
              <div className="text-gray-500 italic">No insurance information available</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
