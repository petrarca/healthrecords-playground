import { EntityType } from '../types/intents';

// Define entity training data
export const entityTrainingData = [
  // Person entity examples
  { text: "Show lab results for John Doe", entities: [{ type: EntityType.PERSON, value: "John Doe", startIndex: 20, endIndex: 28, confidence: 1.0 }] },
  { text: "What are Mary Smith's vitals", entities: [{ type: EntityType.PERSON, value: "Mary Smith", startIndex: 9, endIndex: 20, confidence: 1.0 }] },
  { text: "Show allergies for patient James Wilson", entities: [{ type: EntityType.PERSON, value: "James Wilson", startIndex: 26, endIndex: 38, confidence: 1.0 }] },
  { text: "Display medications for Sarah Johnson", entities: [{ type: EntityType.PERSON, value: "Sarah Johnson", startIndex: 24, endIndex: 37, confidence: 1.0 }] },
  { text: "What conditions does David Miller have", entities: [{ type: EntityType.PERSON, value: "David Miller", startIndex: 20, endIndex: 32, confidence: 1.0 }] },
  
  // Temporal entity examples
  { text: "Show latest vitals", entities: [{ type: EntityType.TEMPORAL, value: "latest", startIndex: 5, endIndex: 11, confidence: 1.0 }] },
  { text: "Display lab results from yesterday", entities: [{ type: EntityType.TEMPORAL, value: "yesterday", startIndex: 24, endIndex: 33, confidence: 1.0 }] },
  { text: "What were the vitals last week", entities: [{ type: EntityType.TEMPORAL, value: "last week", startIndex: 20, endIndex: 29, confidence: 1.0 }] },
  { text: "Show appointments for next month", entities: [{ type: EntityType.TEMPORAL, value: "next month", startIndex: 21, endIndex: 31, confidence: 1.0 }] },
  { text: "Display medications from last visit", entities: [{ type: EntityType.TEMPORAL, value: "last visit", startIndex: 24, endIndex: 34, confidence: 1.0 }] },
  
  // Mixed entity examples
  { text: "Show John Doe's lab results from yesterday", entities: [
    { type: EntityType.PERSON, value: "John Doe", startIndex: 5, endIndex: 13, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "yesterday", startIndex: 30, endIndex: 39, confidence: 1.0 }
  ]},
  { text: "What were Mary Smith's vitals last week", entities: [
    { type: EntityType.PERSON, value: "Mary Smith", startIndex: 10, endIndex: 21, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "last week", startIndex: 29, endIndex: 38, confidence: 1.0 }
  ]},
  // Add more examples for better training
  { text: "Show me Robert Johnson's allergies", entities: [
    { type: EntityType.PERSON, value: "Robert Johnson", startIndex: 8, endIndex: 22, confidence: 1.0 }
  ]},
  { text: "What medication is Emily Davis taking", entities: [
    { type: EntityType.PERSON, value: "Emily Davis", startIndex: 18, endIndex: 29, confidence: 1.0 }
  ]},
  { text: "Show lab results from two weeks ago", entities: [
    { type: EntityType.TEMPORAL, value: "two weeks ago", startIndex: 20, endIndex: 33, confidence: 1.0 }
  ]},
  { text: "Display Michael Brown's appointments for next week", entities: [
    { type: EntityType.PERSON, value: "Michael Brown", startIndex: 8, endIndex: 21, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "next week", startIndex: 38, endIndex: 47, confidence: 1.0 }
  ]},
];
