/**
 * DecryptOutput Component
 * Reusable component for decrypting and displaying values
 */

import React, { useState, useEffect } from 'react';
import { useDecrypt } from '../react/useDecrypt';

export interface DecryptOutputProps {
  handle: bigint | string;
  contractAddress: string;
  userAddress: string;
  gatewayUrl?: string;
  label?: string;
  autoDecrypt?: boolean;
  className?: string;
  onDecrypt?: (value: bigint | boolean | string) => void;
  onError?: (error: Error) => void;
  renderValue?: (value: bigint | boolean | string) => React.ReactNode;
}

/**
 * DecryptOutput Component
 * Pre-built component for decrypting and displaying encrypted values
 */
export function DecryptOutput({
  handle,
  contractAddress,
  userAddress,
  gatewayUrl,
  label,
  autoDecrypt = false,
  className = '',
  onDecrypt,
  onError,
  renderValue,
}: DecryptOutputProps) {
  const [decryptedValue, setDecryptedValue] = useState<bigint | boolean | string | null>(null);
  const { decrypt, decrypting, error } = useDecrypt();

  const handleDecrypt = async () => {
    try {
      const result = await decrypt(handle, {
        contractAddress,
        userAddress,
        gatewayUrl,
      });

      setDecryptedValue(result.value);

      if (onDecrypt) {
        onDecrypt(result.value);
      }
    } catch (err) {
      if (onError) {
        onError(err as Error);
      }
    }
  };

  // Auto-decrypt on mount if enabled
  useEffect(() => {
    if (autoDecrypt && handle && contractAddress && userAddress) {
      handleDecrypt();
    }
  }, [autoDecrypt, handle, contractAddress, userAddress]);

  return (
    <div className={className}>
      {label && <label style={{ display: 'block', marginBottom: '8px' }}>{label}</label>}

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {!autoDecrypt && (
          <button
            onClick={handleDecrypt}
            disabled={decrypting}
            style={{
              padding: '8px 16px',
              backgroundColor: decrypting ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: decrypting ? 'not-allowed' : 'pointer',
            }}
          >
            {decrypting ? 'Decrypting...' : 'Decrypt'}
          </button>
        )}

        {decrypting && autoDecrypt && (
          <div style={{ padding: '8px', color: '#666' }}>Decrypting...</div>
        )}

        {decryptedValue !== null && (
          <div
            style={{
              padding: '8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              flex: 1,
            }}
          >
            {renderValue ? renderValue(decryptedValue) : String(decryptedValue)}
          </div>
        )}
      </div>

      {error && (
        <div style={{ marginTop: '8px', color: 'red', fontSize: '14px' }}>
          Error: {error.message}
        </div>
      )}
    </div>
  );
}
