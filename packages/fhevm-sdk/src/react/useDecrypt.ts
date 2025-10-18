/**
 * useDecrypt Hook
 * React hook for decrypting FHEVM encrypted values
 */

import { useState, useCallback } from 'react';
import { useFhevm } from './useFhevm';
import {
  decryptValue,
  decryptBatch,
  DecryptOptions,
  DecryptResult,
} from '../core/decrypt';

export interface UseDecryptResult {
  decrypt: (handle: bigint | string, options: DecryptOptions) => Promise<DecryptResult>;
  decryptMultiple: (
    handles: Array<bigint | string>,
    options: DecryptOptions
  ) => Promise<DecryptResult[]>;
  decrypting: boolean;
  error: Error | null;
  lastDecrypted: DecryptResult | null;
}

/**
 * Hook for decrypting values
 * @returns Decryption functions and state
 */
export function useDecrypt(): UseDecryptResult {
  const { instance, ready } = useFhevm();
  const [decrypting, setDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastDecrypted, setLastDecrypted] = useState<DecryptResult | null>(null);

  const decrypt = useCallback(
    async (handle: bigint | string, options: DecryptOptions): Promise<DecryptResult> => {
      if (!instance || !ready) {
        throw new Error('FHEVM instance not ready. Wait for initialization.');
      }

      try {
        setDecrypting(true);
        setError(null);

        const decrypted = await decryptValue(instance, handle, options);
        setLastDecrypted(decrypted);

        return decrypted;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setDecrypting(false);
      }
    },
    [instance, ready]
  );

  const decryptMultiple = useCallback(
    async (
      handles: Array<bigint | string>,
      options: DecryptOptions
    ): Promise<DecryptResult[]> => {
      if (!instance || !ready) {
        throw new Error('FHEVM instance not ready. Wait for initialization.');
      }

      try {
        setDecrypting(true);
        setError(null);

        const decrypted = await decryptBatch(instance, handles, options);
        if (decrypted.length > 0) {
          setLastDecrypted(decrypted[decrypted.length - 1]);
        }

        return decrypted;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setDecrypting(false);
      }
    },
    [instance, ready]
  );

  return {
    decrypt,
    decryptMultiple,
    decrypting,
    error,
    lastDecrypted,
  };
}
