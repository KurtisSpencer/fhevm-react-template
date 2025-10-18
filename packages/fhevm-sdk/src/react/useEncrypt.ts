/**
 * useEncrypt Hook
 * React hook for encrypting values with FHEVM
 */

import { useState, useCallback } from 'react';
import { useFhevm } from './useFhevm';
import {
  encryptValue,
  encryptBatch,
  EncryptionType,
  EncryptedValue,
} from '../core/encrypt';

export interface UseEncryptResult {
  encrypt: (value: number | boolean | bigint, type?: EncryptionType) => Promise<EncryptedValue>;
  encryptMultiple: (
    values: Array<{ value: number | boolean | bigint; type: EncryptionType }>
  ) => Promise<EncryptedValue[]>;
  encrypting: boolean;
  error: Error | null;
  lastEncrypted: EncryptedValue | null;
}

/**
 * Hook for encrypting values
 * @returns Encryption functions and state
 */
export function useEncrypt(): UseEncryptResult {
  const { instance, ready } = useFhevm();
  const [encrypting, setEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastEncrypted, setLastEncrypted] = useState<EncryptedValue | null>(null);

  const encrypt = useCallback(
    async (
      value: number | boolean | bigint,
      type: EncryptionType = 'uint64'
    ): Promise<EncryptedValue> => {
      if (!instance || !ready) {
        throw new Error('FHEVM instance not ready. Wait for initialization.');
      }

      try {
        setEncrypting(true);
        setError(null);

        const encrypted = await encryptValue(instance, value, type);
        setLastEncrypted(encrypted);

        return encrypted;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setEncrypting(false);
      }
    },
    [instance, ready]
  );

  const encryptMultiple = useCallback(
    async (
      values: Array<{ value: number | boolean | bigint; type: EncryptionType }>
    ): Promise<EncryptedValue[]> => {
      if (!instance || !ready) {
        throw new Error('FHEVM instance not ready. Wait for initialization.');
      }

      try {
        setEncrypting(true);
        setError(null);

        const encrypted = await encryptBatch(instance, values);
        if (encrypted.length > 0) {
          setLastEncrypted(encrypted[encrypted.length - 1]);
        }

        return encrypted;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setEncrypting(false);
      }
    },
    [instance, ready]
  );

  return {
    encrypt,
    encryptMultiple,
    encrypting,
    error,
    lastEncrypted,
  };
}
