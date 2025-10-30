/**
 * Universal FHEVM SDK
 * All-in-one package for building confidential frontends
 */

// Core exports (framework-independent)
export * from './core';

// React exports
export * from './react';
export * from './components';

// Types
export * from './types';

// Utilities
export * from './utils';

// Framework adapters
export * from './adapters';

// Re-export commonly used types from fhevmjs
export type { FhevmInstance } from 'fhevmjs';
