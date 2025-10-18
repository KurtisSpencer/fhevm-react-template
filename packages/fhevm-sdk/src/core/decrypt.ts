/**
 * Decryption Utilities
 * Framework-independent decryption functions for FHEVM with EIP-712 signatures
 */

import { FhevmInstance } from 'fhevmjs';
import { ethers } from 'ethers';

export interface DecryptOptions {
  contractAddress: string;
  userAddress: string;
  gatewayUrl?: string;
}

export interface DecryptResult {
  value: bigint | boolean | string;
  raw: any;
}

export interface EIP712Signature {
  signature: string;
  publicKey: string;
}

/**
 * Decrypt a value from FHEVM
 * @param instance - FHEVM instance
 * @param handle - Encrypted handle
 * @param options - Decryption options
 * @returns Decrypted value
 */
export async function decryptValue(
  instance: FhevmInstance,
  handle: bigint | string,
  options: DecryptOptions
): Promise<DecryptResult> {
  try {
    if (!instance.hasKeypair()) {
      throw new Error('Instance does not have a keypair');
    }

    // Convert handle to bigint if string
    const handleBigInt = typeof handle === 'string' ? BigInt(handle) : handle;

    // Create reencryption request
    const { publicKey, signature } = await generateReencryptSignature(
      instance,
      handleBigInt,
      options.contractAddress,
      options.userAddress
    );

    // Request decryption from gateway
    const decryptedValue = await requestDecryption(
      handleBigInt,
      publicKey,
      signature,
      options.contractAddress,
      options.gatewayUrl || 'https://gateway.sepolia.zama.ai'
    );

    return {
      value: decryptedValue,
      raw: decryptedValue,
    };
  } catch (error) {
    throw new Error(`Decryption failed: ${(error as Error).message}`);
  }
}

/**
 * Decrypt multiple values at once
 * @param instance - FHEVM instance
 * @param handles - Array of encrypted handles
 * @param options - Decryption options
 * @returns Array of decrypted values
 */
export async function decryptBatch(
  instance: FhevmInstance,
  handles: Array<bigint | string>,
  options: DecryptOptions
): Promise<DecryptResult[]> {
  const results: DecryptResult[] = [];

  for (const handle of handles) {
    const decrypted = await decryptValue(instance, handle, options);
    results.push(decrypted);
  }

  return results;
}

/**
 * Generate EIP-712 signature for reencryption
 * @param instance - FHEVM instance
 * @param handle - Encrypted handle
 * @param contractAddress - Contract address
 * @param userAddress - User address
 * @returns Signature and public key
 */
export async function generateReencryptSignature(
  instance: FhevmInstance,
  handle: bigint,
  contractAddress: string,
  userAddress: string
): Promise<EIP712Signature> {
  try {
    const publicKey = instance.getPublicKey();

    // EIP-712 domain
    const domain = {
      name: 'Authorization token',
      version: '1',
      chainId: 11155111, // Sepolia
      verifyingContract: contractAddress,
    };

    // EIP-712 types
    const types = {
      Reencrypt: [
        { name: 'publicKey', type: 'bytes' },
        { name: 'handle', type: 'uint256' },
      ],
    };

    // Message
    const message = {
      publicKey: publicKey,
      handle: handle.toString(),
    };

    // Sign using EIP-712
    const signature = await signEIP712(domain, types, message, userAddress);

    return {
      signature,
      publicKey,
    };
  } catch (error) {
    throw new Error(`Failed to generate reencryption signature: ${(error as Error).message}`);
  }
}

/**
 * Sign EIP-712 typed data
 * @param domain - EIP-712 domain
 * @param types - EIP-712 types
 * @param message - Message to sign
 * @param userAddress - User address
 * @returns Signature
 */
async function signEIP712(
  domain: any,
  types: any,
  message: any,
  userAddress: string
): Promise<string> {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    // Browser environment with MetaMask
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();

    const signature = await signer.signTypedData(domain, types, message);
    return signature;
  } else {
    throw new Error('No Ethereum provider found. Install MetaMask or provide a signer.');
  }
}

/**
 * Request decryption from gateway
 * @param handle - Encrypted handle
 * @param publicKey - Public key
 * @param signature - EIP-712 signature
 * @param contractAddress - Contract address
 * @param gatewayUrl - Gateway URL
 * @returns Decrypted value
 */
async function requestDecryption(
  handle: bigint,
  publicKey: string,
  signature: string,
  contractAddress: string,
  gatewayUrl: string
): Promise<bigint> {
  const response = await fetch(`${gatewayUrl}/reencrypt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      handle: handle.toString(),
      publicKey,
      signature,
      contractAddress,
    }),
  });

  if (!response.ok) {
    throw new Error(`Gateway request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return BigInt(data.value);
}

/**
 * Create reencryption permit for contract
 * @param instance - FHEVM instance
 * @param contractAddress - Contract address
 * @param userAddress - User address
 * @param signer - Ethers signer
 * @returns Permit signature
 */
export async function createReencryptionPermit(
  instance: FhevmInstance,
  contractAddress: string,
  userAddress: string,
  signer: ethers.Signer
): Promise<string> {
  const publicKey = instance.getPublicKey();

  const domain = {
    name: 'Authorization token',
    version: '1',
    chainId: await signer.provider?.getNetwork().then((n) => Number(n.chainId)),
    verifyingContract: contractAddress,
  };

  const types = {
    Permit: [
      { name: 'publicKey', type: 'bytes' },
      { name: 'owner', type: 'address' },
    ],
  };

  const message = {
    publicKey,
    owner: userAddress,
  };

  const signature = await signer.signTypedData(domain, types, message);
  return signature;
}

/**
 * Verify decryption signature
 * @param signature - Signature to verify
 * @param publicKey - Public key
 * @param expectedAddress - Expected signer address
 * @returns True if valid
 */
export async function verifyDecryptSignature(
  signature: string,
  publicKey: string,
  expectedAddress: string
): Promise<boolean> {
  try {
    const recoveredAddress = ethers.verifyMessage(publicKey, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    return false;
  }
}
