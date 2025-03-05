#!/bin/bash

# Get the list of changed files from the latest commit
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD)

# Check if there are any changes outside the developer or experiments directories
if echo "$CHANGED_FILES" | grep -v "^frontend/developer/" | grep -v "^frontend/experiments/" | grep -q .; then
  # Changes detected outside of developer and experiments directories, proceed with build
  echo "✅ Changes detected outside the developer and experiments directories, proceeding with build"
  exit 1
else
  # All changes are within developer or experiments directories, skip the build
  echo "🛑 Changes only in developer and/or experiments directories, skipping build"
  exit 0
fi
