import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance } from '@fhevm/universal-sdk/core';

/**
 * Key Management API Route
 * Handles public key retrieval and key operations
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network') || 'sepolia';

    // Initialize FHEVM instance
    const instance = await createFhevmInstance({
      network,
      gatewayUrl: 'https://gateway.sepolia.zama.ai',
    });

    return NextResponse.json({
      success: true,
      publicKey: instance.getPublicKey(),
      network,
    });
  } catch (error) {
    console.error('Key retrieval error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get keys',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, network = 'sepolia' } = body;

    const instance = await createFhevmInstance({
      network,
      gatewayUrl: 'https://gateway.sepolia.zama.ai',
    });

    switch (operation) {
      case 'getPublicKey':
        return NextResponse.json({
          success: true,
          publicKey: instance.getPublicKey(),
        });

      case 'refresh':
        // Refresh keys (create new instance)
        const newInstance = await createFhevmInstance({
          network,
          gatewayUrl: 'https://gateway.sepolia.zama.ai',
        });
        return NextResponse.json({
          success: true,
          publicKey: newInstance.getPublicKey(),
          message: 'Keys refreshed',
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown operation' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Key operation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Key operation failed',
      },
      { status: 500 }
    );
  }
}
