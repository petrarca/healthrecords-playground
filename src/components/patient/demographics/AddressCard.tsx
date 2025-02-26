import React from 'react';
import { Home, Plus, Check, X, Pencil, Pin, PinOff } from 'lucide-react';
import { Card } from '../../ui/card';
import { CardDropdown } from '../../ui/cardDropdown';
import { Address, AddressType } from '../../../types/patient';

interface AddressCardProps {
  addresses: Address[];
  primaryAddressType?: AddressType;
  onUpdateAddresses?: (addresses: Address[]) => void;
  onUpdatePrimaryAddress?: (type: AddressType | undefined) => void;
}

interface EditableAddress extends Address {
  tempId: string;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  addresses = [],
  primaryAddressType,
  onUpdateAddresses,
  onUpdatePrimaryAddress
}) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editedAddresses, setEditedAddresses] = React.useState<EditableAddress[]>(
    addresses.map(addr => ({ ...addr, tempId: crypto.randomUUID() }))
  );
  const [addressError, setAddressError] = React.useState('');

  React.useEffect(() => {
    setEditedAddresses(addresses.map(addr => ({ ...addr, tempId: crypto.randomUUID() })));
  }, [addresses]);

  const getNextAvailableAddressType = (): AddressType => {
    const existingTypes = new Set(editedAddresses.map(addr => addr.addressType));
    
    if (!existingTypes.has('HOME')) return 'HOME';
    if (!existingTypes.has('WORK')) return 'WORK';
    return 'OTHER';
  };

  const handleAddAddress = () => {
    const newAddress: EditableAddress = {
      tempId: crypto.randomUUID(),
      addressType: getNextAvailableAddressType(),
      addressLine: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    setEditedAddresses([...editedAddresses, newAddress]);
  };

  const handleUpdateAddress = (address: EditableAddress, field: keyof Address, value: string) => {
    const updatedAddresses = [...editedAddresses];
    const index = updatedAddresses.findIndex(addr => addr.tempId === address.tempId);
    if (index !== -1) {
      if (field === 'addressType') {
        // Check if the address type already exists
        const typeExists = updatedAddresses.some((addr, i) => i !== index && addr.addressType === value);
        if (typeExists) {
          setAddressError(`An address of type ${value} already exists`);
          return;
        }
        updatedAddresses[index] = { ...updatedAddresses[index], addressType: value as AddressType };
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
    }
  };

  const handleDeleteAddress = (address: EditableAddress) => {
    const updatedAddresses = editedAddresses.filter(addr => addr.tempId !== address.tempId);
    setEditedAddresses(updatedAddresses);
    // If the deleted address was primary, clear the primary address type
    if (address.addressType === primaryAddressType) {
      onUpdatePrimaryAddress?.(undefined);
    }
  };

  const handleSave = () => {
    onUpdateAddresses?.(editedAddresses.map(addr => ({ ...addr, tempId: undefined })));
    setIsEditMode(false);
    setAddressError('');
  };

  const handleCancel = () => {
    setEditedAddresses(addresses.map(addr => ({ ...addr, tempId: crypto.randomUUID() })));
    setAddressError('');
    setIsEditMode(false);
  };

  const getAddressKey = (address: Address): string => {
    const parts = [
      address.addressType,
      address.addressLine ?? '',
      address.street ?? '',
      address.city ?? '',
      address.state ?? '',
      address.zipCode ?? '',
      address.country ?? ''
    ];
    return parts.join('-');
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
                className="flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium text-green-700 hover:bg-green-50"
              >
                <Check size={14} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          ) : (
            <CardDropdown
              options={[
                { 
                  value: 'edit', 
                  label: 'Edit Addresses',
                  icon: <Pencil size={14} className="text-gray-500" />
                },
                ...(addresses.length > 0 ? [
                  ...addresses
                    .filter(addr => addr.addressLine?.trim() && addr.addressType !== primaryAddressType)
                    .map(addr => ({
                      value: `setPrimary_${addr.addressType}`,
                      label: `Set ${addr.addressType} as Primary`,
                      icon: <Pin size={14} className="text-gray-500" />
                    })),
                  ...(primaryAddressType ? [
                    { 
                      value: 'clearPrimary', 
                      label: 'Clear Primary Address',
                      icon: <PinOff size={14} className="text-gray-500" />
                    }
                  ] : [])
                ] : [])
              ]}
              onSelect={(action) => {
                if (action === 'edit') {
                  setIsEditMode(true);
                } else if (action === 'clearPrimary') {
                  onUpdatePrimaryAddress?.(undefined);
                } else if (action.startsWith('setPrimary_')) {
                  const addressType = action.split('_')[1] as AddressType;
                  onUpdatePrimaryAddress?.(addressType);
                }
              }}
              className="text-gray-500"
            />
          )
        )
      }
    >
      <div className="grid gap-2 text-sm">
        {isEditMode ? (
          <div className="grid gap-4">
            {editedAddresses.map((address) => (
              <div key={address.tempId} className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label 
                      htmlFor={`address-line-${address.tempId}`}
                      className="block text-gray-500 mb-1"
                    >
                      Address
                    </label>
                    <input
                      id={`address-line-${address.tempId}`}
                      type="text"
                      value={address.addressLine ?? ''}
                      onChange={(e) => handleUpdateAddress(address, 'addressLine', e.target.value)}
                      placeholder="Enter address..."
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-green-400 border-gray-300"
                    />
                  </div>
                  <div>
                    <label 
                      htmlFor={`address-type-${address.tempId}`}
                      className="block text-gray-500 mb-1"
                    >
                      Address Type
                    </label>
                    <div className="relative">
                      <select
                        id={`address-type-${address.tempId}`}
                        value={address.addressType}
                        onChange={(e) => handleUpdateAddress(address, 'addressType', e.target.value as AddressType)}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-green-400 border-gray-300"
                      >
                        <option value="HOME">🏠 Home</option>
                        <option value="WORK">💼 Work</option>
                        <option value="OTHER">📍 Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label 
                      htmlFor={`delete-address-${address.tempId}`}
                      className="block text-gray-500 mb-1"
                    >
                      Actions
                    </label>
                    <button
                      id={`delete-address-${address.tempId}`}
                      onClick={() => handleDeleteAddress(address)}
                      className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-sm hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors"
                      title="Delete address"
                      aria-label="Delete address"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
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
              addresses.map((address) => {
                const isPrimary = address.addressType === primaryAddressType;
                return (
                  <div key={getAddressKey(address)} className="flex gap-4">
                    <span className="text-gray-500 w-20">{address.addressType}:</span>
                    <span className="flex-1 flex items-center gap-2">
                      <span>{address.addressLine ?? ''}</span>
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
