#!/bin/bash

# Get the first argument (build type)
BUILD_TYPE=$1

# Install dependencies
pnpm install

# Handle different build types
if [ "$BUILD_TYPE" = "developer" ]; then
  # Build frontend first
  pnpm build
  
  # Build developer app
  cd ./developer
  pnpm install
  pnpm build
  cd ..

  # Move the developer output to where Vercel expects it
  rm -rf ./dist
  mkdir -p ./dist
  cp -r ./developer/dist/* ./dist/
elif [ "$BUILD_TYPE" = "frontend" ] || [ -z "$BUILD_TYPE" ]; then
  # Just build the frontend
  pnpm build
fi