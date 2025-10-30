'use client';

import { useState, useEffect } from 'react';
import { useFhevm } from '@fhevm/universal-sdk';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

/**
 * Key Manager Component
 * Displays and manages FHEVM public keys
 */
export const KeyManager: React.FC = () => {
  const { instance, ready } = useFhevm();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (ready && instance) {
      try {
        const key = instance.getPublicKey();
        setPublicKey(key);
      } catch (error) {
        console.error('Failed to get public key:', error);
      }
    }
  }, [ready, instance]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh the public key
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (instance) {
        const key = instance.getPublicKey();
        setPublicKey(key);
      }
    } catch (error) {
      console.error('Failed to refresh key:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Management</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          View and manage FHEVM public keys
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ready && publicKey ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                Public Key
              </h4>
              <div className="break-all text-xs font-mono text-gray-600 max-h-32 overflow-y-auto">
                {publicKey.substring(0, 200)}...
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm py-4 text-center">
              {ready ? 'No public key available' : 'Initializing...'}
            </div>
          )}

          <Button
            onClick={handleRefresh}
            loading={refreshing}
            disabled={!ready}
            variant="outline"
            className="w-full"
          >
            Refresh Key
          </Button>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Public keys are used to encrypt data before
              sending to the blockchain. They are automatically managed by the SDK.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
