import React from '../$node_modules/.pnpm/@types+react@18.3.18/$node_modules/@types/react/index.js';
import { createRoot } from '../$node_modules/.pnpm/@types+react-dom@18.3.5_@types+react@18.3.18/$node_modules/@types/react-dom/client.js';
import App from './components/App';
// import './test'; // Import the test file instead

// Import TensorFlow.js and Universal Sentence Encoder
import * as tf from '../$node_modules/.pnpm/@tensorflow+tfjs@4.22.0_seedrandom@3.0.5/$node_modules/@tensorflow/tfjs/dist/index.js';

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
