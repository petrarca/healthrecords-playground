#!/bin/bash

# Get the first argument (build type)
BUILD_TYPE=$1

# Get the list of changed files from the latest commit
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD)

# Handle different build types
if [ "$BUILD_TYPE" = "frontend" ]; then
  # For frontend build, check if there are changes in frontend excluding developer and experiments
  if echo "$CHANGED_FILES" | grep -v "^frontend/developer/" | grep -v "^frontend/experiments/" | grep "^frontend/" | grep -q .; then
    # Changes detected in frontend (excluding developer and experiments), proceed with build
    echo "✅ Changes detected in frontend (excluding developer and experiments), proceeding with build"
    exit 1
  else
    # No relevant changes for frontend build, skip the build
    echo "🛑 No changes in frontend (excluding developer and experiments), skipping build"
    exit 0
  fi
elif [ "$BUILD_TYPE" = "developer" ]; then
  # For developer build, check if there are changes in frontend or developer (excluding experiments)
  if echo "$CHANGED_FILES" | grep -v "^frontend/experiments/" | grep "^frontend/" | grep -q .; then
    # Changes detected in frontend or developer (excluding experiments), proceed with build
    echo "✅ Changes detected in frontend or developer (excluding experiments), proceeding with build"
    exit 1
  else
    # No relevant changes for developer build, skip the build
    echo "🛑 No changes in frontend or developer (excluding experiments), skipping build"
    exit 0
  fi
else
  # Default behavior (no argument or unknown argument)
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
fi
