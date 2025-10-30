'use client';

import { FhevmProvider as SDKFhevmProvider } from '@fhevm/universal-sdk';
import type { ReactNode } from 'react';

export interface FHEProviderProps {
  children: ReactNode;
  network?: string;
  gatewayUrl?: string;
}

/**
 * FHE Provider Component
 * Wraps the application with FHEVM context
 */
export const FHEProvider: React.FC<FHEProviderProps> = ({
  children,
  network = 'sepolia',
  gatewayUrl = 'https://gateway.sepolia.zama.ai',
}) => {
  return (
    <SDKFhevmProvider
      config={{
        network,
        gatewayUrl,
      }}
    >
      {children}
    </SDKFhevmProvider>
  );
};
