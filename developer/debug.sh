#!/bin/bash

# Kill any existing Chrome instances with remote debugging
pkill -f "Chrome.*remote-debugging-port=9222" || true

# Start Chrome with remote debugging enabled
open -a "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir=$(pwd)/.vscode/chrome-debug-profile http://localhost:5173

# Start Vite in debug mode
npm run dev:debug
