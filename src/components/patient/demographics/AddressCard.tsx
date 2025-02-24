import React from 'react';
import { Home, Trash2, Save, X, Plus } from 'lucide-react';
import { Card } from '../../ui/Card';
import { CardDropdown } from '../../ui/cardDropdown';
import { Address, AddressType } from '../../../types/patient';
import { parseAddressString, formatAddressToString } from '../../../services/addressParser';

interface AddressCardProps {
  addresses: Address[];
  primaryAddressType?: AddressType;
  onUpdateAddresses?: (addresses: Address[]) => void;
  onUpdatePrimaryAddress?: (type: AddressType | undefined) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  addresses = [],
  primaryAddressType,
  onUpdateAddresses,
  onUpdatePrimaryAddress
}) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editedAddresses, setEditedAddresses] = React.useState<Address[]>(addresses);
  const [addressInputs, setAddressInputs] = React.useState<string[]>([]);
  const [addressError, setAddressError] = React.useState('');

  React.useEffect(() => {
    setEditedAddresses(addresses);
    setAddressInputs(addresses.map(addr => formatAddressToString(addr)));
  }, [addresses]);

  const getNextAvailableAddressType = (): AddressType => {
    const existingTypes = new Set(editedAddresses.map(addr => addr.label));
    
    if (!existingTypes.has('HOME')) return 'HOME';
    if (!existingTypes.has('WORK')) return 'WORK';
    return 'OTHER';
  };

  const handleAddAddress = () => {
    const newAddress: Address = {
      label: getNextAvailableAddressType(),
      addressLine: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    setEditedAddresses([...editedAddresses, newAddress]);
    setAddressInputs([...addressInputs, '']);
  };

  const handleUpdateAddressInput = (index: number, value: string) => {
    const newInputs = [...addressInputs];
    newInputs[index] = value;
    setAddressInputs(newInputs);
  };

  const handleUpdateAddress = (index: number, field: keyof Address, value: string) => {
    const updatedAddresses = [...editedAddresses];
    if (field === 'label') {
      // Check if the address type already exists
      const typeExists = updatedAddresses.some((addr, i) => i !== index && addr.label === value);
      if (typeExists) {
        setAddressError(`An address of type ${value} already exists`);
        return;
      }
      updatedAddresses[index] = { ...updatedAddresses[index], label: value as AddressType };
      setEditedAddresses(updatedAddresses);
    }
  };

  const handleAddressInputComplete = (index: number) => {
    const value = addressInputs[index];
    if (!value) return;

    try {
      const parsedAddress = parseAddressString(value);
      // Only update if parsing was successful (got any fields)
      if (Object.keys(parsedAddress).length > 0) {
        const updatedAddresses = [...editedAddresses];
        updatedAddresses[index] = { 
          ...updatedAddresses[index],
          ...parsedAddress
        };
        setEditedAddresses(updatedAddresses);
        setAddressError('');
      } else {
        setAddressError('Could not parse address. Please use format: street, city, state zip, country');
      }
    } catch (error) {
      console.error('Error parsing address:', error);
      setAddressError('Invalid address format. Please use format: street, city, state zip, country');
    }
  };

  const handleDeleteAddress = (index: number) => {
    const updatedAddresses = editedAddresses.filter((_, i) => i !== index);
    const updatedInputs = addressInputs.filter((_, i) => i !== index);
    setEditedAddresses(updatedAddresses);
    setAddressInputs(updatedInputs);
    // If the deleted address was primary, clear the primary address type
    if (editedAddresses[index].label === primaryAddressType) {
      onUpdatePrimaryAddress?.(undefined);
    }
  };

  const handleSave = () => {
    // Validate addresses
    const hasEmptyFields = editedAddresses.some(addr => 
      !addr.street || !addr.city || !addr.state || !addr.zipCode || !addr.country
    );
    
    if (hasEmptyFields) {
      setAddressError('Please enter complete addresses in the format: street, city, state zip, country');
      return;
    }

    // Check for duplicate address types
    const types = editedAddresses.map(addr => addr.label);
    const hasDuplicates = types.some((type, index) => types.indexOf(type) !== index);
    
    if (hasDuplicates) {
      setAddressError('Each address must have a unique type');
      return;
    }

    onUpdateAddresses?.(editedAddresses);
    setIsEditMode(false);
    setAddressError('');
  };

  const handleCancel = () => {
    setEditedAddresses(addresses);
    setAddressInputs(addresses.map(addr => formatAddressToString(addr)));
    setAddressError('');
    setIsEditMode(false);
  };

  return (
    <Card 
      title="Addresses" 
      icon={<Home size={16} />} 
      variant="green"
      headerContent={
        onUpdateAddresses && (
          isEditMode ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="h-7 w-7 flex items-center justify-center rounded border border-gray-300 bg-white text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-400"
                title="Save changes"
              >
                <Save size={14} className="text-gray-500" />
              </button>
              <button
                onClick={handleCancel}
                className="h-7 w-7 flex items-center justify-center rounded border border-gray-300 bg-white text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-400"
                title="Cancel"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>
          ) : (
            <CardDropdown
              options={[
                {
                  value: 'edit',
                  label: 'Edit Addresses',
                  icon: <Home size={14} className="text-gray-500" />
                }
              ]}
              onSelect={() => setIsEditMode(true)}
              className="relative z-[5]"
            />
          )
        )
      }
    >
      <div className="grid gap-2 text-sm">
        {isEditMode ? (
          <div className="grid gap-4">
            {editedAddresses.map((address, index) => (
              <div key={index} className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-gray-500 mb-1">Address Line</label>
                    <input
                      type="text"
                      value={addressInputs[index] || ''}
                      onChange={(e) => handleUpdateAddressInput(index, e.target.value)}
                      onBlur={() => handleAddressInputComplete(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddressInputComplete(index);
                        }
                      }}
                      placeholder="Enter full address..."
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-green-400 border-gray-300"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-gray-500 mb-1">Type</label>
                    <div className="relative">
                      <select
                        value={address.label}
                        onChange={(e) => handleUpdateAddress(index, 'label', e.target.value as AddressType)}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-green-400 border-gray-300"
                      >
                        <option value="HOME">🏠 Home</option>
                        <option value="WORK">💼 Work</option>
                        <option value="OTHER">📍 Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">&nbsp;</label>
                    <button
                      onClick={() => handleDeleteAddress(index)}
                      className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-sm hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                      title="Delete address"
                    >
                      <Trash2 size={14} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {addressError && (
              <p className="mt-1 text-xs text-red-500">{addressError}</p>
            )}
            <button
              onClick={handleAddAddress}
              className="flex items-center justify-center gap-1 px-3 py-1.5 border border-gray-300 rounded bg-white text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <Plus size={14} className="text-gray-500" />
              <span>Add Address</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-2">
            {(!addresses || addresses.length === 0) ? (
              <div className="text-gray-500 italic">No addresses defined</div>
            ) : (
              addresses.map((address, index) => {
                const isPrimary = address.label === primaryAddressType;
                return (
                  <div key={index} className="flex gap-4">
                    <span className="text-gray-500 w-20">{address.label}:</span>
                    <span className="flex-1 flex items-center gap-2">
                      <span>{formatAddressToString(address)}</span>
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
        )}
      </div>
    </Card>
  );
};
