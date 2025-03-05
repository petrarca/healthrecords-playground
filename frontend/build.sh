#!/bin/bash

# ======================================
# FUNCTION DEFINITIONS
# ======================================

# Print a message with a prefix
# Usage: log_message "message" ["prefix"]
log_message() {
  local prefix=${2:-"INFO"}
  echo "[${prefix}] $1"
}

# Print a section header
# Usage: print_section "section name"
print_section() {
  echo ""
  echo "==== $1 ===="
}

# Determine the build type from arguments or environment variables
# Sets the global BUILD_TYPE variable
determine_build_type() {
  # Get the first argument (build type)
  BUILD_TYPE=$1

  # If BUILD_TYPE is not specified, try to determine from BUILD_TARGET
  if [ -z "$BUILD_TYPE" ] && [ ! -z "$BUILD_TARGET" ]; then
    if [[ "$BUILD_TARGET" == developer ]]; then
      log_message "Detected developer build from project name: $BUILD_TARGET"
      BUILD_TYPE="developer"
    else
      log_message "Detected frontend build from project name: $BUILD_TARGET"
      BUILD_TYPE="frontend"
    fi
  fi

  log_message "Building with type: ${BUILD_TYPE:-default}"
}

# Check if build should be skipped based on changed files
# Returns: 0 if build should proceed, 1 if build should be skipped
should_skip_build() {
  local build_type=$1
  
  # Only check if we're in a git repository
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    log_message "Not in a git repository or unable to determine changes, proceeding with full build" "WARNING"
    return 0
  fi
  
  # Get the list of changed files from the latest commit
  local changed_files=$(git diff --name-only HEAD^ HEAD)
  
  log_message "Changed files:"
  echo "$changed_files"
  log_message "--- end of changed files"
  
  # Check if we should skip the build based on changed files and build type
  if [ "$build_type" = "frontend" ]; then
    # For frontend build, check if there are changes in frontend excluding developer and experiments
    if ! echo "$changed_files" | grep -v "^frontend/developer/" | grep -v "^frontend/experiments/" | grep "^frontend/" | grep -q .; then
      log_message "No changes in frontend (excluding developer and experiments), skipping build" "SKIP"
      return 1
    else
      log_message "Changes detected in frontend (excluding developer and experiments), proceeding with build" "BUILD"
      return 0
    fi
  elif [ "$build_type" = "developer" ]; then
    # For developer build, check if there are changes in frontend or developer (excluding experiments)
    if ! echo "$changed_files" | grep -v "^frontend/experiments/" | grep "^frontend/" | grep -q .; then
      log_message "No changes in frontend or developer (excluding experiments), skipping build" "SKIP"
      return 1
    else
      log_message "Changes detected in frontend or developer (excluding experiments), proceeding with build" "BUILD"
      return 0
    fi
  else
    # Default behavior (no argument or unknown argument)
    # Check if there are any changes outside the developer or experiments directories
    if ! echo "$changed_files" | grep -v "^frontend/developer/" | grep -v "^frontend/experiments/" | grep -q .; then
      log_message "Changes only in developer and/or experiments directories, skipping build" "SKIP"
      return 1
    else
      log_message "Changes detected outside the developer and experiments directories, proceeding with build" "BUILD"
      return 0
    fi
  fi
}

# Install dependencies
install_dependencies() {
  log_message "Installing dependencies..."
  pnpm install
}

# Build the developer app
build_developer_app() {
  log_message "Building developer app..."
  
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
  log_message "Developer app build completed" "SUCCESS"
}

# Build the frontend app
build_frontend_app() {
  log_message "Building frontend app only..."
  
  # Generate build metadata before building
  log_message "Generating build metadata..."
  
  # Set production environment for build metadata
  export NODE_ENV=production
  
  pnpm run generate-build-metadata
  
  # Build the frontend
  pnpm build
  log_message "Frontend build completed" "SUCCESS"
}

# ======================================
# MAIN SCRIPT
# ======================================

print_section "Build Script Started"

# Determine build type
determine_build_type $1

# Check if we should skip the build
should_skip_build "$BUILD_TYPE"
if [ $? -eq 1 ]; then
  log_message "Build skipped" "EXIT"
  exit 0
fi

# Install dependencies
install_dependencies

# Build the appropriate app
if [ "$BUILD_TYPE" = "developer" ]; then
  build_developer_app
elif [ "$BUILD_TYPE" = "frontend" ] || [ -z "$BUILD_TYPE" ]; then
  build_frontend_app
fi

print_section "Build Script Finished"