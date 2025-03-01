// Rule-based entity recognition for Thea
import { Entity, EntityType } from '../types/intents';
import { ContextState } from './contextService';

/**
 * Entity extraction result interface
 */
export interface EntityExtractionResult {
  text: string;
  entities: Entity[];
  context: ContextState;
}

/**
 * Extract person entities from text
 * @param text - Text to extract person entities from
 * @returns Array of person entities
 */
export function extractPersonEntities(text: string): Entity[] {
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
  
  return entities;
}

/**
 * Extract temporal entities from text
 * @param text - Text to extract temporal entities from
 * @returns Array of temporal entities
 */
export function extractTemporalEntities(text: string): Entity[] {
  const entities: Entity[] = [];
  const lowerText = text.toLowerCase();
  
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
  
  return entities;
}

/**
 * Extract entities from text using rule-based approach
 * @param text - Text to extract entities from
 * @param context - Current application context
 * @returns Entity extraction result
 */
export function extractEntities(text: string, context: ContextState): EntityExtractionResult {
  // Extract different types of entities
  const personEntities = extractPersonEntities(text);
  const temporalEntities = extractTemporalEntities(text);
  
  // Combine all entities
  const entities = [...personEntities, ...temporalEntities];
  
  return {
    text,
    entities,
    context
  };
}
