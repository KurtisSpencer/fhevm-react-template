'use client';

import { useState } from 'react';
import { useFhevm, useEncrypt } from '@fhevm/universal-sdk';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

/**
 * Encryption Demo Component
 * Demonstrates encryption functionality using the SDK
 */
export const EncryptionDemo: React.FC = () => {
  const { ready, loading, error: fhevmError } = useFhevm();
  const { encrypt, encrypting } = useEncrypt();
  const [value, setValue] = useState<string>('');
  const [encryptedData, setEncryptedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEncrypt = async () => {
    if (!value) {
      setError('Please enter a value');
      return;
    }

    setError(null);
    try {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) {
        setError('Please enter a valid number');
        return;
      }

      const result = await encrypt(numValue, 'uint64');
      setEncryptedData(result.handles[0] || 'No handle returned');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="ml-3 text-gray-600">Initializing FHEVM...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (fhevmError) {
    return (
      <Card>
        <CardContent>
          <div className="text-red-600 py-4">
            <h3 className="font-semibold mb-2">Error</h3>
            <p>{fhevmError.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encrypt Your Data</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Enter a number to encrypt it using Fully Homomorphic Encryption
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="number"
            label="Value to encrypt"
            placeholder="Enter a number (e.g., 42)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={error || undefined}
            disabled={!ready}
          />

          <Button
            onClick={handleEncrypt}
            loading={encrypting}
            disabled={!ready || !value}
            className="w-full"
          >
            Encrypt Value
          </Button>

          {encryptedData && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">
                Encrypted Successfully
              </h4>
              <div className="break-all text-sm font-mono text-green-700">
                {encryptedData}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
