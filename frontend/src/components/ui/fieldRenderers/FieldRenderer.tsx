import React from 'react';
import { FieldRendererProps } from './types';
import { getRenderer } from '../rendererRegistry';

/**
 * Field renderer component that uses the registry to render fields
 */
export const FieldRenderer: React.FC<FieldRendererProps> = (props) => {
  const { fieldMeta } = props;
  const rendererType = fieldMeta?.rendererType ?? (fieldMeta?.type === 'json' ? 'json' : undefined);
  const Renderer = getRenderer(rendererType);
  
  return <Renderer {...props} />;
};
