import React from 'react';
import { LabComponentsRenderer } from './fieldRenderers/LabComponentsRenderer';
import { JsonDisplay } from './jsonRenderer';
import { FieldRendererProps } from './fieldRenderers/types';

// Registry of available renderers
const rendererRegistry: Record<string, React.FC<FieldRendererProps>> = {
  // Default JSON renderer
  'json': ({ data }) => <JsonDisplay data={data} />,
  
  // Lab components renderer
  'labComponents': LabComponentsRenderer
};

/**
 * Get a renderer component by its type
 * @param rendererType The type of renderer to get
 * @returns The renderer component or the default JSON renderer if not found
 */
export const getRenderer = (rendererType?: string): React.FC<FieldRendererProps> => {
  if (!rendererType || !rendererRegistry[rendererType]) {
    return rendererRegistry['json'];
  }
  
  return rendererRegistry[rendererType];
};

/**
 * Register a new renderer
 * @param rendererType The type identifier for the renderer
 * @param component The renderer component
 */
export const registerRenderer = (
  rendererType: string, 
  component: React.FC<FieldRendererProps>
): void => {
  rendererRegistry[rendererType] = component;
};
