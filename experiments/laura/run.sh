#!/bin/bash

# Run the Laura experiment as a separate Vite application
cd "$(dirname "$0")"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  pnpm install
fi

# Run the development server
pnpm run dev
