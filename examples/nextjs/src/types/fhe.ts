/**
 * FHE Type Definitions for Next.js Example
 */

export type { FHEDataType, EncryptionResult, DecryptionResult, FHEConfig } from '../lib/fhe/types';

export interface FHEState {
  ready: boolean;
  loading: boolean;
  error: Error | null;
}

export interface EncryptionState {
  encrypting: boolean;
  error: string | null;
  result: EncryptionResult | null;
}

export interface DecryptionState {
  decrypting: boolean;
  error: string | null;
  result: DecryptionResult | null;
}
