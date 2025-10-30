/**
 * Validation Utilities
 * Helper functions for data validation
 */

import type { FHEDataType } from '../fhe/types';

/**
 * Validate FHE data type
 */
export function isValidFHEType(type: string): type is FHEDataType {
  const validTypes: FHEDataType[] = [
    'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
    'int8', 'int16', 'int32', 'int64', 'int128', 'int256',
    'bool', 'address',
  ];
  return validTypes.includes(type as FHEDataType);
}

/**
 * Validate value for specific FHE type
 */
export function isValidValueForType(value: any, type: FHEDataType): boolean {
  switch (type) {
    case 'bool':
      return typeof value === 'boolean';

    case 'address':
      return /^0x[a-fA-F0-9]{40}$/.test(value);

    case 'uint8':
      return Number.isInteger(value) && value >= 0 && value <= 255;

    case 'uint16':
      return Number.isInteger(value) && value >= 0 && value <= 65535;

    case 'uint32':
      return Number.isInteger(value) && value >= 0 && value <= 4294967295;

    case 'uint64':
      return (
        (typeof value === 'number' || typeof value === 'bigint') &&
        BigInt(value) >= 0n &&
        BigInt(value) <= 18446744073709551615n
      );

    default:
      return typeof value === 'number' || typeof value === 'bigint';
  }
}

/**
 * Validate encryption parameters
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEncryptionParams(
  value: any,
  type: string
): ValidationResult {
  if (value === undefined || value === null) {
    return { valid: false, error: 'Value is required' };
  }

  if (!isValidFHEType(type)) {
    return { valid: false, error: `Invalid FHE type: ${type}` };
  }

  if (!isValidValueForType(value, type)) {
    return {
      valid: false,
      error: `Value ${value} is not valid for type ${type}`,
    };
  }

  return { valid: true };
}

/**
 * Validate network configuration
 */
export function isValidNetwork(network: string): boolean {
  const validNetworks = ['sepolia', 'mainnet', 'localhost'];
  return validNetworks.includes(network.toLowerCase());
}

/**
 * Validate gateway URL
 */
export function isValidGatewayUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Sanitize and validate contract address
 */
export function validateContractAddress(address: string): ValidationResult {
  if (!address) {
    return { valid: false, error: 'Contract address is required' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: false, error: 'Invalid Ethereum address format' };
  }

  return { valid: true };
}
