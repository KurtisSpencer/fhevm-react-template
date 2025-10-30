/**
 * Key Management Utilities
 * Helper functions for managing FHE keys
 */

/**
 * Store public key in local storage
 */
export function storePublicKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fhe_public_key', key);
  }
}

/**
 * Retrieve public key from local storage
 */
export function getStoredPublicKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fhe_public_key');
  }
  return null;
}

/**
 * Clear stored public key
 */
export function clearStoredPublicKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fhe_public_key');
  }
}

/**
 * Validate public key format
 */
export function isValidPublicKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;

  // Basic validation - check if it's a non-empty string
  // You can add more sophisticated validation based on your key format
  return key.length > 0;
}

/**
 * Get key metadata
 */
export function getKeyMetadata(key: string): {
  length: number;
  preview: string;
} {
  return {
    length: key.length,
    preview: key.substring(0, 20) + '...',
  };
}
