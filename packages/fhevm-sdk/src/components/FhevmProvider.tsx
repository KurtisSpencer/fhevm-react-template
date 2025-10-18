/**
 * FhevmProvider Component
 * React context provider for FHEVM instance
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { FhevmInstance } from 'fhevmjs';
import { useFhevm } from '../react/useFhevm';
import { FhevmConfig } from '../core/instance';

export interface FhevmContextValue {
  instance: FhevmInstance | null;
  ready: boolean;
  error: Error | null;
  loading: boolean;
  reinitialize: () => Promise<void>;
}

const FhevmContext = createContext<FhevmContextValue | undefined>(undefined);

export interface FhevmProviderProps {
  children: ReactNode;
  config?: FhevmConfig;
  loadingComponent?: ReactNode;
  errorComponent?: (error: Error) => ReactNode;
}

/**
 * FHEVM Provider Component
 * Wraps your app to provide FHEVM instance to all child components
 */
export function FhevmProvider({
  children,
  config = {},
  loadingComponent,
  errorComponent,
}: FhevmProviderProps) {
  const fhevmState = useFhevm(config);

  // Show loading component while initializing
  if (fhevmState.loading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  // Show error component if initialization failed
  if (fhevmState.error && errorComponent) {
    return <>{errorComponent(fhevmState.error)}</>;
  }

  return <FhevmContext.Provider value={fhevmState}>{children}</FhevmContext.Provider>;
}

/**
 * Hook to access FHEVM context
 * @returns FHEVM context value
 */
export function useFhevmContext(): FhevmContextValue {
  const context = useContext(FhevmContext);
  if (context === undefined) {
    throw new Error('useFhevmContext must be used within a FhevmProvider');
  }
  return context;
}

/**
 * Default loading component
 */
export function DefaultLoadingComponent() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Initializing FHEVM...</p>
    </div>
  );
}

/**
 * Default error component
 */
export function DefaultErrorComponent({ error }: { error: Error }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
      <p>Error initializing FHEVM: {error.message}</p>
    </div>
  );
}
