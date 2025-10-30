/**
 * API Type Definitions
 * Types for Next.js API routes
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptAPIRequest {
  value: number | bigint;
  type?: string;
  network?: string;
}

export interface EncryptAPIResponse extends APIResponse {
  encrypted?: {
    handles: string[];
    inputProof: string;
  };
  originalValue?: number | bigint;
  type?: string;
}

export interface DecryptAPIRequest {
  encryptedData: any;
  contractAddress: string;
  account: string;
  network?: string;
}

export interface DecryptAPIResponse extends APIResponse {
  decrypted?: any;
}

export interface ComputeAPIRequest {
  operation: string;
  operands: any[];
  contractAddress?: string;
}

export interface ComputeAPIResponse extends APIResponse {
  operation?: string;
  operandCount?: number;
  note?: string;
}

export interface KeysAPIResponse extends APIResponse {
  publicKey?: string;
  network?: string;
}
