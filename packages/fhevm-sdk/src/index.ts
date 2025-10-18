/**
 * Universal FHEVM SDK
 * All-in-one package for building confidential frontends
 */

// Core exports (framework-independent)
export * from './core';

// React exports
export * from './react';
export * from './components';

// Re-export commonly used types from fhevmjs
export type { FhevmInstance } from 'fhevmjs';
