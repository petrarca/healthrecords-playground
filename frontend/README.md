# Sonnet Frontend

## Overview

This is the frontend part of the Sonnet application. For a complete overview of the entire Sonnet electronic health records (EHR) and practice management system, please refer to the [main project README](../README.md).

The frontend is built with React 19 and TypeScript, demonstrating state-of-the-art frontend development practices, focusing on modularity, maintainability, and user experience.

The application adheres to accessibility standards through proper implementation of ARIA (Accessible Rich Internet Applications) attributes and patterns, ensuring the interface is usable by people with disabilities who use assistive technologies.

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **State Management**: RxJS for reactive state management
- **UI Components**: Custom components built with Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Data Fetching**: TanStack Query (formerly known as React Query)

## Architecture

The application follows a modular architecture with clear separation of concerns:

### Core Components

1. **Context System**: Tracks current patient, view, and record context across the application
2. **Navigation Service**: Handles routing with context awareness
3. **Assistant Service**: Provides a natural language interface for interacting with the application
4. **Search Service**: Enables powerful patient and record search capabilities

### Architectural Principles

The application implements a clean separation between UI components and business logic:

- **UI Components**: Pure presentation layer focused on rendering and user interactions
  - Components receive data via props and emit events for user actions
  - Stateless where possible, with local state only for UI concerns
  - No direct data fetching or business logic within components

- **Services Layer**: Encapsulates all business logic and data operations
  - Services are singleton classes that manage specific domains of functionality
  - Handle data fetching, transformation, and state management
  - Provide reactive streams of data that components can subscribe to
  - Abstract away implementation details from the UI layer

This separation ensures:
- Better testability of both UI and business logic in isolation
- Easier maintenance as changes to business logic don't require UI changes
- Improved reusability of both components and services
- Clear responsibilities and dependencies between application layers

### Key Directories

- `/src/components`: UI components organized by feature
- `/src/services`: Core application services
- `/src/context`: Application context management
- `/src/hooks`: Custom React hooks
- `/src/models`: Data models and interfaces
- `/src/lib`: Utility libraries and third-party integrations

### Notable Features

- **Natural Language Assistant**: Process commands like "show me patient records" or "search for patients with diabetes"
- **Patient Timeline**: View patient medical history in a chronological format
- **Context-Aware Navigation**: The application maintains awareness of the current patient and view
- **Responsive Design**: Works across desktop and mobile devices
- **Developer Portal**: Access to component documentation, examples, and development resources

### Developer Portal

The application includes a dedicated Developer Portal that provides:

- **Component Documentation**: Detailed documentation for UI components
- **Interactive Examples**: Live examples of components in action
- **Development Resources**: Tools and guides for extending the application

The Developer Portal can be accessed at `/developer` and serves as a comprehensive resource for developers working with the Sonnet platform. It includes examples of specialized components like:

- Quantity Input: For handling numeric quantities with units
- JSON Renderer: For displaying complex JSON data with syntax highlighting
- Field Renderers: For rendering different types of medical data
- Address Card: For managing patient addresses

### Advanced Architecture Features

#### Flexible Metadata System

The application implements a sophisticated metadata system for medical records:

- **Field Metadata**: Each field in a medical record has associated metadata that describes its type, validation rules, and rendering preferences
- **Type-Safe Definitions**: TypeScript interfaces ensure consistency and type safety across the application
- **Quantity Value Handling**: Special handling for medical measurements with units (e.g., blood pressure, temperature)
- **Validation Rules**: Built-in validation based on field metadata

#### Plugin-Based Field Rendering

A modular system for rendering different types of medical data:

- **Renderer Registry**: Dynamically register and use custom field renderers
- **Metadata-Driven**: Field metadata specifies which renderer to use for each field
- **Built-in Renderers**: Includes specialized renderers for common medical data types:
  - **Lab Components Renderer**: Displays laboratory results in a tabular format
  - **JSON Renderer**: Interactive, collapsible view for complex JSON data
- **Extensibility**: Easily add new renderers without modifying existing code

Visit the demo routes (`#/demo/json-renderer` and `#/demo/field-renderers`) to see these systems in action.

## CI/CD Pipeline Integration

The frontend repository is structured as a monorepo containing both the main frontend application and a developer portal. To facilitate CI/CD pipelines, we provide a unified build script that can build either or both applications.

### Build Script Usage

The `build.sh` script in the root of the frontend directory can be used to build the main frontend app, the developer portal, or both:

```bash
# Build just the main frontend app
./build.sh frontend

# Build the developer portal
./build.sh developer
```

If no argument is provided, the script will build only the main frontend app by default.

**Important**: The target output directory for both build types is always `./frontend/dist`. When building the developer portal, the script automatically moves the output from `./frontend/developer/dist` to `./frontend/dist`.

### Automatic Build Type Detection

When running in CI/CD environments, the build script can automatically detect which app to build based on the `BUILD_TARGET` environment variable:

```bash
# Set the build target
export BUILD_TARGET=developer

# Run the build script (will detect the target)
./build.sh
```

### Vercel Deployment Configuration

For Vercel deployments, the build configuration is already set up in the `vercel.json` files. The build script is configured to:

1. Install all dependencies
2. Build the appropriate application(s)
3. Move the build output to the expected location (`./frontend/dist`)

The `vercel.json` configuration specifies `"outputDirectory": "dist"`, which means Vercel will look for the build output in the `./frontend/dist` directory. This is consistent with where the `build.sh` script places the output for both the frontend app and developer portal.

For Vercel projects deploying the developer portal, simply set `BUILD_TARGET=developer` in the project environment variables.

### Optimizing CI/CD with Selective Builds

To optimize CI/CD pipelines, you can use the `ignore-build.sh` script to selectively build only when relevant files have changed:

```bash
# Check if frontend files have changed (excluding developer and experiments)
./ignore-build.sh frontend

# Check if frontend or developer files have changed (excluding experiments)
./ignore-build.sh developer
```

The script returns exit code 1 if a build should proceed, and exit code 0 if the build can be skipped.

### Example GitHub Actions Workflow

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 2  # Need history for ignore-build.sh

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Check if frontend build is needed
        id: check-frontend
        run: |
          cd frontend
          ./ignore-build.sh frontend
          echo "::set-output name=should_build::$?"

      - name: Build frontend
        if: steps.check-frontend.outputs.should_build == '1'
        run: |
          cd frontend
          ./build.sh frontend

      - name: Check if developer build is needed
        id: check-developer
        run: |
          cd frontend
          ./ignore-build.sh developer
          echo "::set-output name=should_build::$?"

      - name: Build developer portal
        if: steps.check-developer.outputs.should_build == '1'
        run: |
          cd frontend
          ./build.sh developer
```

This setup ensures efficient CI/CD pipelines by only building the parts of the application that have changed.

## Development Setup

### Installation

```bash
# Install dependencies for the frontend and all subprojects
pnpm install-all
```

### Development Server

```bash
# Start development server
pnpm dev
```

### Building for Production

```bash
# Type check and build
pnpm build

# Preview production build
pnpm preview
```

### Linting

The project uses ESLint with TypeScript-ESLint for code quality and consistency. To lint the project:

```bash
# Run ESLint on the entire codebase
pnpm lint
```

The ESLint configuration is defined in `eslint.config.js` and includes:
- TypeScript-specific rules
- React Hooks linting
- React Refresh plugin

Husky is configured to run linting before commits to ensure code quality.

## Project Structure

```
frontend/
├── developer/           # Developer portal application
├── experiments/         # Experimental features
│   └── laura/           # Laura's experimental features
├── public/              # Static assets
├── src/
│   ├── assets/          # Application assets
│   ├── components/      # React components
│   │   ├── patient/     # Patient-related components
│   │   │   ├── demographics/  # Patient demographic information
│   │   │   └── vitals/  # Vital signs components and charts
│   │   ├── timeline/    # Timeline view components
│   │   └── ui/          # Reusable UI components
│   │       └── fieldRenderers/  # Custom field rendering components
│   ├── constants/       # Application constants
│   ├── context/         # Context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Third-party library integrations
│   ├── models/          # Data models
│   ├── services/        # Application services
│   │   ├── assistant/   # Natural language assistant
│   │   │   └── intents/ # Intent handlers for assistant
│   │   ├── mappers/     # Data mappers
│   │   └── search/      # Search functionality
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
└── vite.config.ts       # Vite configuration
```
