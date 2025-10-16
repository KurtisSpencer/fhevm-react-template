/**
 * useFhevm Hook
 * React hook for FHEVM instance management
 */

import { useState, useEffect, useCallback } from 'react';
import { FhevmInstance } from 'fhevmjs';
import { createFhevmInstance, FhevmConfig, isInstanceReady } from '../core/instance';

export interface UseFhevmResult {
  instance: FhevmInstance | null;
  ready: boolean;
  error: Error | null;
  loading: boolean;
  reinitialize: () => Promise<void>;
}

/**
 * Hook for managing FHEVM instance
 * @param config - FHEVM configuration
 * @returns FHEVM instance state and controls
 */
export function useFhevm(config: FhevmConfig = {}): UseFhevmResult {
  const [instance, setInstance] = useState<FhevmInstance | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const newInstance = await createFhevmInstance(config);
      setInstance(newInstance);
      setReady(isInstanceReady(newInstance));
    } catch (err) {
      setError(err as Error);
      setReady(false);
      setInstance(null);
    } finally {
      setLoading(false);
    }
  }, [config.network, config.gatewayUrl, config.kmsContractAddress, config.aclContractAddress]);

  const reinitialize = useCallback(async () => {
    await initialize();
  }, [initialize]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    instance,
    ready,
    error,
    loading,
    reinitialize,
  };
}
