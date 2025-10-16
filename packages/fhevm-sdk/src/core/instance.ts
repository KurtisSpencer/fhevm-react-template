/**
 * FHEVM Instance Management
 * Framework-independent core for creating and managing FHEVM instances
 */

import { createInstance, FhevmInstance, initFhevm } from 'fhevmjs';

export interface FhevmConfig {
  network?: 'sepolia' | 'localhost' | string;
  gatewayUrl?: string;
  publicKey?: string;
  kmsContractAddress?: string;
  aclContractAddress?: string;
}

export interface FhevmInstanceState {
  instance: FhevmInstance | null;
  ready: boolean;
  error: Error | null;
}

/**
 * Create a new FHEVM instance
 * @param config - FHEVM configuration options
 * @returns FHEVM instance
 */
export async function createFhevmInstance(config: FhevmConfig = {}): Promise<FhevmInstance> {
  try {
    // Initialize fhevmjs library
    await initFhevm();

    // Network-specific defaults
    const networkDefaults = getNetworkDefaults(config.network || 'sepolia');

    // Create instance with merged config
    const instance = await createInstance({
      kmsContractAddress: config.kmsContractAddress || networkDefaults.kmsContractAddress,
      aclContractAddress: config.aclContractAddress || networkDefaults.aclContractAddress,
      gatewayUrl: config.gatewayUrl || networkDefaults.gatewayUrl,
      publicKey: config.publicKey,
    });

    return instance;
  } catch (error) {
    throw new Error(`Failed to create FHEVM instance: ${(error as Error).message}`);
  }
}

/**
 * Get network-specific default configuration
 * @param network - Network name
 * @returns Network configuration
 */
function getNetworkDefaults(network: string): Required<Omit<FhevmConfig, 'network' | 'publicKey'>> {
  const defaults: Record<string, Required<Omit<FhevmConfig, 'network' | 'publicKey'>>> = {
    sepolia: {
      gatewayUrl: 'https://gateway.sepolia.zama.ai',
      kmsContractAddress: '0x9D6891A6240D6130c54ae243d8005063D05fE14b',
      aclContractAddress: '0xFee8407e2f5e3Ee68ad77cAE98c434e637f516e5',
    },
    localhost: {
      gatewayUrl: 'http://localhost:8545',
      kmsContractAddress: '0x0000000000000000000000000000000000000000',
      aclContractAddress: '0x0000000000000000000000000000000000000000',
    },
  };

  return defaults[network] || defaults.sepolia;
}

/**
 * Check if FHEVM instance is ready
 * @param instance - FHEVM instance to check
 * @returns True if instance is ready
 */
export function isInstanceReady(instance: FhevmInstance | null): boolean {
  return instance !== null && instance.hasKeypair();
}

/**
 * Get instance public key
 * @param instance - FHEVM instance
 * @returns Public key as hex string
 */
export function getPublicKey(instance: FhevmInstance): string {
  if (!instance.hasKeypair()) {
    throw new Error('Instance does not have a keypair');
  }
  return instance.getPublicKey();
}
