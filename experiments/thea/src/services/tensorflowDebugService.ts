// TensorFlow Debug Service
// This service synchronizes TensorFlow debug mode with the application context

import * as tf from '@tensorflow/tfjs';
import { contextService } from './contextService';
import { reloadModel } from './tensorflowService';

/**
 * Initialize the TensorFlow debug service
 * This subscribes to context changes and updates TensorFlow debug mode accordingly
 */
export function initTensorFlowDebugService() {
  console.log('Initializing TensorFlow debug service');
  
  // Set initial debug mode based on context
  const initialDebugMode = contextService.getState().debugMode;

  if(initialDebugMode) {
    tf.enableDebugMode();
  }

  tf.env().set('DEBUG', initialDebugMode);
  console.log(`TensorFlow debug mode initially ${initialDebugMode ? 'enabled' : 'disabled'} based on context`);
  
  // Subscribe to context changes
  const subscription = contextService.subscribe(state => {
    // Update TensorFlow debug mode based on context
    const debugMode = state.debugMode;

    // No change in debug mode of Tensorflow
    if(tensorFlowDebugMode() == debugMode) {
      return 
    }
    
    try {
      // Enable or disable TensorFlow debug mode
      if(debugMode)
        tf.enableDebugMode();

      tf.env().set('DEBUG', debugMode);
      
      console.log(`TensorFlow debug mode ${debugMode ? 'enabled' : 'disabled'} - force reload of model`);

      // Reload model, since change in debug mode is only possible during model loading
      reloadModel()
    } catch (error) {
      console.error('Error updating TensorFlow debug mode:', error);
    }
  });
  
  // Return the subscription for cleanup if needed
  return subscription;
}

export function tensorFlowDebugMode(): boolean {
  try {
    // Use the tf.ENV.getBool method to check the DEBUG flag
    const isDebugMode = tf.ENV.getBool('DEBUG');
    return isDebugMode;
  } catch (error) {
    console.error("Error checking debug mode:", error);
    return false; // Default to false if there's an error
  }
}
