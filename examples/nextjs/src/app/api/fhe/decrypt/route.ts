import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance, decryptValue } from '@fhevm/universal-sdk/core';

/**
 * Decryption API Route
 * Handles decryption of encrypted values using FHEVM
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      encryptedData,
      contractAddress,
      account,
      network = 'sepolia',
    } = body;

    if (!encryptedData || !contractAddress || !account) {
      return NextResponse.json(
        {
          success: false,
          error: 'encryptedData, contractAddress, and account are required',
        },
        { status: 400 }
      );
    }

    // Initialize FHEVM instance
    const instance = await createFhevmInstance({
      network,
      gatewayUrl: 'https://gateway.sepolia.zama.ai',
    });

    // Decrypt the value
    const decrypted = await decryptValue(
      instance,
      encryptedData,
      contractAddress,
      account
    );

    return NextResponse.json({
      success: true,
      decrypted,
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Decryption failed',
      },
      { status: 500 }
    );
  }
}
