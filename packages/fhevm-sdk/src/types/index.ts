// Type definitions for FHEVM SDK

export interface FhevmConfig {
  network?: string;
  gatewayUrl?: string;
  aclAddress?: string;
  chainId?: number;
}

export interface FhevmInstance {
  createEncryptedInput(
    contractAddress: string,
    userAddress: string
  ): EncryptedInput;
  getPublicKey(contractAddress: string): Promise<string>;
  hasKeypair(contractAddress: string): Promise<boolean>;
  generateKeypair(): Promise<void>;
  createEIP712(
    verifyingContract: string,
    functionName: string
  ): EIP712;
}

export interface EncryptedInput {
  add8(value: number): EncryptedInput;
  add16(value: number): EncryptedInput;
  add32(value: number): EncryptedInput;
  add64(value: bigint | number): EncryptedInput;
  add128(value: bigint): EncryptedInput;
  addAddress(address: string): EncryptedInput;
  addBool(value: boolean): EncryptedInput;
  encrypt(): EncryptedData;
}

export interface EncryptedData {
  handles: string[];
  inputProof: string;
}

export interface EIP712 {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  types: Record<string, Array<{ name: string; type: string }>>;
  message: Record<string, unknown>;
}

export interface DecryptionResult {
  value: bigint | number | boolean | string;
  success: boolean;
}

export type EncryptionType =
  | "uint8"
  | "uint16"
  | "uint32"
  | "uint64"
  | "uint128"
  | "address"
  | "bool";

export interface EncryptOptions {
  type: EncryptionType;
  contractAddress: string;
  userAddress: string;
}

export interface DecryptOptions {
  contractAddress: string;
  userAddress: string;
}
