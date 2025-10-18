/**
 * Encryption Utilities
 * Framework-independent encryption functions for FHEVM
 */

import { FhevmInstance } from 'fhevmjs';

export type EncryptionType =
  | 'bool'
  | 'uint4'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'address'
  | 'bytes'
  | 'bytes256';

export interface EncryptedValue {
  data: Uint8Array;
  handles: string[];
  inputProof: string;
}

export interface EncryptOptions {
  type?: EncryptionType;
  contractAddress?: string;
  userAddress?: string;
}

/**
 * Encrypt a value using FHEVM instance
 * @param instance - FHEVM instance
 * @param value - Value to encrypt
 * @param type - Encryption type (default: 'uint64')
 * @returns Encrypted value with handles and proof
 */
export async function encryptValue(
  instance: FhevmInstance,
  value: number | boolean | bigint | string | Uint8Array,
  type: EncryptionType = 'uint64'
): Promise<EncryptedValue> {
  try {
    if (!instance.hasKeypair()) {
      throw new Error('Instance does not have a keypair. Initialize instance first.');
    }

    // Convert value based on type
    const numericValue = convertToNumeric(value, type);

    // Encrypt based on type
    const encrypted = await encryptByType(instance, numericValue, type);

    return {
      data: encrypted.data,
      handles: encrypted.handles || [],
      inputProof: encrypted.inputProof || '',
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${(error as Error).message}`);
  }
}

/**
 * Encrypt multiple values at once
 * @param instance - FHEVM instance
 * @param values - Array of values with their types
 * @returns Array of encrypted values
 */
export async function encryptBatch(
  instance: FhevmInstance,
  values: Array<{ value: number | boolean | bigint; type: EncryptionType }>
): Promise<EncryptedValue[]> {
  const results: EncryptedValue[] = [];

  for (const { value, type } of values) {
    const encrypted = await encryptValue(instance, value, type);
    results.push(encrypted);
  }

  return results;
}

/**
 * Create encrypted input for contract interaction
 * @param instance - FHEVM instance
 * @param contractAddress - Contract address
 * @param userAddress - User address
 * @returns Encrypted input object
 */
export function createEncryptedInput(
  instance: FhevmInstance,
  contractAddress: string,
  userAddress: string
) {
  if (!instance.createEncryptedInput) {
    throw new Error('Instance does not support createEncryptedInput');
  }

  return instance.createEncryptedInput(contractAddress, userAddress);
}

/**
 * Convert value to numeric based on type
 */
function convertToNumeric(
  value: number | boolean | bigint | string | Uint8Array,
  type: EncryptionType
): number | bigint | boolean | Uint8Array {
  if (type === 'bool') {
    return Boolean(value);
  }

  if (type === 'address') {
    return value as string;
  }

  if (type === 'bytes' || type === 'bytes256') {
    if (value instanceof Uint8Array) {
      return value;
    }
    if (typeof value === 'string') {
      return new TextEncoder().encode(value);
    }
    throw new Error('Bytes type requires Uint8Array or string');
  }

  if (typeof value === 'bigint') {
    return value;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return BigInt(value);
  }

  throw new Error(`Cannot convert ${typeof value} to numeric for type ${type}`);
}

/**
 * Encrypt value based on specific type
 */
async function encryptByType(
  instance: FhevmInstance,
  value: number | bigint | boolean | string | Uint8Array,
  type: EncryptionType
): Promise<any> {
  const encryptMethods: Record<EncryptionType, string> = {
    bool: 'encrypt_bool',
    uint4: 'encrypt_uint4',
    uint8: 'encrypt_uint8',
    uint16: 'encrypt_uint16',
    uint32: 'encrypt_uint32',
    uint64: 'encrypt_uint64',
    uint128: 'encrypt_uint128',
    uint256: 'encrypt_uint256',
    address: 'encrypt_address',
    bytes: 'encrypt_bytes',
    bytes256: 'encrypt_bytes256',
  };

  const method = encryptMethods[type];
  if (!method || !(instance as any)[method]) {
    throw new Error(`Encryption method for type ${type} not found`);
  }

  return (instance as any)[method](value);
}

/**
 * Generate encryption proof for contract
 * @param instance - FHEVM instance
 * @param encryptedValue - Encrypted value
 * @returns Proof string
 */
export function generateProof(instance: FhevmInstance, encryptedValue: EncryptedValue): string {
  return encryptedValue.inputProof || '';
}

/**
 * Validate encrypted value
 * @param encryptedValue - Encrypted value to validate
 * @returns True if valid
 */
export function isValidEncrypted(encryptedValue: EncryptedValue): boolean {
  return (
    encryptedValue.data instanceof Uint8Array &&
    encryptedValue.data.length > 0 &&
    Array.isArray(encryptedValue.handles)
  );
}
