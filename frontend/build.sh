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

# Get the list of changed files from the latest commit
# Returns: List of changed files or empty string if not in a git repository
get_changed_files() {
  # Only check if we're in a git repository
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    log_message "Not in a git repository or unable to determine changes, proceeding with full build" "WARNING"
    return
  fi
  
  # Get the list of changed files from the latest commit
  local changed_files=$(git diff --name-only HEAD^ HEAD)
  
  echo "$changed_files"
}

# Display changed files in a readable format
display_changed_files() {
  local changed_files="$1"
  
  log_message "Changed files:" "FILES"
  
  # Display changed files with line numbers for better readability
  if [ -z "$changed_files" ]; then
    log_message "No changed files detected" "FILES"
  else
    local count=1
    
    while read -r file; do
      log_message "  $count. $file" "FILES"
      count=$((count+1))
    done <<< "$changed_files"
  fi
  
  log_message "--- end of changed files ---" "FILES"
}

# Determine which targets need to be built based on changed files and build type
# Sets the global TARGETS array
determine_targets() {
  local build_type=$1
  local changed_files=$2
  
  # Initialize empty targets array
  TARGETS=()
  
  # If not in a git repository or no changed files provided, build everything based on build type
  if [ -z "$changed_files" ]; then
    if [ "$build_type" = "developer" ]; then
      TARGETS+=("frontend_app" "developer_app")
      log_message "No git history available, building all targets for developer build" "BUILD"
    elif [ "$build_type" = "frontend" ] || [ -z "$build_type" ]; then
      TARGETS+=("frontend_app")
      log_message "No git history available, building frontend app" "BUILD"
    fi
    return
  fi
  
  # Check for frontend changes (excluding developer and experiments)
  local frontend_changes=$(echo "$changed_files" | grep -v "^frontend/developer/" | grep -v "^frontend/experiments/" | grep "^frontend/" | grep -q .; echo $?)
  
  # Check for developer changes (excluding experiments)
  local developer_changes=$(echo "$changed_files" | grep "^frontend/developer/" | grep -q .; echo $?)
  
  # Determine targets based on build type and changes
  if [ "$build_type" = "developer" ]; then
    # For developer builds, we need both frontend and developer if either has changes
    if [ $frontend_changes -eq 0 ] || [ $developer_changes -eq 0 ]; then
      if [ $frontend_changes -eq 0 ]; then
        log_message "Changes detected in frontend, will compile frontend app" "BUILD"
        TARGETS+=("frontend_app")
      fi
      
      if [ $developer_changes -eq 0 ]; then
        log_message "Changes detected in developer, will build developer app" "BUILD"
      else
        log_message "No changes in developer, but frontend changes require developer rebuild" "BUILD"
      fi
      
      TARGETS+=("developer_app")
    else
      log_message "No changes in frontend or developer, skipping build" "SKIP"
    fi
  elif [ "$build_type" = "frontend" ] || [ -z "$build_type" ]; then
    # For frontend builds, we only need frontend if it has changes
    if [ $frontend_changes -eq 0 ]; then
      log_message "Changes detected in frontend, will build frontend app" "BUILD"
      TARGETS+=("frontend_app")
    else
      log_message "No changes in frontend, skipping build" "SKIP"
    fi
  fi
  
  # Log the determined targets
  if [ ${#TARGETS[@]} -eq 0 ]; then
    log_message "No targets to build" "SKIP"
  else
    log_message "Targets to build: ${TARGETS[*]}" "BUILD"
  fi
}

# Install dependencies
install_dependencies() {
  log_message "Installing dependencies..."
  pnpm install
}

# Compile the frontend app (without final build steps)
compile_frontend_app() {
  log_message "Compiling frontend app..."
  
  # Generate build metadata
  log_message "Generating build metadata..."
  
  # Set production environment for build metadata
  export NODE_ENV=production
  
  pnpm run generate-build-metadata
  
  log_message "Frontend app compilation completed" "SUCCESS"
}

# Build the frontend app (complete build)
build_frontend_app() {
  log_message "Building frontend app..."
  
  # First compile the frontend
  compile_frontend_app
  
  # Then build it
  pnpm build
  
  log_message "Frontend app build completed" "SUCCESS"
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

# Process all targets
process_targets() {
  local targets=("$@")
  
  # Install dependencies first
  install_dependencies
  
  # Process each target
  for target in "${targets[@]}"; do
    case "$target" in
      frontend_app)
        if [ "$BUILD_TYPE" = "developer" ]; then
          # For developer builds, we only need to compile frontend, not build it
          compile_frontend_app
        else
          # For frontend builds, we need to build frontend completely
          build_frontend_app
        fi
        ;;
      developer_app)
        build_developer_app
        ;;
      *)
        log_message "Unknown target: $target" "ERROR"
        ;;
    esac
  done
}

# ======================================
# MAIN SCRIPT
# ======================================

print_section "Build Script Started"

# Determine build type
determine_build_type $1

# Get changed files
CHANGED_FILES=$(get_changed_files)

# Display changed files
display_changed_files "$CHANGED_FILES"

# Determine targets based on build type and changed files
determine_targets "$BUILD_TYPE" "$CHANGED_FILES"

# If we have targets, process them
if [ ${#TARGETS[@]} -gt 0 ]; then
  process_targets "${TARGETS[@]}"
  log_message "All targets processed successfully" "SUCCESS"
else
  log_message "No targets to build, exiting" "EXIT"
fi

print_section "Build Script Finished"