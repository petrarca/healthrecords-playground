#!/usr/bin/env node
const { execSync } = require('child_process');

// Check if main project files changed
const mainChanged = execSync('git diff --quiet HEAD^ HEAD ./ && echo false || echo true')
  .toString().trim() === 'true';

// Check if developer directory files changed
const devChanged = execSync('git diff --quiet HEAD^ HEAD ./developer && echo false || echo true')
  .toString().trim() === 'true';

// Exit with code 1 if changes detected (to trigger build), 0 otherwise (to skip build)
process.exit(mainChanged || devChanged ? 1 : 0);
