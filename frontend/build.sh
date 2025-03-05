#!/bin/bash

echo "---- Start building using built script"

# Print basic environment info
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Check for Vercel-specific environment variables
echo "Vercel project name: $VERCEL_PROJECT_NAME"
echo "Deployment URL: $VERCEL_URL"

# Get the first argument (build type)
BUILD_TYPE=$1

# If BUILD_TYPE is not specified, try to determine from VERCEL_PROJECT_NAME
if [ -z "$BUILD_TYPE" ] && [ ! -z "$VERCEL_PROJECT_NAME" ]; then
  if [[ "$VERCEL_PROJECT_NAME" == *-developer ]]; then
    echo "Detected developer build from project name: $VERCEL_PROJECT_NAME"
    BUILD_TYPE="developer"
  else
    echo "Detected frontend build from project name: $VERCEL_PROJECT_NAME"
    BUILD_TYPE="frontend"
  fi
fi

echo "Building with type: ${BUILD_TYPE:-default}"

# Install dependencies
pnpm install

# Handle different build types
if [ "$BUILD_TYPE" = "developer" ]; then
  # Build developer app
  cd ./developer
  pnpm install
  pnpm build
  cd ..

  # Move the developer output to where Vercel expects it
  rm -rf ./dist
  mkdir -p ./dist
  cp -r ./developer/dist/* ./dist/
  echo "Developer app build completed"
elif [ "$BUILD_TYPE" = "frontend" ] || [ -z "$BUILD_TYPE" ]; then
  echo "Building frontend app only..."
  # Just build the frontend
  pnpm build
  echo "Frontend build completed"
fi

echo "---- Build script finished"