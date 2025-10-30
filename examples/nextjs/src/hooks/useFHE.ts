'use client';

import { useFhevm } from '@fhevm/universal-sdk';

/**
 * Custom FHE Hook
 * Re-exports the SDK hook with additional utilities
 */
export function useFHE() {
  const fhevm = useFhevm();

  return {
    ...fhevm,
    isInitialized: fhevm.ready,
    isLoading: fhevm.loading,
    hasError: !!fhevm.error,
  };
}
