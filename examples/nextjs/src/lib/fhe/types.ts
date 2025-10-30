/**
 * FHE Type Definitions
 * TypeScript types for FHE operations
 */

export type FHEDataType =
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'int8'
  | 'int16'
  | 'int32'
  | 'int64'
  | 'int128'
  | 'int256'
  | 'bool'
  | 'address';

export interface EncryptionResult {
  handles: string[];
  inputProof: string;
}

export interface DecryptionResult {
  value: bigint | number | boolean;
  type: FHEDataType;
}

export interface FHEConfig {
  network: string;
  gatewayUrl: string;
  contractAddress?: string;
}

export interface FHEOperation {
  type: 'add' | 'sub' | 'mul' | 'div' | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';
  operands: string[];
}

export interface ContractInteraction {
  contractAddress: string;
  functionName: string;
  args: any[];
  encryptedArgs?: EncryptionResult[];
}

export interface KeyPair {
  publicKey: string;
  privateKey?: string; // Usually not exposed in client-side
}

export interface FHEError {
  code: string;
  message: string;
  details?: any;
}
