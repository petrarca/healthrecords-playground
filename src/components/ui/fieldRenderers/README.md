# Custom Field Renderers

This module provides a flexible system for rendering different types of field data using custom renderers. The system allows you to define custom renderers in the field metadata, making it easy to add new renderers without modifying existing components.

## Key Components

### 1. FieldRenderer

The main component that renders fields based on their metadata. It uses the `rendererType` property in the field metadata to determine which renderer to use.

```tsx
<FieldRenderer
  data={data}
  fieldName="components"
  fieldMeta={fieldMetadata}
/>
```

### 2. Renderer Registry

A registry of available renderers, which maps renderer types to their corresponding components.

```tsx
// Register a custom renderer
registerRenderer('myCustomType', MyCustomRenderer);

// Get a renderer by type
const Renderer = getRenderer('myCustomType');
```

### 3. FieldRendererProps Interface

The interface that all renderer components must implement.

```tsx
export interface FieldRendererProps {
  data: any;
  fieldName: string;
  fieldMeta: any;
  [key: string]: any;
}
```

## Built-in Renderers

### 1. JSON Renderer

The default renderer for JSON data, which displays JSON in a colorized, interactive format.

### 2. Lab Components Renderer

A specialized renderer for lab test results, which displays them in a tabular format.

## How to Use

### 1. Define Field Metadata

Add the `rendererType` property to your field metadata to specify which renderer to use.

```typescript
{
  components: {
    label: 'Components',
    description: 'Components of lab result',
    type: 'json',
    required: false,
    rendererType: 'labComponents'
  }
}
```

### 2. Use the FieldRenderer Component

Use the `FieldRenderer` component to render your fields.

```tsx
<FieldRenderer
  data={record.details?.components}
  fieldName="components"
  fieldMeta={fieldMetadata}
/>
```

### 3. Create Custom Renderers

Create custom renderers by implementing the `FieldRendererProps` interface and registering them with the renderer registry.

```tsx
import { FieldRendererProps, registerRenderer } from './fieldRenderers';

const MyCustomRenderer: React.FC<FieldRendererProps> = ({ data, fieldName, fieldMeta }) => {
  // Custom rendering logic
  return <div>...</div>;
};

// Register the renderer
registerRenderer('myCustomType', MyCustomRenderer);
```

## Demo

Visit the [Field Renderers Demo](/demo/field-renderers) to see the system in action.
