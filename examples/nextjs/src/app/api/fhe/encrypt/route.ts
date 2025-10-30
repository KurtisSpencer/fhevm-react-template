import { NextRequest, NextResponse } from 'next/server';
import { createFhevmInstance, encryptValue } from '@fhevm/universal-sdk/core';

/**
 * Encryption API Route
 * Handles encryption of values using FHEVM
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, type = 'uint64', network = 'sepolia' } = body;

    if (value === undefined || value === null) {
      return NextResponse.json(
        { success: false, error: 'Value is required' },
        { status: 400 }
      );
    }

    // Initialize FHEVM instance
    const instance = await createFhevmInstance({
      network,
      gatewayUrl: 'https://gateway.sepolia.zama.ai',
    });

    // Encrypt the value
    const encrypted = await encryptValue(instance, value, type);

    return NextResponse.json({
      success: true,
      encrypted,
      originalValue: value,
      type,
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Encryption failed',
      },
      { status: 500 }
    );
  }
}
