import React from 'react';
import { Home, Trash2, Plus } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Address, AddressType } from '../../../types/patient';

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
  const [addressError, setAddressError] = React.useState('');

  React.useEffect(() => {
    setEditedAddresses(addresses);
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
    } else if (field === 'addressLine') {
      updatedAddresses[index] = { 
        ...updatedAddresses[index], 
        addressLine: value,
        // Clear other fields since we're using addressLine only
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      };
    }
    setEditedAddresses(updatedAddresses);
    setAddressError('');
  };

  const handleDeleteAddress = (index: number) => {
    const updatedAddresses = editedAddresses.filter((_, i) => i !== index);
    setEditedAddresses(updatedAddresses);
    // If the deleted address was primary, clear the primary address type
    if (editedAddresses[index].label === primaryAddressType) {
      onUpdatePrimaryAddress?.(undefined);
    }
  };

  const handleSave = () => {
    onUpdateAddresses?.(editedAddresses);
    setIsEditMode(false);
    setAddressError('');
  };

  const handleCancel = () => {
    setEditedAddresses(addresses);
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
                className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Save changes"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Cancel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsEditMode(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {isEditMode && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        onUpdatePrimaryAddress?.(undefined);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear Primary Address
                    </button>
                    {addresses
                      .filter(addr => addr.label !== primaryAddressType)
                      .map(addr => (
                        <button
                          key={addr.label}
                          onClick={() => {
                            setIsEditMode(false);
                            onUpdatePrimaryAddress?.(addr.label);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Set {addr.label} as Primary
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </>
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
                    <label className="block text-gray-500 mb-1">Address</label>
                    <input
                      type="text"
                      value={address.addressLine || ''}
                      onChange={(e) => handleUpdateAddress(index, 'addressLine', e.target.value)}
                      placeholder="Enter address..."
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
                      <span>{address.addressLine || ''}</span>
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
