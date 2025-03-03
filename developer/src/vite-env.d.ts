/// <reference types="vite/client" />

import { ReactNode } from 'react';

// Fix for FC type compatibility issues
declare module 'react' {
  interface FunctionComponent<P = Record<string, unknown>> {
    (props: P, context?: unknown): ReactNode;
  }
  
  interface FC<P = Record<string, unknown>> {
    (props: P, context?: unknown): ReactNode;
  }
}
