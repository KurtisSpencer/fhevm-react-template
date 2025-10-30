'use client';

import { useState, useCallback } from 'react';
import { useEncrypt } from '@fhevm/universal-sdk';
import { validateEncryptionParams } from '../lib/utils/validation';

/**
 * Custom Encryption Hook
 * Provides encryption functionality with validation
 */
export function useEncryption() {
  const { encrypt: sdkEncrypt, encrypting } = useEncrypt();
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(
    async (value: any, type: string = 'uint64') => {
      setError(null);

      // Validate parameters
      const validation = validateEncryptionParams(value, type);
      if (!validation.valid) {
        setError(validation.error || 'Validation failed');
        throw new Error(validation.error);
      }

      try {
        const result = await sdkEncrypt(value, type);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMsg);
        throw err;
      }
    },
    [sdkEncrypt]
  );

  return {
    encrypt,
    encrypting,
    error,
  };
}
