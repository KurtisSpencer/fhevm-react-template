import { createFhevmInstance, encryptValue } from '@fhevm/universal-sdk/core';
import type { FhevmInstance, EncryptedValue } from '@fhevm/universal-sdk/core';

/**
 * Client-side FHE Operations
 * Utilities for FHE operations in the browser
 */

export class FHEClient {
  private instance: FhevmInstance | null = null;
  private initPromise: Promise<void> | null = null;

  constructor(
    private config: {
      network: string;
      gatewayUrl: string;
    }
  ) {}

  /**
   * Initialize the FHEVM instance
   */
  async init(): Promise<void> {
    if (this.instance) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      this.instance = await createFhevmInstance(this.config);
    })();

    await this.initPromise;
  }

  /**
   * Get the FHEVM instance
   */
  getInstance(): FhevmInstance {
    if (!this.instance) {
      throw new Error('FHE instance not initialized. Call init() first.');
    }
    return this.instance;
  }

  /**
   * Encrypt a value
   */
  async encrypt(
    value: number | bigint,
    type: string = 'uint64'
  ): Promise<EncryptedValue> {
    await this.init();
    return encryptValue(this.getInstance(), value, type);
  }

  /**
   * Get public key
   */
  getPublicKey(): string {
    return this.getInstance().getPublicKey();
  }

  /**
   * Check if initialized
   */
  isReady(): boolean {
    return this.instance !== null;
  }
}

/**
 * Create a singleton FHE client
 */
let fheClient: FHEClient | null = null;

export function getFHEClient(config?: {
  network?: string;
  gatewayUrl?: string;
}): FHEClient {
  if (!fheClient) {
    fheClient = new FHEClient({
      network: config?.network || 'sepolia',
      gatewayUrl: config?.gatewayUrl || 'https://gateway.sepolia.zama.ai',
    });
  }
  return fheClient;
}
