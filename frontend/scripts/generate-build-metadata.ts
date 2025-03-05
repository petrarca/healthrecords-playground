#!/usr/bin/env tsx

/**
 * Script to generate build metadata JSON file
 * This script reads the version from package.json and adds a build timestamp
 * It writes the metadata to public/build-metadata.json
 * 
 * For production builds, it uses the current UTC timestamp
 * For development builds, it uses the timestamp with "development build" suffix
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root directory
const projectRoot = path.resolve(__dirname, '..');

// Read the package.json file to get the version
const packageJsonPath = path.join(projectRoot, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Interface for build metadata
interface BuildMetadata {
  version: string;
  buildTimestamp: string;
}

// Format date as YYYY-MM-DD HH:MM:SS in UTC
function formatBuildDate(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
}

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

// Create the metadata object
const timestamp = formatBuildDate();
const buildMetadata: BuildMetadata = {
  version: packageJson.version || '0.0.0',
  buildTimestamp: isProduction ? timestamp : `${timestamp} Development build`
};

// Ensure the public directory exists
const publicDir = path.join(projectRoot, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the metadata to a JSON file
const metadataPath = path.join(publicDir, 'build-metadata.json');
fs.writeFileSync(metadataPath, JSON.stringify(buildMetadata, null, 2));

console.log(`Build metadata generated at ${metadataPath}`);
console.log(`Version: ${buildMetadata.version}`);
console.log(`Build Timestamp: ${buildMetadata.buildTimestamp}`);
console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
