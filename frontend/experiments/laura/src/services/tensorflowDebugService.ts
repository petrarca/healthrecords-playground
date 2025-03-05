/**
 * TensorFlow Debug Service
 */
import * as tf from '@tensorflow/tfjs';
import { contextService } from './contextService';
import { reloadModel } from './tensorflowService';

/**
 * Initialize the TensorFlow debug service
 * @returns Cleanup function to unsubscribe
 */
export function initTensorFlowDebugService() {
  console.log('Initializing TensorFlow debug service');
  
  // Set initial debug mode based on context
  const initialDebugMode = contextService.getState().debugMode;
  if (initialDebugMode) {
    tf.env().set('DEBUG', true);
  }

  tf.env().set('DEBUG', initialDebugMode);
  console.log(`TensorFlow debug mode initially ${initialDebugMode ? 'enabled' : 'disabled'} based on context`);
  
  // Subscribe to context changes
  const subscription = contextService.subscribe(state => {
    try {
      const debugMode = state.debugMode;
      
      // Skip if debug mode hasn't changed
      const currentDebugMode = tf.ENV.getBool('DEBUG');
      if (debugMode === currentDebugMode) {
        return;
      }

      tf.env().set('DEBUG', debugMode);
      
      console.log(`TensorFlow debug mode ${debugMode ? 'enabled' : 'disabled'} - force reload of model`);

      // Reload model, since change in debug mode is only possible during model loading
      reloadModel()
        .catch(error => console.error('Error reloading model after debug mode change:', error));
    } catch (error) {
      console.error('Error updating TensorFlow debug mode:', error);
    }
  });
  
  // Return cleanup function
  return () => subscription.unsubscribe();
}

export function isDebugModeEnabled(): boolean {
  try {
    const isDebugMode = tf.ENV.getBool('DEBUG');
    return isDebugMode;
  } catch (error) {
    console.error("Error checking debug mode:", error);
    return false; // Default to false if there's an error
  }
}
