// Build metadata utility

// Interface for build metadata
export interface BuildMetadata {
  version: string;
  buildTimestamp: string;
}

// Get current UTC timestamp
function getCurrentUTCTimestamp(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC (development build)`;
}

// Default metadata when file is missing
const missingMetadata: BuildMetadata = {
  version: 'unknown',
  buildTimestamp: ''
};

// Default metadata with placeholder values
const defaultMetadata: BuildMetadata = {
  version: '0.0.0',
  buildTimestamp: getCurrentUTCTimestamp()
};

// Cache for the build metadata
let cachedMetadata: BuildMetadata | null = null;

/**
 * Fetches the build metadata from the JSON file
 * In development, this will return default values if the file doesn't exist
 */
export async function fetchBuildMetadata(): Promise<BuildMetadata> {
  // Return cached metadata if available
  if (cachedMetadata !== null) {
    return cachedMetadata;
  }

  try {
    const response = await fetch('/build-metadata.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch build metadata: ${response.status}`);
    }
    
    const data = await response.json() as BuildMetadata;
    cachedMetadata = {
      version: data.version || missingMetadata.version,
      buildTimestamp: data.buildTimestamp || missingMetadata.buildTimestamp
    };
    
    return cachedMetadata;
  } catch (error) {
    console.error('Error fetching build metadata:', error);
    return missingMetadata;
  }
}

/**
 * Gets the build metadata synchronously from cache
 * If not yet loaded, returns default values
 */
export function getBuildMetadataSync(): BuildMetadata {
  return cachedMetadata !== null ? cachedMetadata : defaultMetadata;
}

/**
 * Get build metadata synchronously (returns cached value or default)
 * @returns BuildMetadata
 */
export function getBuildMetadata(): BuildMetadata {
  return cachedMetadata || missingMetadata;
}
