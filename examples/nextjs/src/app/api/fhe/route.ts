import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance } from '@fhevm/universal-sdk/core';

/**
 * FHE Operations API Route
 * Handles general FHEVM operations
 */
export async function GET(request: NextRequest) {
  try {
    const instance = await createFhevmInstance({
      network: 'sepolia',
      gatewayUrl: 'https://gateway.sepolia.zama.ai',
    });

    return NextResponse.json({
      success: true,
      message: 'FHEVM instance ready',
      publicKey: instance.getPublicKey(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, data } = body;

    // Handle different FHE operations
    switch (operation) {
      case 'init':
        const instance = await createFhevmInstance({
          network: body.network || 'sepolia',
          gatewayUrl: body.gatewayUrl || 'https://gateway.sepolia.zama.ai',
        });
        return NextResponse.json({
          success: true,
          publicKey: instance.getPublicKey(),
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown operation' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
