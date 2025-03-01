import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
// import './test'; // Import the test file instead

// Import TensorFlow.js and Universal Sentence Encoder
import * as tf from '@tensorflow/tfjs';

// Import services
import { initTensorFlowDebugService } from './services/tensorflowDebugService';

// Import Tailwind CSS
import './styles/tailwind.css';

// Initialize TensorFlow.js
console.log('TensorFlow.js initialization started');
try {
  console.log('TensorFlow.js version:', tf.version);
  
  // Initialize TensorFlow debug service
  initTensorFlowDebugService();
  console.log('TensorFlow debug service initialized');
  
  console.log('TensorFlow.js initialized successfully');
} catch (error) {
  console.error('Error initializing TensorFlow.js:', error);
}

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create a root
const root = createRoot(rootElement);

// Render the App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
