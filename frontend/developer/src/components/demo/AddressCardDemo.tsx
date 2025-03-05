import React, { useState, useEffect } from 'react';
import { AddressCard } from '@petrarca-sonnet/frontend/src/components/patient/demographics/AddressCard';
import { Address } from '@petrarca-sonnet/frontend/src/types';

interface EventLog {
  type: string;
  message: Record<string, unknown>;
  timestamp: Date;
}

const sampleAddresses: Address[] = [
  {
    id: '1',
    addressType: 'HOME',
    addressLine: '123 Main St',
    street: 'Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA'
  },
  {
    id: '2',
    addressType: 'WORK',
    addressLine: '456 Market St',
    street: 'Market St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    country: 'USA'
  }
];

export const AddressCardDemo: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
  const [primaryAddress, setPrimaryAddress] = useState<string | undefined>(sampleAddresses[0].id);
  const [events, setEvents] = useState<EventLog[]>([]);

  useEffect(() => {
    // Log initial state
    logEvent('INITIALIZE', { addresses, primaryAddress });
  }, [addresses, primaryAddress]);

  const logEvent = (type: string, message: Record<string, unknown>): void => {
    setEvents(prev => [
      { 
        type, 
        message, 
        timestamp: new Date() 
      }, 
      ...prev
    ].slice(0, 50)); // Keep only the last 50 logs
  };

  return (
    <div className="h-screen overflow-auto p-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">Address Card Demo</h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Component Overview</h2>
          <p className="text-gray-700 mb-3">
            The AddressCard component provides a user interface for managing a list of addresses. 
            It supports adding, editing, deleting, and setting a primary address.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> This demo simulates API calls with a 500ms delay. In a real application, 
              these would be actual API requests to your backend.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold mb-3">Component</h3>
            <AddressCard 
              addresses={addresses}
              primaryAddress={primaryAddress}
              onCreateAddress={async (address: Address) => {
                setAddresses(prev => [...prev, address]);
                logEvent('ADDRESS_ADDED', { addressId: address.id, address });
              }}
              onUpdateAddress={async (id: string, address: Address) => {
                setAddresses(prev => prev.map(addr => addr.id === id ? address : addr));
                logEvent('ADDRESS_CHANGED', { addressId: id, updatedAddress: address });
              }}
              onDeleteAddress={async (id: string) => {
                setAddresses(prev => prev.filter(addr => addr.id !== id));
                if (primaryAddress === id && addresses.length > 1) {
                  const newPrimaryId = addresses.find(a => a.id !== id)?.id || undefined;
                  setPrimaryAddress(newPrimaryId);
                  logEvent('PRIMARY_CHANGED', { addressId: newPrimaryId });
                }
                logEvent('ADDRESS_DELETED', { addressId: id });
              }}
              onUpdatePrimaryAddress={(addressId: string | null) => {
                if (addressId) {
                  setPrimaryAddress(addressId);
                  logEvent('PRIMARY_CHANGED', { addressId });
                } else {
                  setPrimaryAddress(undefined);
                  logEvent('PRIMARY_CHANGED', { addressId: null });
                }
              }}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold mb-2">Current State</h3>
            <div className="bg-white p-3 rounded border overflow-auto max-h-96">
              <pre className="text-xs">
                {JSON.stringify({ addresses, primaryAddress }, null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold mb-2">Event Log</h3>
            <div className="h-64 overflow-y-auto border rounded p-2">
              {events.map((log, index) => (
                <div key={index} className="text-xs border-b pb-2 mb-2 last:border-0">
                  <div className="flex justify-between">
                    <span className="font-medium">{log.type}</span>
                    <span className="text-gray-500">{log.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit',
                      hour12: false 
                    })}</span>
                  </div>
                  <pre className="mt-1 text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(log.message, null, 2)}
                  </pre>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-gray-500 text-xs italic">No events recorded yet. Try interacting with the component.</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-md font-semibold mb-3">Usage Example</h3>
          <p className="mb-4">
            View the source code for this demo component on GitHub: 
            <a 
              href="https://github.com/petrarca/sonnet/blob/main/frontend/developer/src/components/demo/AddressCardDemo.tsx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              AddressCardDemo.tsx
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddressCardDemo;
