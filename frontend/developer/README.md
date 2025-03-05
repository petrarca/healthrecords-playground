# Sonnet Developer Portal

## Overview

The Sonnet Developer Portal provides a comprehensive set of resources for developers working with the Sonnet platform. This portal serves as a centralized location for component documentation, interactive examples, and development resources.

## Features
### Component Documentation

The Developer Portal includes detailed documentation for various UI components used throughout the Sonnet application:

- **Usage examples**: Code snippets showing how to use each component
- **Props reference**: Detailed information about component props and their types
- **Best practices**: Guidelines for using components effectively

### Interactive Examples

Experience components in action with live, interactive examples:

- **Quantity Input**: A specialized input component for handling numeric quantities with units
- **JSON Renderer**: A component for displaying JSON data with collapsible sections and syntax highlighting
- **Field Renderers**: A collection of components for rendering different types of form fields and medical data
- **Address Card**: A component for managing patient addresses with support for adding, editing, and setting primary addresses

### Development Resources

Resources to help developers extend and customize the Sonnet platform:

- **Component guides**: In-depth guides for working with specific components
- **Architecture overview**: Information about the application's architecture and design patterns
- **Extension points**: Documentation on how to extend the platform with custom components

## Getting Started

To run the Developer Portal locally:

1. Navigate to the developer directory:
   ```bash
   cd developer
   ```

2. Install dependencies (if not already installed):
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5174/developer
   ```

## Adding New Components

To add a new component to the Developer Portal:

1. Create a new component example in the appropriate directory
2. Add the component to the DeveloperPage.tsx file
3. Create documentation for the component
4. Update this README if necessary

## Contributing

Contributions to the Developer Portal are welcome. Please follow these steps:

1. Create a feature branch for your changes
2. Make your changes and test them locally
3. Submit a pull request with a clear description of your changes

## Related Resources

- [Main Sonnet Documentation](../README.md)
- [Component Guidelines](../docs/component-guidelines.md)
