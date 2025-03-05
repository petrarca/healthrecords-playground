#!/bin/bash

echo "---- Start building using built script"

# Print basic environment info
echo "Current directory: $(pwd)"

# Check for specific build target
echo "Build target: $BUILD_TARGET"

# Get the first argument (build type)
BUILD_TYPE=$1

# If BUILD_TYPE is not specified, try to determine from BUILD_TARGET
if [ -z "$BUILD_TYPE" ] && [ ! -z "$BUILD_TARGET" ]; then
  if [[ "$BUILD_TARGET" == developer ]]; then
    echo "Detected developer build from project name: $BUILD_TARGET"
    BUILD_TYPE="developer"
  else
    echo "Detected frontend build from project name: $BUILD_TARGET"
    BUILD_TYPE="frontend"
  fi
fi

echo "Building with type: ${BUILD_TYPE:-default}"

# Get the list of changed files from the latest commit
# Only if we're in a git repository
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  CHANGED_FILES=$(git diff --name-only HEAD^ HEAD)

  echo "Changed files:"
  echo $CHANGED_FILES
  echo "--- end of changed files"
  
  # Check if we should skip the build based on changed files
  if [ "$BUILD_TYPE" = "frontend" ]; then
    # For frontend build, check if there are changes in frontend excluding developer and experiments
    if ! echo "$CHANGED_FILES" | grep -v "^frontend/developer/" | grep -v "^frontend/experiments/" | grep "^frontend/" | grep -q .; then
      # No relevant changes for frontend build, skip the build
      echo " No changes in frontend (excluding developer and experiments), skipping build"
      exit 0
    else
      echo " Changes detected in frontend (excluding developer and experiments), proceeding with build"
    fi
  elif [ "$BUILD_TYPE" = "developer" ]; then
    # For developer build, check if there are changes in frontend or developer (excluding experiments)
    if ! echo "$CHANGED_FILES" | grep -v "^frontend/experiments/" | grep "^frontend/" | grep -q .; then
      # No relevant changes for developer build, skip the build
      echo " No changes in frontend or developer (excluding experiments), skipping build"
      exit 0
    else
      echo " Changes detected in frontend or developer (excluding experiments), proceeding with build"
    fi
  else
    # Default behavior (no argument or unknown argument)
    # Check if there are any changes outside the developer or experiments directories
    if ! echo "$CHANGED_FILES" | grep -v "^frontend/developer/" | grep -v "^frontend/experiments/" | grep -q .; then
      # All changes are within developer or experiments directories, skip the build
      echo " Changes only in developer and/or experiments directories, skipping build"
      exit 0
    else
      echo " Changes detected outside the developer and experiments directories, proceeding with build"
    fi
  fi
else
  echo " Not in a git repository or unable to determine changes, proceeding with full build"
fi

# Install dependencies
pnpm install

# Handle different build types
if [ "$BUILD_TYPE" = "developer" ]; then
  # Build developer app
  cd ./developer
  pnpm install
  
  # Set the correct base path for production
  export NODE_ENV=production
  
  pnpm build
  cd ..

  # Move the developer output to where Vercel expects it
  rm -rf ./dist
  mkdir -p ./dist
  cp -r ./developer/dist/* ./dist/
  echo "Developer app build completed"
elif [ "$BUILD_TYPE" = "frontend" ] || [ -z "$BUILD_TYPE" ]; then
  echo "Building frontend app only..."
  
  # Generate build metadata before building
  echo "Generating build metadata..."
  
  # Set production environment for build metadata
  export NODE_ENV=production
  
  pnpm run generate-build-metadata
  
  # Build the frontend
  pnpm build
  echo "Frontend build completed"
fi

echo "---- Build script finished"