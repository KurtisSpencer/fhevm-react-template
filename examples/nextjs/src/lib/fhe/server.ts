import { createFhevmInstance, encryptValue, decryptValue } from '@fhevm/universal-sdk/core';

/**
 * Server-side FHE Operations
 * Utilities for FHE operations in Next.js API routes
 */

/**
 * Initialize FHEVM for server-side use
 */
export async function initFhevmServer(config: {
  network?: string;
  gatewayUrl?: string;
}) {
  return createFhevmInstance({
    network: config.network || 'sepolia',
    gatewayUrl: config.gatewayUrl || 'https://gateway.sepolia.zama.ai',
  });
}

/**
 * Encrypt value on server
 */
export async function serverEncrypt(
  value: number | bigint,
  type: string = 'uint64',
  config?: { network?: string; gatewayUrl?: string }
) {
  const instance = await initFhevmServer(config || {});
  return encryptValue(instance, value, type);
}

/**
 * Decrypt value on server
 */
export async function serverDecrypt(
  encryptedData: any,
  contractAddress: string,
  account: string,
  config?: { network?: string; gatewayUrl?: string }
) {
  const instance = await initFhevmServer(config || {});
  return decryptValue(instance, encryptedData, contractAddress, account);
}

/**
 * Get public key on server
 */
export async function getServerPublicKey(config?: {
  network?: string;
  gatewayUrl?: string;
}) {
  const instance = await initFhevmServer(config || {});
  return instance.getPublicKey();
}
