// TensorFlow.js service for intent recognition
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { intents } from '../utils/intentUtils';
import { Entity } from '../types/intents';
import { ContextState } from './contextService';
import { analyzeText } from './entityRecognitionService';

// Define types for our service
interface LoadingStatus {
  message: string;
  percentage: number;
}

interface IntentRecognitionResult {
  text: string;
  intents: IntentMatch[];
  topIntent: IntentMatch | null;
  entities: Entity[];
  context: ContextState;
}

interface IntentMatch {
  intent: string;
  score: number;
  contextRelevance: number;
  combinedScore: number;
}

interface ModelInfo {
  date: string;
  version: string;
  source?: string;
  lastUsed?: string;
  debugMode?: boolean;
}

// Define possible model sources
type ModelSource = 'server' | 'indexeddb' | 'already_loaded' | 'load_complete' | 'embeddings_prepared' | 'reloaded' | 'unloaded' | 'recognition_used';

// Define model storage key
const MODEL_INFO_KEY = 'thea-model-info-v1';
// Tell Tensorflow to store model with that key in IndexDB
const INDEXEDDB_MODEL_KEY = 'thea-model-use-v1';

// Store model and embeddings
let model: use.UniversalSentenceEncoder | null = null;
let intentEmbeddings: { [key: string]: number[] } = {};
let loadingStatus: LoadingStatus = { message: "Not started", percentage: 0 };
let statusCallback: ((status: LoadingStatus) => void) | null = null;
let lastIntentResult: IntentRecognitionResult | null = null;

// Track if model loading has been initiated
let modelLoadingInitiated = false;

/**
 * Get the current loading status
 * @returns The current loading status
 */
export function getLoadingStatus(): LoadingStatus {
  return loadingStatus;
}

/**
 * Get the last intent recognition result
 * @returns The last intent recognition result
 */
export function getLastIntentResult(): IntentRecognitionResult | null {
  return lastIntentResult;
}

/**
 * Set a callback function to receive loading status updates
 * @param callback - Function to call with status updates
 */
export function setStatusCallback(callback: (status: LoadingStatus) => void) {
  statusCallback = callback;
  
  // If we already have a status, call the callback immediately
  if (loadingStatus.percentage > 0) {
    callback(loadingStatus);
  }
}

/**
 * Update loading status
 * @param message - Status message
 * @param percentage - Loading percentage (0-100)
 */
function updateStatus(message: string, percentage: number) {
  loadingStatus = { message, percentage };
  
  if (statusCallback) {
    statusCallback(loadingStatus);
  }
}

/**
 * Save model info to localStorage
 * @param source - Source of the model (server, indexeddb, etc.)
 */
function saveModelInfo(source: ModelSource): void {
  try {
    const now = new Date();
    const modelInfo: ModelInfo = {
      date: now.toISOString(),
      source,
      lastUsed: now.toISOString(),
      version: "1.0.0" // Keep this in sync with the version check in loadModel
    };
    
    localStorage.setItem(MODEL_INFO_KEY, JSON.stringify(modelInfo));
    console.debug(`Model info saved with source: ${source}`);
  } catch (error) {
    console.error("Error saving model info:", error);
  }
}

/**
 * Ensure TensorFlow.js is available
 * @returns Promise that resolves with true if TensorFlow.js is available
 */
async function ensureTensorFlow(): Promise<boolean> {
  try {
    // Check if TensorFlow.js is already loaded
    if (typeof tf !== 'undefined' && typeof use !== 'undefined') {
      console.debug("TensorFlow.js and USE already loaded");
      return true;
    }
    
    // Log TensorFlow.js version
    console.debug(`TensorFlow.js version: ${tf.version.tfjs}`);
    console.debug(`TensorFlow.js backend: ${tf.getBackend()}`);
    
    // Set memory management options
    tf.ENV.set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0);
    tf.ENV.set('WEBGL_FORCE_F16_TEXTURES', false);
    
    // Try to use WebGL backend if available
    try {
      if (tf.getBackend() !== 'webgl') {
        console.debug("Trying to set WebGL backend");
        await tf.setBackend('webgl');
        console.debug(`Backend set to: ${tf.getBackend()}`);
      }
    } catch (backendError) {
      console.warn("Could not set WebGL backend, using default:", backendError);
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring TensorFlow.js:", error);
    return false;
  }
}

/**
 * Load model from IndexedDB cache
 * @returns Promise that resolves with the loaded model or null if failed
 */
async function loadModelFromCache(modelInfo: ModelInfo): Promise<use.UniversalSentenceEncoder | null> {
  try {
    updateStatus(`Found cached model (saved ${new Date(modelInfo.date).toLocaleString()})`, 20);
    console.debug("Found cached model info:", modelInfo);
    
    try {
      // Try loading from IndexedDB first
      updateStatus("Loading model from browser storage...", 30);
      const startTime = Date.now();
      
      // Load the model with default settings
      // TensorFlow.js will check IndexedDB first by default
      const loadedModel = await use.load();
      const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.debug(`Model loaded from IndexedDB in ${loadTime}s (last saved: ${new Date(modelInfo.date).toLocaleString()})`);
      updateStatus("Model loaded from browser storage", 70);
      
      // Update model info with source and lastUsed
      saveModelInfo('indexeddb');
      
      return loadedModel;
    } catch (cacheError) {
      console.debug("Error loading from cache, will try to clear cache and reload:", cacheError);
      
      // Try to clear the cache for this model
      try {
        await tf.io.removeModel(`indexeddb://${INDEXEDDB_MODEL_KEY}`);
        console.debug("Successfully cleared cached model");
      } catch (clearError) {
        console.debug("Error clearing cached model:", clearError);
      }
      
      throw cacheError; // Re-throw to trigger server loading
    }
  } catch (_error) {
    console.error("Error loading model from cache:", _error);
    return null;
  }
}

/**
 * Load model from server
 * @returns Promise that resolves with the loaded model or null if failed
 */
async function loadModelFromServer(): Promise<use.UniversalSentenceEncoder | null> {
  try {
    updateStatus("Loading model from server...", 20);
    console.debug("Loading Universal Sentence Encoder from TF Hub");
    const startTime = Date.now();
    
    // Load the model directly with default settings
    // This will load from the TensorFlow Hub CDN which has proper CORS headers
    const loadedModel = await use.load();
    
    const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.debug(`Model successfully loaded from TF Hub in ${loadTime}s`);
    updateStatus("Model loaded from server and cached for future use", 70);
    
    // Try to save the model to IndexedDB
    try {
      console.debug("Try to save model to IndexedDB");
      const modelPath = `indexeddb://${INDEXEDDB_MODEL_KEY}`;
      
      // The Universal Sentence Encoder model doesn't directly support save()
      // Instead, we need to use tf.io.removeModel
      await tf.io.removeModel(modelPath).catch(() => {
        // Ignore errors if model doesn't exist
        console.debug("No existing model to remove from IndexedDB");
      });
      
      // Save the model's underlying artifacts
      // Note: USE models don't support direct saving, so we're just saving the info
      // The model will be loaded from TF Hub next time but the cache info will be used
      console.debug("Model loaded but cannot be directly saved to IndexedDB");
    } catch (saveError) {
      console.warn("Failed to save model to IndexedDB, but model is loaded:", saveError);
    }
    
    // Use saveModelInfo instead of direct localStorage saving
    saveModelInfo('server');
    
    return loadedModel;
  } catch (_error) {
    console.error("Error loading model from server:", _error);
    return null;
  }
}

/**
 * Load the TensorFlow.js Universal Sentence Encoder model
 * @param enableDebugging - Whether to enable debug mode
 * @returns Promise that resolves when model is loaded
 */
export async function loadModel(enableDebugging = false): Promise<boolean> {
  // Set debug mode via ENV setting
  tf.ENV.set('DEBUG', enableDebugging);
  console.log(`TensorFlow.js debug mode ${enableDebugging ? 'enabled' : 'disabled'}`);
  
  // If model is already loaded, return immediately
  if (isModelLoaded()) {
    console.debug("Model already loaded, returning immediately");
    updateStatus("Model already loaded", 100);
    saveModelInfo('already_loaded'); // Update lastUsed timestamp
    return true;
  }
  
  // If loading has already been initiated, just wait for it to complete
  if (modelLoadingInitiated) {
    console.debug("Model loading already initiated, waiting for completion");
    return waitForModelLoading();
  }
  
  // Set flag to indicate loading has been initiated
  modelLoadingInitiated = true;
  console.debug("Starting model loading process");
  
  try {
    // Ensure TensorFlow.js is available
    console.debug("Ensuring TensorFlow.js is available");
    updateStatus("Initializing TensorFlow.js", 10);
    const tfAvailable = await ensureTensorFlow();
    if (!tfAvailable) {
      console.debug("TensorFlow.js not available, aborting model loading");
      return false;
    }
    
    // Check if we've loaded the model before
    console.debug("Checking for previously loaded model info");
    const modelInfoString = localStorage.getItem(MODEL_INFO_KEY);
    
    try {
      // Check if we need to clear the cache due to version mismatch or corruption
      let shouldClearCache = false;
      
      if (modelInfoString) {
        const modelInfo = JSON.parse(modelInfoString);
        console.debug("Found model info in localStorage:", modelInfo);
        
        // Check if the stored model version matches the current version
        // This is useful when you update the model and want to force a reload
        const currentVersion = "1.0.0"; // Update this when you change the model
        if (modelInfo.version !== currentVersion) {
          console.debug(`Model version mismatch: stored=${modelInfo.version}, current=${currentVersion}`);
          shouldClearCache = true;
        }
        
        // Try to load from cache first if we're not clearing the cache
        if (!shouldClearCache) {
          console.debug("Attempting to load model from cache");
          model = await loadModelFromCache(modelInfo);
        }
        
        // If cache loading failed but we're online, try server
        if (!model && navigator.onLine) {
          console.debug("Cache loading failed, trying server");
          updateStatus("Cache loading failed, trying server...", 20);
          
          // Try to clear the cache if it failed to load
          if (!shouldClearCache) {
            try {
              await tf.io.removeModel(`indexeddb://${INDEXEDDB_MODEL_KEY}`);
              console.debug("Cleared potentially corrupted model cache");
            } catch (clearError) {
              console.debug("Error clearing model cache:", clearError);
            }
          }
          
          model = await loadModelFromServer();
        }
      } else {
        // No cached model info, load from server
        console.debug("No cached model found, loading from server");
        updateStatus("No cached model found", 20);
        model = await loadModelFromServer();
      }
      
      // Verify model was loaded
      if (!model) {
        console.debug("Model loading failed, no model instance available");
        throw new Error("Failed to load model");
      }
      
      // Prepare intent embeddings
      console.debug("Model loaded successfully, preparing intent embeddings");
      await prepareIntentEmbeddings();
      updateStatus("Intent embeddings prepared", 100);
      
      // Final update to model info after complete loading process
      console.debug("Model loading process complete");
      saveModelInfo('load_complete');
      
      return true;
    } catch (error) {
      if (!navigator.onLine) {
        updateStatus("Network error - device is offline and cannot load model", 0);
        console.error("Device is offline, cannot load model:", error);
        return false;
      } else {
        console.error("Error loading model:", error);
        updateStatus("Error loading model: " + (error instanceof Error ? error.message : "Unknown error"), 0);
        return false;
      }
    }
  } catch (error) {
    console.error("Error in loadModel:", error);
    updateStatus("Error: " + (error instanceof Error ? error.message : "Unknown error"), 0);
    return false;
  } finally {
    // Ensure we clean up any temporary resources
    try {
      tf.disposeVariables();
    } catch (disposeError) {
      console.debug("Error disposing variables:", disposeError);
    }
  }
}

/**
 * Unload the model from memory
 * @returns Promise that resolves to true if unload was successful
 */
export async function unloadModel(): Promise<boolean> {
  try {
    if (model) {
      // Clear the model reference
      model = null;
      
      // Reset loading status
      modelLoadingInitiated = false;
      updateStatus("Model unloaded", 0);
      
      console.log("Model successfully unloaded");
      
      // Update model info to reflect unloading
      saveModelInfo('unloaded');
      
      return true;
    } else {
      console.debug("No model to unload");
      return true; // No model to unload is still a success
    }
  } catch (error) {
    console.error("Error unloading model:", error);
    return false;
  }
}

/**
 * Reload the TensorFlow model by unloading and then loading it again
 * This is useful for debugging or when model needs to be refreshed
 * @param enableDebugging - Whether to enable debug mode after reload
 * @returns Promise that resolves to true if reload was successful, false otherwise
 */
export async function reloadModel(enableDebugging = false): Promise<boolean> {
  console.log('Attempting to reload TensorFlow model');

  try {
    // First unload the model - this will only do something if a model is loaded
    const unloadSuccess = await unloadModel();
    
    if (!unloadSuccess) {
      console.error('Failed to unload model during reload');
      return false;
    }
    
    // Now load the model again with debug mode setting
    const loadSuccess = await loadModel(enableDebugging);
    
    if (loadSuccess) {
      console.debug('Model successfully reloaded');
      saveModelInfo('reloaded');
      return true;
    } else {
      console.error('Failed to load model during reload');
      return false;
    }
  } catch (error) {
    console.error('Error during model reload:', error);
    return false;
  }
}

/**
 * Prepare intent embeddings for all defined intents
 * This pre-computes the embeddings for all intents for faster matching
 */
async function prepareIntentEmbeddings(): Promise<void> {
  if (!model) {
    console.debug("Cannot prepare intent embeddings, model not loaded");
    return;
  }
  
  console.debug("Preparing intent embeddings for all intents");
  const startTime = Date.now();
  
  try {
    // Get all intents from the intents module
    const allIntents = intents;
    console.debug(`Found ${allIntents.length} intents to process`);
    
    // Create an array of all intent examples for batch embedding
    const allExamples: string[] = [];
    const exampleToIntentMap: Record<string, string> = {};
    
    // Collect all examples and map them to their intent names
    for (const intent of allIntents) {
      for (const example of intent.examples) {
        allExamples.push(example);
        exampleToIntentMap[example] = intent.name;
      }
    }
    
    console.debug(`Processing ${allExamples.length} total examples`);
    
    // Get embeddings for all examples in one batch operation
    const embeddings = await model.embed(allExamples);
    const embeddingValues = await embeddings.array();
    
    // Store embeddings by example text for direct lookup
    intentEmbeddings = {};
    for (let i = 0; i < allExamples.length; i++) {
      const example = allExamples[i];
      intentEmbeddings[example] = embeddingValues[i] as unknown as number[];
    }
    
    // Dispose of the tensor to free memory
    embeddings.dispose();
    
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.debug(`Intent embeddings prepared for ${Object.keys(intentEmbeddings).length} examples in ${processingTime}s`);
    
    // Save model info to indicate embeddings are prepared
    saveModelInfo('embeddings_prepared');
  } catch (error) {
    console.error("Error preparing intent embeddings:", error);
  }
}

/**
 * Get embeddings for a list of texts
 * @param texts - List of texts to embed
 * @returns Promise that resolves to a list of embeddings
 */
async function getEmbeddings(texts: string[]): Promise<number[][]> {
  if (!model) {
    throw new Error("Model not loaded");
  }
  
  // Get embeddings from model
  const embeddings = await model.embed(texts);
  
  // Convert to array
  const embeddingsArray = await embeddings.array();
  
  // Dispose of tensor to free memory
  embeddings.dispose();
  
  return embeddingsArray;
}

/**
 * Recognize intent from text
 * @param text - Text to recognize intent from
 * @param context - Current application context
 * @returns Promise that resolves to intent recognition result
 */
export async function recognizeIntent(text: string, context: ContextState): Promise<IntentRecognitionResult> {
  // Ensure model is loaded
  if (!model) {
    await loadModel();
  }
  
  // Get embedding for input text
  const embedding = (await getEmbeddings([text]))[0];
  
  // Calculate similarity to all intent examples
  const matches: IntentMatch[] = [];
  
  for (const intent of intents) {
    // Skip if intent is not available in current context
    const contextRelevance = getContextRelevance(intent.name, context);
    
    // Calculate similarity to each example
    for (const example of intent.examples) {
      if (intentEmbeddings[example]) {
        const score = await calculateSimilarity(embedding, intentEmbeddings[example]);
        
        // Apply context relevance as a multiplier
        const combinedScore = score * contextRelevance;
        
        matches.push({
          intent: intent.name,
          score,
          contextRelevance,
          combinedScore
        });
      }
    }
  }
  
  // Sort by combined score (descending)
  matches.sort((a, b) => b.combinedScore - a.combinedScore);
  
  // Get top match for each intent
  const topMatchesByIntent: { [key: string]: IntentMatch } = {};
  
  for (const match of matches) {
    if (!topMatchesByIntent[match.intent] || match.combinedScore > topMatchesByIntent[match.intent].combinedScore) {
      topMatchesByIntent[match.intent] = match;
    }
  }
  
  // Convert to array and sort again
  const topMatches = Object.values(topMatchesByIntent);
  topMatches.sort((a, b) => b.combinedScore - a.combinedScore);
  
  // Update model info periodically during usage (every 10th recognition)
  // Use a simple hash of the text to avoid too frequent updates
  if (text.length % 10 === 0) {
    saveModelInfo('recognition_used');
  }
  
  // Extract entities from the text using the entityRecognitionService
  const entityResult = await analyzeText(text, context);
  
  // Return result
  lastIntentResult = {
    text,
    intents: topMatches,
    topIntent: topMatches.length > 0 ? topMatches[0] : null,
    entities: entityResult.entities,
    context
  };
  
  return lastIntentResult;
}

/**
 * Get context relevance score for an intent
 * @param intentName - Name of intent
 * @param context - Current application context
 * @returns Context relevance score (0-1)
 */
function getContextRelevance(intentName: string, context: ContextState): number {
  // Find the intent in the intents array
  const intent = intents.find(i => i.name === intentName);
  
  if (!intent) {
    return 0;
  }
  
  // If intent has no context relevance defined, assume it's available in all contexts
  if (!intent.contextRelevance) {
    return 1;
  }
  
  // If intent requires a patient and we don't have one, return low relevance
  if (intent.contextRelevance.requiresPatient && !context.currentPatient) {
    return 0.1;
  }
  
  // If intent requires a record and we don't have one, return low relevance
  if (intent.contextRelevance.requiresRecord && !context.currentRecordId) {
    return 0.1;
  }
  
  // If intent is specific to certain views
  if (intent.contextRelevance.views && intent.contextRelevance.views.length > 0) {
    // If the intent is available in all views (marked by '*')
    if (intent.contextRelevance.views.includes('*')) {
      return 1;
    }
    
    // If the intent is available in the current view
    if (intent.contextRelevance.views.includes(context.currentView)) {
      return 1;
    } else {
      return 0.3; // Lower relevance for other views
    }
  }
  
  // Default relevance
  return 0.5;
}

/**
 * Calculate cosine similarity between two embeddings
 * @param embedding1 - First embedding
 * @param embedding2 - Second embedding
 * @returns Promise that resolves to similarity score (0-1)
 */
async function calculateSimilarity(embedding1: number[], embedding2: number[]): Promise<number> {
  // Calculate dot product
  let dotProduct = 0;
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
  }
  
  // Calculate magnitudes
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < embedding1.length; i++) {
    magnitude1 += embedding1[i] * embedding1[i];
    magnitude2 += embedding2[i] * embedding2[i];
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  // Calculate cosine similarity
  const cosineSimilarity = dotProduct / (magnitude1 * magnitude2);
  
  return Promise.resolve(cosineSimilarity);
}

/**
 * Check if debug mode is currently enabled
 * @returns True if debug mode is enabled
 */
export function isDebugModeEnabled(): boolean {
  try {
    return tf.ENV.getBool('DEBUG');
  } catch (error) {
    console.error("Error checking debug mode:", error);
    return false;
  }
}

/**
 * Recognize entities in text
 * @param text - Text to recognize entities in
 * @returns Promise that resolves with recognized entities
 */
export async function recognizeEntities(text: string): Promise<Entity[]> {
  try {
    console.debug("Recognizing entities in text:", text);
    
    // Ensure model is loaded
    if (!isModelLoaded()) {
      console.debug("Model not loaded, cannot recognize entities");
      return [];
    }
    
    // Use the analyzeText function from entityRecognitionService
    // Create a minimal context with required fields
    const context: ContextState = { 
      debugMode: isDebugModeEnabled(),
      currentPatient: null,
      currentView: 'landing'
    };
    
    const result = await analyzeText(text, context);
    
    console.debug("Entity recognition complete");
    return result.entities;
  } catch (error) {
    console.error("Error recognizing entities:", error);
    return [];
  }
}

/**
 * Check if model is already loaded
 * @returns True if model is already loaded
 */
function isModelLoaded(): boolean {
  return !!model;
}

/**
 * Wait for model loading to complete if it's already in progress
 * @returns Promise that resolves when model is loaded
 */
async function waitForModelLoading(): Promise<boolean> {
  updateStatus("Model loading already in progress", loadingStatus.percentage);
  
  // Return a promise that resolves when the model is loaded
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (model) {
        clearInterval(checkInterval);
        resolve(true);
      }
    }, 100);
  });
}

/**
 * Load model from IndexedDB cache
 * @returns Promise that resolves with the loaded model or null if failed
 */

// Auto-initialize the model when this module is imported
// This ensures the model is loaded only once for the entire application
(() => {
  loadModel().catch(error => {
    console.error("Error auto-initializing model:", error);
  });
})();