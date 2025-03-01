// TensorFlow.js service for intent recognition
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { intents } from '../utils/intentUtils';
import { ContextState } from './contextService';

// Define types for our service
interface LoadingStatus {
  message: string;
  percentage: number;
}

interface IntentRecognitionResult {
  text: string;
  intents: IntentMatch[];
  topIntent: IntentMatch | null;
  context: ContextState;
}

interface IntentMatch {
  intent: string;
  score: number;
  contextRelevance: number;
  combinedScore: number;
}

interface ModelInfo {
  date: string;        // When the model was first loaded
  version: string;     // Model version
  source?: string;     // Where the model was loaded from (server/indexeddb)
  lastUsed?: string;   // When the model was last used
  debugMode?: boolean; // Whether debug mode is enabled
}

// Define model storage key
const MODEL_INFO_KEY = 'thea-model-info';
// Tell Tensorflow to store model with that key in IndexDB
const INDEXEDDB_MODEL_KEY = 'thea-model-use-v0';

// Store model and embeddings
let model: any = null;
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
 * Save model info to localStorage with consistent format
 * @param source - Where the model was loaded from
 */
function saveModelInfo(source: string = 'unknown'): void {
  // Try to get existing model info first
  let info: ModelInfo;
  const existingInfo = localStorage.getItem(MODEL_INFO_KEY);
  
  if (existingInfo) {
    // Update existing info
    info = JSON.parse(existingInfo);
    info.lastUsed = new Date().toISOString();
    info.source = source;
  } else {
    // Create new info
    info = {
      date: new Date().toISOString(),
      version: '0.0.1',
      source: source,
      lastUsed: new Date().toISOString(),
      debugMode: tf.ENV.getBool('DEBUG')
    };
  }
  
  localStorage.setItem(MODEL_INFO_KEY, JSON.stringify(info));
  console.log(`Model info saved to localStorage (source: ${source}):`, info);
}

/**
 * Load TensorFlow.js from CDN as a fallback
 * @returns Promise that resolves to true if successful
 */
async function loadTensorFlowFromCDN(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Create script elements to load TensorFlow.js from CDN
      const script1 = document.createElement('script');
      script1.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js';
      script1.async = true;
      
      const script2 = document.createElement('script');
      script2.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder@1.3.3/dist/universal-sentence-encoder.min.js';
      script2.async = true;
      
      // Set up load handlers
      script1.onload = () => {
        document.head.appendChild(script2);
      };
      
      script2.onload = () => {
        resolve(true);
      };
      
      script1.onerror = script2.onerror = () => {
        resolve(false);
      };
      
      // Add the first script to the document
      document.head.appendChild(script1);
    } catch (error) {
      resolve(false);
    }
  });
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
 * Ensure TensorFlow.js is available, falling back to CDN if needed
 * @returns True if TensorFlow.js is available
 */
async function ensureTensorFlow(): Promise<boolean> {
  updateStatus("Initializing TensorFlow.js", 10);
  
  // Try to load TensorFlow.js from npm packages
  try {
    // Check if TensorFlow.js is available
    if (!tf) {
      throw new Error("TensorFlow.js not found");
    }
    return true;
  } catch (error) {
    console.warn("TensorFlow.js not available from npm, trying CDN fallback");
    const cdnSuccess = await loadTensorFlowFromCDN();
    if (!cdnSuccess) {
      updateStatus("Failed to load TensorFlow.js", 0);
      return false;
    }
    return true;
  }
}

/**
 * Load model from IndexedDB cache
 * @returns Promise that resolves with the loaded model or null if failed
 */
async function loadModelFromCache(modelInfo: any): Promise<any> {
  try {
    updateStatus(`Found cached model (saved ${new Date(modelInfo.date).toLocaleString()})`, 20);
    console.log("Found cached model info:", modelInfo);
    
    // Set model loading options with explicit IndexedDB control
    const modelLoadingOptions = {
      fromTFHub: false,
      modelUrl: INDEXEDDB_MODEL_KEY, // Use our specific model key
      
      // This tells TensorFlow.js to look for a model with this path/key in IndexedDB
      // TensorFlow.js uses the modelUrl as the key for IndexedDB storage
      
      strictModelConfig: false,
      fetchFunc: async (url: string, init?: RequestInit) => {
        if (!navigator.onLine) {
          throw new Error("Device is offline");
        }
        console.log("Model cannot be found in IndexedDB, falling back to network fetch");
        return fetch(url, init);
      }
    };
    
    // Try loading from IndexedDB first
    updateStatus("Loading model from browser storage...", 30);
    const startTime = Date.now();
    
    // Explicitly tell TensorFlow.js to load from IndexedDB
    // This uses the model path as the indexedDB key
    const loadedModel = await use.load(modelLoadingOptions);
    const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Model loaded from IndexedDB in ${loadTime}s (last saved: ${new Date(modelInfo.date).toLocaleString()})`);
    updateStatus("Model loaded from browser storage", 70);
    
    // Update model info with source and lastUsed
    saveModelInfo('indexeddb');
    
    return loadedModel;
  } catch (error) {
    console.error("Error loading model from cache:", error);
    return null;
  }
}

/**
 * Load model from server
 * @returns Promise that resolves with the loaded model or null if failed
 */
async function loadModelFromServer(): Promise<any> {
  try {
    updateStatus("Loading model from server...", 20);
    const startTime = Date.now();
    
    // Load with default settings (will save to IndexedDB)
    const loadedModel = await use.load();
    const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Model loaded from server in ${loadTime}s`);
    updateStatus("Model loaded from server and cached for future use", 70);
    
    // Use saveModelInfo instead of direct localStorage saving
    saveModelInfo('server');
    
    return loadedModel;
  } catch (error) {
    console.error("Error loading model from server:", error);
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
    updateStatus("Model already loaded", 100);
    saveModelInfo('already_loaded'); // Update lastUsed timestamp
    return true;
  }
  
  // If loading has already been initiated, just wait for it to complete
  if (modelLoadingInitiated) {
    return waitForModelLoading();
  }
  
  // Set flag to indicate loading has been initiated
  modelLoadingInitiated = true;
  
  try {
    // Ensure TensorFlow.js is available
    const tfAvailable = await ensureTensorFlow();
    if (!tfAvailable) {
      return false;
    }
    
    // Check if we've loaded the model before
    const modelInfoString = localStorage.getItem(MODEL_INFO_KEY);
    
    try {
      if (modelInfoString) {
        const modelInfo = JSON.parse(modelInfoString);
        
        // Try to load from cache first
        model = await loadModelFromCache(modelInfo);
        
        // If cache loading failed but we're online, try server
        if (!model && navigator.onLine) {
          updateStatus("Cache loading failed, trying server...", 20);
          model = await loadModelFromServer();
        }
      } else {
        // No cached model info, load from server
        updateStatus("No cached model found", 20);
        model = await loadModelFromServer();
      }
      
      // Verify model was loaded
      if (!model) {
        throw new Error("Failed to load model");
      }
      
      // Prepare intent embeddings
      await prepareIntentEmbeddings();
      updateStatus("Intent embeddings prepared", 100);
      
      // Final update to model info after complete loading process
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
      console.log("No model to unload");
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
      console.log('Model successfully reloaded');
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
 * Prepare embeddings for all intents
 */
async function prepareIntentEmbeddings(): Promise<void> {
  updateStatus("Preparing intent embeddings", 80);
  
  // Get all unique intent texts
  const intentTexts = intents.flatMap(intent => intent.examples);
  
  // Get embeddings for all intent texts
  const embeddings = await getEmbeddings(intentTexts);
  
  // Store embeddings by intent text
  intentEmbeddings = {};
  for (let i = 0; i < intentTexts.length; i++) {
    intentEmbeddings[intentTexts[i]] = embeddings[i];
  }
  
  // Update model info after preparing embeddings
  saveModelInfo('embeddings_prepared');
  
  updateStatus("Intent embeddings prepared", 90);
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
  
  // Return result
  lastIntentResult = {
    text,
    intents: topMatches,
    topIntent: topMatches.length > 0 ? topMatches[0] : null,
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

// Auto-initialize the model when this module is imported
// This ensures the model is loaded only once for the entire application
(() => {
  loadModel().catch(error => {
    console.error("Error auto-initializing model:", error);
  });
})();