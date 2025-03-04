import React from 'react';
import { Home, Plus, Check, X, Pencil, Pin, PinOff } from 'lucide-react';
import { Card } from '../../ui/card';
import { CardDropdown } from '../../ui/cardDropdown';
import { Select } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Address, AddressType } from '../../../types/address';

interface AddressCardProps {
  readonly addresses: Address[];
  readonly primaryAddress?: string;
  readonly onCreateAddress: (address: Address) => Promise<void>;
  readonly onUpdateAddress: (id: string, address: Address) => Promise<void>;
  readonly onDeleteAddress: (id: string) => Promise<void>;
  readonly onUpdatePrimaryAddress?: (addressId: string | null) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  addresses = [],
  primaryAddress = undefined,
  onCreateAddress,
  onUpdateAddress,
  onDeleteAddress,
  onUpdatePrimaryAddress
}) => {
  const [editingAddressId, setEditingAddressId] = React.useState<string | null>(null);
  const [editedAddresses, setEditedAddresses] = React.useState<Address[]>(addresses);
  const [newAddress, setNewAddress] = React.useState<Address | null>(null);
  const [addressError, setAddressError] = React.useState('');

  React.useEffect(() => {
    setEditedAddresses(addresses);
  }, [addresses]);

  const getNextAvailableAddressType = (): AddressType => {
    const existingTypes = new Set(editedAddresses.map(addr => addr.addressType));
    
    if (!existingTypes.has('HOME')) return 'HOME';
    if (!existingTypes.has('WORK')) return 'WORK';
    return 'OTHER';
  };

  const handleAddAddress = () => {
    const address: Address = {
      addressType: getNextAvailableAddressType(),
      addressLine: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    setNewAddress(address);
    setEditingAddressId('new');
  };

  const handleUpdateAddress = (address: Address, field: keyof Address, value: string) => {
    if (editingAddressId === 'new' && newAddress) {
      setNewAddress({ ...newAddress, [field]: value });
    } else if (address.id) {
      setEditedAddresses(prevAddresses => 
        prevAddresses.map(addr => 
          addr.id === address.id ? { ...addr, [field]: value } : addr
        )
      );
    }
  };

  const handleDeleteAddress = async (address: Address) => {
    if (!address.id) return;

    try {
      await onDeleteAddress(address.id);
      setEditedAddresses(prevAddresses => prevAddresses.filter(addr => addr.id !== address.id));

      // TODO : Check, not needed will be handled in the database
      //if (address.id === primaryAddress) {
      //  onUpdatePrimaryAddress?.(null);
      //}
    } catch (error) {
      console.error('Failed to delete address:', error);
      setAddressError('Failed to delete address. Please try again.');
    }
  };

  const handleStartEdit = (address: Address) => {
    setEditingAddressId(address.id ?? null);
  };

  const handleSave = async () => {
    try {
      if (editingAddressId === 'new' && newAddress) {
        await onCreateAddress(newAddress);
        setNewAddress(null);
      } else if (editingAddressId) {
        const editedAddress = editedAddresses.find(addr => addr.id === editingAddressId);
        if (editedAddress && editedAddress.id) {
          await onUpdateAddress(editedAddress.id, editedAddress);
        }
      }
      setEditingAddressId(null);
      setAddressError('');
    } catch (error) {
      console.error('Failed to save address:', error);
      setAddressError('Failed to save address. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditingAddressId(null);
    setNewAddress(null);
    setAddressError('');
  };

  const isEditing = editingAddressId !== null;

  return (
    <Card
      title="Addresses"
      icon={<Home size={16} />}
      variant="green"
      headerContent={
        onUpdatePrimaryAddress && (
          isEditing ? (
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
            <div className="flex justify-end">
              <button
                onClick={handleAddAddress}
                className="w-8 h-8 inline-flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                title="Add Address"
              >
                <Plus size={16} className="text-gray-500" />
              </button>
            </div>
          )
        )
      }
    >
      <div className="grid gap-2 text-sm">
        {editedAddresses.map((address) => (
          <div key={address.id} className="border rounded-lg p-3 bg-white shadow-sm">
            {editingAddressId === address.id ? (
              <div className="space-y-2">
                <div className="flex gap-4">
                  <div className="w-28">
                    <label 
                      htmlFor={`address-type-${address.id ?? ''}`}
                      className="text-gray-500 text-sm"
                    >
                      Type
                    </label>
                    <Select
                      id={`address-type-${address.id ?? ''}`}
                      value={address.addressType ?? ''}
                      onChange={(value) => handleUpdateAddress(address, 'addressType', value as AddressType)}
                      className="w-28"
                      size="sm"
                      options={[
                        { value: 'HOME', label: 'Home' },
                        { value: 'WORK', label: 'Work' },
                        { value: 'OTHER', label: 'Other' }
                      ]}
                    />
                  </div>
                  <div className="flex-1">
                    <label 
                      htmlFor={`address-line-${address.id ?? ''}`}
                      className="text-gray-500 text-sm"
                    >
                      Address
                    </label>
                    <input
                      id={`address-line-${address.id ?? ''}`}
                      type="text"
                      value={address.addressLine ?? ''}
                      onChange={(e) => handleUpdateAddress(address, 'addressLine', e.target.value)}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                      placeholder="Enter address"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 mb-1">{address.addressLine}</p>
                  <div className="flex items-center gap-2">
                    <Badge>
                      {address.addressType === 'HOME' ? 'Home' :
                       address.addressType === 'WORK' ? 'Work' :
                       'Other'}
                    </Badge>
                    {address.id === primaryAddress && (
                      <Badge
                        background="bg-green-50"
                        textColor="text-green-600"
                        borderColor="border-green-200"
                      >
                        Primary
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDropdown
                  options={[
                    {
                      value: 'edit',
                      label: 'Edit Address',
                      icon: <Pencil size={14} className="text-gray-500" />
                    },
                    ...(onUpdatePrimaryAddress && address.id != primaryAddress ? [
                      {
                        value: 'setPrimary',
                        label: 'Set as Primary',
                        icon: <Pin size={14} className="text-gray-500" />
                      }
                    ] : []),
                    ...(onUpdatePrimaryAddress && address.id == primaryAddress ? [
                      {
                        value: 'clearPrimary',
                        label: 'Clear Primary',
                        icon: <PinOff size={14} className="text-gray-500" />
                      }
                    ] : []),
                    {
                      value: 'delete',
                      label: 'Delete Address',
                      icon: <X size={14} className="text-gray-500" />,
                      className: 'text-red-600 hover:bg-red-50'
                    }
                  ]}
                  onSelect={async (action) => {
                    if (action === 'edit') {
                      handleStartEdit(address);
                    } else if (action === 'delete') {
                      await handleDeleteAddress(address);
                    } else if (action === 'setPrimary') {
                      onUpdatePrimaryAddress?.(address.id ?? null);
                    } else if (action === 'clearPrimary') {
                      onUpdatePrimaryAddress?.(null);
                    }
                  }}
                  disabled={newAddress !== null || editingAddressId !== null}
                />
              </div>
            )}
            {addressError && editingAddressId === address.id && (
              <p className="text-red-500 text-sm mt-1">{addressError}</p>
            )}
          </div>
        ))}
        {newAddress && (
          <div key="new" className="border rounded-lg p-3 bg-white shadow-sm">
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="w-28">
                  <label 
                    htmlFor="address-type-new"
                    className="text-gray-500 text-sm"
                  >
                    Type
                  </label>
                  <Select
                    id="address-type-new"
                    value={newAddress.addressType}
                    onChange={(value) => handleUpdateAddress(newAddress, 'addressType', value as AddressType)}
                    className="w-28"
                    size="sm"
                    options={[
                      { value: 'HOME', label: 'Home' },
                      { value: 'WORK', label: 'Work' },
                      { value: 'OTHER', label: 'Other' }
                    ]}
                  />
                </div>
                <div className="flex-1">
                  <label 
                    htmlFor="address-line-new"
                    className="text-gray-500 text-sm"
                  >
                    Address
                  </label>
                  <input
                    id="address-line-new"
                    type="text"
                    value={newAddress.addressLine ?? ''}
                    onChange={(e) => handleUpdateAddress(newAddress, 'addressLine', e.target.value)}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>
            {addressError && editingAddressId === 'new' && (
              <p className="text-red-500 text-sm mt-1">{addressError}</p>
            )}
          </div>
        )}
        {!isEditing && addresses.length === 0 && (
          <p className="text-gray-500 italic">No addresses added yet.</p>
        )}
      </div>
    </Card>
  );
};
