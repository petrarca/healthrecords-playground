import { EntityType } from '../types/intents';

// Define entity training data
export const entityTrainingData = [
  // Person entity examples
  { text: "Show lab results for John Smith", entities: [{ type: EntityType.PERSON, value: "John Smith", startIndex: 20, endIndex: 30, confidence: 1.0 }] },
  { text: "What are Mary Smith's vitals", entities: [{ type: EntityType.PERSON, value: "Mary Smith", startIndex: 9, endIndex: 20, confidence: 1.0 }] },
  { text: "Show allergies for patient James Wilson", entities: [{ type: EntityType.PERSON, value: "James Wilson", startIndex: 26, endIndex: 38, confidence: 1.0 }] },
  { text: "Display medications for Sarah Johnson", entities: [{ type: EntityType.PERSON, value: "Sarah Johnson", startIndex: 24, endIndex: 37, confidence: 1.0 }] },
  { text: "What conditions does David Miller have", entities: [{ type: EntityType.PERSON, value: "David Miller", startIndex: 20, endIndex: 32, confidence: 1.0 }] },
  { text: "Show me Emma Thompson's medical history", entities: [{ type: EntityType.PERSON, value: "Emma Thompson", startIndex: 8, endIndex: 22, confidence: 1.0 }] },
  { text: "Pull up Michael Garcia's chart", entities: [{ type: EntityType.PERSON, value: "Michael Garcia", startIndex: 8, endIndex: 22, confidence: 1.0 }] },
  { text: "I need to see Jennifer Lee's records", entities: [{ type: EntityType.PERSON, value: "Jennifer Lee", startIndex: 13, endIndex: 25, confidence: 1.0 }] },
  { text: "Can you show me William Brown's test results", entities: [{ type: EntityType.PERSON, value: "William Brown", startIndex: 16, endIndex: 29, confidence: 1.0 }] },
  { text: "Let's check on patient Elizabeth Chen", entities: [{ type: EntityType.PERSON, value: "Elizabeth Chen", startIndex: 23, endIndex: 37, confidence: 1.0 }] },
  { text: "Dr. Rodriguez wants to see Thomas Wilson's chart", entities: [{ type: EntityType.PERSON, value: "Thomas Wilson", startIndex: 25, endIndex: 38, confidence: 1.0 }] },
  { text: "Patient Robert Martinez needs his medication list", entities: [{ type: EntityType.PERSON, value: "Robert Martinez", startIndex: 8, endIndex: 24, confidence: 1.0 }] },
  
  // Temporal entity examples
  { text: "Show latest vitals", entities: [{ type: EntityType.TEMPORAL, value: "latest", startIndex: 5, endIndex: 11, confidence: 1.0 }] },
  { text: "Display lab results from yesterday", entities: [{ type: EntityType.TEMPORAL, value: "yesterday", startIndex: 24, endIndex: 33, confidence: 1.0 }] },
  { text: "What were the vitals last week", entities: [{ type: EntityType.TEMPORAL, value: "last week", startIndex: 20, endIndex: 29, confidence: 1.0 }] },
  { text: "Show appointments for next month", entities: [{ type: EntityType.TEMPORAL, value: "next month", startIndex: 21, endIndex: 31, confidence: 1.0 }] },
  { text: "Display medications from last visit", entities: [{ type: EntityType.TEMPORAL, value: "last visit", startIndex: 24, endIndex: 34, confidence: 1.0 }] },
  { text: "Show me test results from two days ago", entities: [{ type: EntityType.TEMPORAL, value: "two days ago", startIndex: 23, endIndex: 35, confidence: 1.0 }] },
  { text: "What were the blood pressure readings this morning", entities: [{ type: EntityType.TEMPORAL, value: "this morning", startIndex: 37, endIndex: 49, confidence: 1.0 }] },
  { text: "Show all medications prescribed in the past year", entities: [{ type: EntityType.TEMPORAL, value: "past year", startIndex: 36, endIndex: 45, confidence: 1.0 }] },
  { text: "What lab tests were done last quarter", entities: [{ type: EntityType.TEMPORAL, value: "last quarter", startIndex: 24, endIndex: 36, confidence: 1.0 }] },
  { text: "Show me vitals from the previous admission", entities: [{ type: EntityType.TEMPORAL, value: "previous admission", startIndex: 19, endIndex: 37, confidence: 1.0 }] },
  { text: "Display records from earlier today", entities: [{ type: EntityType.TEMPORAL, value: "earlier today", startIndex: 20, endIndex: 33, confidence: 1.0 }] },
  { text: "What happened during the overnight stay", entities: [{ type: EntityType.TEMPORAL, value: "overnight", startIndex: 22, endIndex: 31, confidence: 1.0 }] },
  { text: "Show me the recent changes in medication", entities: [{ type: EntityType.TEMPORAL, value: "recent", startIndex: 8, endIndex: 14, confidence: 1.0 }] },
  
  // Mixed entity examples
  { text: "Show John Smith's lab results from yesterday", entities: [
    { type: EntityType.PERSON, value: "John Smith", startIndex: 5, endIndex: 14, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "yesterday", startIndex: 30, endIndex: 39, confidence: 1.0 }
  ]},
  { text: "What were Mary Smith's vitals last week", entities: [
    { type: EntityType.PERSON, value: "Mary Smith", startIndex: 10, endIndex: 21, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "last week", startIndex: 29, endIndex: 38, confidence: 1.0 }
  ]},
  { text: "Show me Robert Johnson's allergies", entities: [
    { type: EntityType.PERSON, value: "Robert Johnson", startIndex: 8, endIndex: 22, confidence: 1.0 }
  ]},
  { text: "Display Emma Thompson's lab results from last month", entities: [
    { type: EntityType.PERSON, value: "Emma Thompson", startIndex: 8, endIndex: 22, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "last month", startIndex: 39, endIndex: 49, confidence: 1.0 }
  ]},
  { text: "What medications was Michael Garcia taking two weeks ago", entities: [
    { type: EntityType.PERSON, value: "Michael Garcia", startIndex: 21, endIndex: 35, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "two weeks ago", startIndex: 43, endIndex: 56, confidence: 1.0 }
  ]},
  { text: "Show Jennifer Lee's vitals from this morning's checkup", entities: [
    { type: EntityType.PERSON, value: "Jennifer Lee", startIndex: 5, endIndex: 17, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "this morning", startIndex: 30, endIndex: 42, confidence: 1.0 }
  ]},
  { text: "Pull up William Brown's chart from the previous visit", entities: [
    { type: EntityType.PERSON, value: "William Brown", startIndex: 8, endIndex: 21, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "previous visit", startIndex: 33, endIndex: 47, confidence: 1.0 }
  ]},
  { text: "What were Elizabeth Chen's blood pressure readings yesterday afternoon", entities: [
    { type: EntityType.PERSON, value: "Elizabeth Chen", startIndex: 10, endIndex: 24, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "yesterday afternoon", startIndex: 49, endIndex: 68, confidence: 1.0 }
  ]},
  { text: "Show Thomas Wilson's recent medication changes", entities: [
    { type: EntityType.PERSON, value: "Thomas Wilson", startIndex: 5, endIndex: 18, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "recent", startIndex: 19, endIndex: 25, confidence: 1.0 }
  ]},
  { text: "What lab tests did Robert Martinez have last quarter", entities: [
    { type: EntityType.PERSON, value: "Robert Martinez", startIndex: 18, endIndex: 34, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "last quarter", startIndex: 40, endIndex: 52, confidence: 1.0 }
  ]},
  { text: "Show me Sarah Johnson's records from her last three visits", entities: [
    { type: EntityType.PERSON, value: "Sarah Johnson", startIndex: 8, endIndex: 21, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "last three visits", startIndex: 35, endIndex: 52, confidence: 1.0 }
  ]},
  { text: "What happened to David Miller during his overnight stay last week", entities: [
    { type: EntityType.PERSON, value: "David Miller", startIndex: 16, endIndex: 28, confidence: 1.0 },
    { type: EntityType.TEMPORAL, value: "overnight stay last week", startIndex: 36, endIndex: 60, confidence: 1.0 }
  ]}
];
