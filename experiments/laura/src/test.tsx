import React from 'react';
import { createRoot } from 'react-dom/client';

// Simple test component
const TestApp = () => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-blue-600">Test Component</h1>
      <p className="mt-4">If you can see this, React is working correctly.</p>
    </div>
  );
};

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create a root
const root = createRoot(rootElement);

// Render the Test App
root.render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);
