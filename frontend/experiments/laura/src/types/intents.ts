// Define entity types
export enum EntityType {
  PERSON = 'person',
  TEMPORAL = 'temporal',
  NONE = 'none'
}

// Define entity interface
export interface Entity {
  type: EntityType;
  value: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
}

// Define intent interface
export interface Intent {
  name: string;
  examples: string[];
  contextRelevance?: {
    views?: string[];
    requiresPatient?: boolean;
    requiresRecord?: boolean;
  };
}
