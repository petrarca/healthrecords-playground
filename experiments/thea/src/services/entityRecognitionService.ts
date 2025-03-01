// Entity recognition service for Thea
import * as tf from '@tensorflow/tfjs';
import { ContextState } from './contextService';
import { EntityType, Entity } from '../types/intents';
import { entityTrainingData } from '../training';

// Define storage keys
const ENTITY_MODEL_INFO_KEY = 'thea-entity-model-info';
const ENTITY_INDEXEDDB_MODEL_KEY = 'thea-entity-model';
const ENTITY_VOCAB_KEY = 'thea-entity-vocab';
const ENTITY_TAGMAP_KEY = 'thea-entity-tagmap';
const ENTITY_VOCABSIZE_KEY = 'thea-entity-vocabsize';

// Define BIO tagging scheme
export enum TagType {
  B_PERSON = 'B-PERSON',   // Beginning of person entity
  I_PERSON = 'I-PERSON',   // Inside of person entity
  B_TEMPORAL = 'B-TEMPORAL', // Beginning of temporal entity
  I_TEMPORAL = 'I-TEMPORAL', // Inside of temporal entity
  O = 'O'                  // Outside any entity (none)
}

// Map TagType to EntityType
const tagToEntityTypeMap: Record<TagType, EntityType> = {
  [TagType.B_PERSON]: EntityType.PERSON,
  [TagType.I_PERSON]: EntityType.PERSON,
  [TagType.B_TEMPORAL]: EntityType.TEMPORAL,
  [TagType.I_TEMPORAL]: EntityType.TEMPORAL,
  [TagType.O]: EntityType.NONE
};

// Define entity extraction result
export interface EntityExtractionResult {
  text: string;
  entities: Entity[];
  context: ContextState;
}

// Internal state
interface EntityModelState {
  vocab: Record<string, number>;
  vocabSize: number;
  maxSequenceLength: number;
  model: tf.LayersModel | null;
  isLoaded: boolean;
  tagMap: Record<string, number>;
}

// Module state
const state: EntityModelState = {
  vocab: {},
  vocabSize: 0,
  maxSequenceLength: 20,
  model: null,
  isLoaded: false,
  tagMap: {}
};

/**
 * Preprocess text for entity recognition
 * @param text - Text to preprocess
 * @returns Array of tokens and their indices in the original text
 */
function preprocessText(text: string): { tokens: string[], indices: number[] } {
  // Normalize the text (convert to lowercase and handle special characters)
  const normalizedText = text.toLowerCase();
  
  // Use a regex that keeps track of token positions
  const tokenPattern = /\b\w+(?:'\w+)?|[^\w\s]/g;
  const tokens: string[] = [];
  const indices: number[] = [];
  
  let match;
  while ((match = tokenPattern.exec(normalizedText)) !== null) {
    tokens.push(match[0]);
    indices.push(match.index);
  }
  
  return { tokens, indices };
}

/**
 * Convert entity annotations to BIO tags
 * @param text - The input text
 * @param entities - The entity annotations
 * @returns Array of BIO tags corresponding to each token
 */
function entitiesToBioTags(text: string, entities: Entity[]): TagType[] {
  const { tokens, indices } = preprocessText(text);
  const tags: TagType[] = new Array(tokens.length).fill(TagType.O);
  
  for (const entity of entities) {
    // Find tokens that overlap with this entity
    for (let i = 0; i < tokens.length; i++) {
      const tokenStart = indices[i];
      const tokenEnd = tokenStart + tokens[i].length;
      
      // Check if this token is part of the entity
      if (tokenStart >= entity.startIndex && tokenEnd <= entity.endIndex) {
        // Determine if it's the beginning or inside of an entity
        if (tokenStart === entity.startIndex) {
          // Beginning of entity
          tags[i] = entity.type === EntityType.PERSON ? TagType.B_PERSON : TagType.B_TEMPORAL;
        } else {
          // Inside of entity
          tags[i] = entity.type === EntityType.PERSON ? TagType.I_PERSON : TagType.I_TEMPORAL;
        }
      }
    }
  }
  
  return tags;
}

/**
 * Build vocabulary and tag mapping from training data
 */
function buildVocabularyAndTagMap(): void {
  const vocab = new Set<string>();
  const tags = Object.values(TagType);
  
  // Add tokens from all training examples
  entityTrainingData.forEach(example => {
    const { tokens } = preprocessText(example.text);
    tokens.forEach(token => vocab.add(token));
  });
  
  // Create vocabulary mapping
  const vocabArray = Array.from(vocab);
  state.vocab = {};
  vocabArray.forEach((word, index) => {
    state.vocab[word] = index + 1; // Reserve 0 for padding/unknown
  });
  state.vocabSize = Object.keys(state.vocab).length + 1;
  
  // Create tag mapping
  state.tagMap = {};
  tags.forEach((tag, index) => {
    state.tagMap[tag] = index;
  });
  
  console.log(`Entity vocabulary built with ${state.vocabSize - 1} tokens and ${tags.length} tags`);
}

/**
 * Prepare training data for the model
 * @returns Training sequences and labels
 */
function prepareTrainingData(): { sequences: tf.Tensor2D, labels: tf.Tensor3D } {
  const sequences: number[][] = [];
  const labels: number[][][] = [];
  
  // Process each training example
  entityTrainingData.forEach(example => {
    const { tokens } = preprocessText(example.text);
    const tags = entitiesToBioTags(example.text, example.entities);
    
    // Convert tokens to sequence
    const sequence = new Array(state.maxSequenceLength).fill(0);
    for (let i = 0; i < Math.min(tokens.length, state.maxSequenceLength); i++) {
      sequence[i] = state.vocab[tokens[i]] || 0; // 0 for unknown words
    }
    
    // Convert tags to one-hot encoded labels
    const tagLabels: number[][] = new Array(state.maxSequenceLength).fill(null)
      .map(() => new Array(Object.keys(state.tagMap).length).fill(0));
    
    for (let i = 0; i < Math.min(tags.length, state.maxSequenceLength); i++) {
      const tagIndex = state.tagMap[tags[i]];
      tagLabels[i][tagIndex] = 1;
    }
    
    sequences.push(sequence);
    labels.push(tagLabels);
  });
  
  return {
    sequences: tf.tensor2d(sequences),
    labels: tf.tensor3d(labels)
  };
}

/**
 * Create and initialize the entity recognition model
 * @returns Promise that resolves when model is created
 */
export async function createEntityModel(): Promise<tf.LayersModel> {
  // Build vocabulary if not already built
  if (Object.keys(state.vocab).length === 0) {
    buildVocabularyAndTagMap();
  }
  
  const vocabSize = state.vocabSize;
  const embeddingDim = 32;
  const maxSequenceLength = state.maxSequenceLength;
  const numTagTypes = Object.keys(state.tagMap).length;
  
  // Create a sequential model
  const model = tf.sequential();
  
  // Add embedding layer
  model.add(tf.layers.embedding({
    inputDim: vocabSize,
    outputDim: embeddingDim,
    inputLength: maxSequenceLength
  }));
  
  // Add bidirectional LSTM layer
  model.add(tf.layers.bidirectional({
    layer: tf.layers.lstm({
      units: 64,
      returnSequences: true
    }),
    mergeMode: 'concat'
  }));
  
  // Add another LSTM layer
  model.add(tf.layers.lstm({
    units: 32,
    returnSequences: true
  }));
  
  // Add dense layer with softmax activation for entity type prediction
  model.add(tf.layers.timeDistributed({
    layer: tf.layers.dense({
      units: numTagTypes,
      activation: 'softmax'
    })
  }));
  
  // Compile the model
  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });
  
  state.model = model;
  return model;
}

/**
 * Train the entity recognition model
 * @returns Promise that resolves with training history
 */
export async function trainEntityModel(): Promise<tf.History> {
  if (!state.model) {
    await createEntityModel();
  }
  
  console.log('Training entity recognition model...');
  
  // Prepare training data
  const { sequences, labels } = prepareTrainingData();
  
  // Train the model
  try {
    const history = await state.model!.fit(sequences, labels, {
      epochs: 50,
      batchSize: 16,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
        }
      }
    });
    
    state.isLoaded = true;
    console.log('Model training completed');
    
    // Clean up tensors
    sequences.dispose();
    labels.dispose();
    
    return history;
  } catch (error) {
    console.error('Error training model:', error);
    throw error;
  }
}

/**
 * Save the entity recognition model to browser storage
 * @returns Promise that resolves when model is saved
 */
export async function saveEntityModel(): Promise<tf.io.SaveResult> {
  if (!state.model) {
    throw new Error('No model to save');
  }
  
  try {
    console.log('Saving entity recognition model...');
    const saveResult = await state.model.save(`indexeddb://${ENTITY_INDEXEDDB_MODEL_KEY}`);
    
    // Save vocabulary and tag map
    localStorage.setItem(ENTITY_VOCAB_KEY, JSON.stringify(state.vocab));
    localStorage.setItem(ENTITY_TAGMAP_KEY, JSON.stringify(state.tagMap));
    localStorage.setItem(ENTITY_VOCABSIZE_KEY, state.vocabSize.toString());
    
    // Save model info
    const modelInfo = {
      date: new Date().toISOString(),
      version: '0.0.1',
      source: 'training',
      lastUsed: new Date().toISOString()
    };
    localStorage.setItem(ENTITY_MODEL_INFO_KEY, JSON.stringify(modelInfo));
    
    console.log('Entity model saved successfully');
    return saveResult;
  } catch (error) {
    console.error('Error saving entity model:', error);
    throw error;
  }
}

/**
 * Load the entity recognition model from browser storage
 * @returns Promise that resolves when model is loaded
 */
export async function loadEntityModel(): Promise<boolean> {
  try {
    if (state.isLoaded && state.model) {
      return true;
    }
    
    console.log('Loading entity recognition model...');
    
    // Try to load from indexed DB
    try {
      // Load vocabulary and tag map
      const vocabJson = localStorage.getItem(ENTITY_VOCAB_KEY);
      const tagMapJson = localStorage.getItem(ENTITY_TAGMAP_KEY);
      const vocabSizeStr = localStorage.getItem(ENTITY_VOCABSIZE_KEY);
      
      if (vocabJson && tagMapJson && vocabSizeStr) {
        state.vocab = JSON.parse(vocabJson);
        state.tagMap = JSON.parse(tagMapJson);
        state.vocabSize = parseInt(vocabSizeStr, 10);
        
        // Load model
        state.model = await tf.loadLayersModel(`indexeddb://${ENTITY_INDEXEDDB_MODEL_KEY}`);
        state.isLoaded = true;
        
        // Update model info
        const modelInfo = JSON.parse(localStorage.getItem(ENTITY_MODEL_INFO_KEY) || '{}');
        modelInfo.lastUsed = new Date().toISOString();
        localStorage.setItem(ENTITY_MODEL_INFO_KEY, JSON.stringify(modelInfo));
        
        console.log('Entity model loaded from storage');
        return true;
      }
    } catch (storageError) {
      console.warn('Could not load model from storage:', storageError);
    }
    
    // If loading from storage failed, build and train a new model
    console.log('Creating new entity model...');
    buildVocabularyAndTagMap();
    await createEntityModel();
    await trainEntityModel();
    
    // Save the newly trained model
    await saveEntityModel();
    
    return true;
  } catch (error) {
    console.error('Error loading entity model:', error);
    return false;
  }
}

/**
 * Check if entity model is loaded
 * @returns True if model is loaded
 */
export function checkEntityModelStatus(): boolean {
  return state.isLoaded && !!state.model;
}

/**
 * Extract entities from text using rule-based approach
 * @param text - Text to extract entities from
 * @param context - Current application context
 * @returns Entity extraction result
 */
export function extractEntities(text: string, context: ContextState): EntityExtractionResult {
  const entities: Entity[] = [];
  const lowerText = text.toLowerCase();
  
  // Person entity patterns (simplified for demo)
  const personPatterns = [
    /(?:for|of|from|by|about)\s+([a-z]+\s+[a-z]+)/i,  // "for John Doe"
    /([a-z]+\s+[a-z]+)'s/i,                           // "John Doe's"
    /patient\s+([a-z]+\s+[a-z]+)/i,                   // "patient John Doe"
    /\b(mr\.|mrs\.|ms\.|dr\.)\s+([a-z]+)/i            // "Mr. Smith"
  ];
  
  // Try each person pattern
  for (const pattern of personPatterns) {
    const match = lowerText.match(pattern);
    if (match && match[1]) {
      let value = match[1];
      
      // Handle titles
      if (/\b(mr\.|mrs\.|ms\.|dr\.)/i.test(value)) {
        value = `${match[1]} ${match[2]}`;
      }
      
      const startIndex = lowerText.indexOf(value);
      const endIndex = startIndex + value.length;
      
      entities.push({
        type: EntityType.PERSON,
        value,
        startIndex,
        endIndex,
        confidence: 0.85 // Placeholder for rule-based confidence
      });
      
      // Only extract one person entity per pattern type
      break;
    }
  }
  
  // Temporal entity patterns
  const temporalPatterns = [
    { pattern: /\b(latest|recent|current)\b/i, confidence: 0.9 },
    { pattern: /\b(yesterday|today|tomorrow)\b/i, confidence: 0.9 },
    { pattern: /\b(last|next)\s+(week|month|year|visit|appointment)\b/i, confidence: 0.85 },
    { pattern: /\b(this)\s+(week|month|year)\b/i, confidence: 0.8 },
    { pattern: /\b(\d+)\s+(days?|weeks?|months?|years?)\s+(ago|from now)\b/i, confidence: 0.8 }
  ];
  
  // Try each temporal pattern
  for (const { pattern, confidence } of temporalPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      const value = match[0];
      const startIndex = match.index!;
      const endIndex = startIndex + value.length;
      
      entities.push({
        type: EntityType.TEMPORAL,
        value: value.toLowerCase(),
        startIndex,
        endIndex,
        confidence
      });
      
      // Allow multiple temporal entities
    }
  }
  
  return {
    text,
    entities,
    context
  };
}

/**
 * Convert model predictions to entities
 * @param text - Original text
 * @param tokens - Tokenized text
 * @param indices - Token indices in original text
 * @param predictions - Model predictions
 * @returns Array of entities
 */
function predictionsToEntities(
  text: string,
  tokens: string[],
  indices: number[],
  predictions: number[][]
): Entity[] {
  const entities: Entity[] = [];
  const tagValues = Object.values(TagType);
  
  let currentEntity: {
    type: EntityType;
    startToken: number;
    endToken: number;
    confidence: number;
  } | null = null;
  
  // Process each token
  for (let i = 0; i < Math.min(tokens.length, predictions.length); i++) {
    const tagProbabilities = predictions[i];
    const maxProbIndex = tagProbabilities.indexOf(Math.max(...tagProbabilities));
    const predictedTag = tagValues[maxProbIndex];
    const confidence = tagProbabilities[maxProbIndex];
    
    // Convert tag to entity type
    const entityType = tagToEntityTypeMap[predictedTag as TagType];
    
    // Check if this is the beginning of an entity
    if (predictedTag === TagType.B_PERSON || predictedTag === TagType.B_TEMPORAL) {
      // If we were tracking an entity, finalize it
      if (currentEntity) {
        const startIndex = indices[currentEntity.startToken];
        const endIndex = indices[currentEntity.endToken] + tokens[currentEntity.endToken].length;
        
        entities.push({
          type: currentEntity.type,
          value: text.substring(startIndex, endIndex).toLowerCase(),
          startIndex,
          endIndex,
          confidence: currentEntity.confidence
        });
      }
      
      // Start a new entity
      currentEntity = {
        type: entityType,
        startToken: i,
        endToken: i,
        confidence: confidence
      };
    }
    // Check if this is the continuation of an entity
    else if ((predictedTag === TagType.I_PERSON || predictedTag === TagType.I_TEMPORAL) && currentEntity) {
      // Only continue if the entity types match
      if ((predictedTag === TagType.I_PERSON && currentEntity.type === EntityType.PERSON) ||
          (predictedTag === TagType.I_TEMPORAL && currentEntity.type === EntityType.TEMPORAL)) {
        
        currentEntity.endToken = i;
        // Update confidence (average)
        currentEntity.confidence = (currentEntity.confidence + confidence) / 2;
      }
    }
    // Outside tag or mismatch
    else if (predictedTag === TagType.O || entityType === EntityType.NONE) {
      // If we were tracking an entity, finalize it
      if (currentEntity) {
        const startIndex = indices[currentEntity.startToken];
        const endIndex = indices[currentEntity.endToken] + tokens[currentEntity.endToken].length;
        
        entities.push({
          type: currentEntity.type,
          value: text.substring(startIndex, endIndex).toLowerCase(),
          startIndex,
          endIndex,
          confidence: currentEntity.confidence
        });
        
        currentEntity = null;
      }
    }
  }
  
  // Don't forget to add the last entity if we're still tracking one
  if (currentEntity) {
    const startIndex = indices[currentEntity.startToken];
    const endIndex = indices[currentEntity.endToken] + tokens[currentEntity.endToken].length;
    
    entities.push({
      type: currentEntity.type,
      value: text.substring(startIndex, endIndex).toLowerCase(),
      startIndex,
      endIndex,
      confidence: currentEntity.confidence
    });
  }
  
  return entities;
}

/**
 * Extract entities using the trained TensorFlow.js model
 * @param text - Text to extract entities from
 * @param context - Current application context
 * @returns Promise that resolves with entity extraction result
 */
export async function extractEntitiesWithModel(text: string, context: ContextState): Promise<EntityExtractionResult> {
  // If the model isn't loaded, load it
  if (!state.isLoaded || !state.model) {
    const loaded = await loadEntityModel();
    if (!loaded) {
      // Fall back to rule-based approach if model loading fails
      console.warn('Using rule-based entity extraction as fallback');
      return extractEntities(text, context);
    }
  }
  
  try {
    // Preprocess the text
    const { tokens, indices } = preprocessText(text);
    
    // Convert tokens to sequence
    const sequence = new Array(state.maxSequenceLength).fill(0);
    for (let i = 0; i < Math.min(tokens.length, state.maxSequenceLength); i++) {
      const token = tokens[i];
      sequence[i] = state.vocab[token] || 0; // 0 for unknown words
    }
    
    // Predict with model
    const input = tf.tensor2d([sequence]);
    const prediction = state.model!.predict(input) as tf.Tensor;
    const predictionsArray = await prediction.array() as number[][][];
    
    // Convert predictions to entities
    const entities = predictionsToEntities(
      text,
      tokens,
      indices,
      predictionsArray[0] // First (and only) sequence in batch
    );
    
    // Clean up tensors
    input.dispose();
    prediction.dispose();
    
    return {
      text,
      entities,
      context
    };
  } catch (error) {
    console.error('Error during model-based entity extraction:', error);
    
    // Fall back to rule-based approach
    console.warn('Falling back to rule-based entity extraction');
    return extractEntities(text, context);
  }
}

/**
 * Main function to extract entities from text
 * Tries to use the model first, then falls back to rule-based approach
 * @param text - Text to extract entities from
 * @param context - Current application context
 * @returns Promise that resolves with entity extraction result
 */
export async function analyzeText(text: string, context: ContextState): Promise<EntityExtractionResult> {
  try {
    // Try to use the model-based approach
    return await extractEntitiesWithModel(text, context);
  } catch (error) {
    console.error('Entity extraction error:', error);
    
    // Fall back to rule-based approach
    return extractEntities(text, context);
  }
}

/**
 * Initialize the entity recognition service
 * @returns Promise that resolves when service is ready
 */
export async function initializeEntityService(): Promise<boolean> {
  try {
    return await loadEntityModel();
  } catch (error) {
    console.error('Error initializing entity service:', error);
    return false;
  }
}