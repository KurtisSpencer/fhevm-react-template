# Next.js Template for Universal FHEVM SDK

This template provides a starting point for building Next.js applications with the Universal FHEVM SDK.

## Quick Start

```bash
# Create a new project from this template
npx create-next-app my-fhe-app --typescript

# Install the Universal FHEVM SDK
cd my-fhe-app
npm install @fhevm/universal-sdk

# Copy the example structure
cp -r ../examples/nextjs/src ./
```

## Full Working Example

For a complete, production-ready example with all features, see:

**[Next.js Example →](../../examples/nextjs/)**

The example includes:
- Complete Next.js 14+ App Router setup
- API routes for server-side FHE operations
- Pre-built components (Encryption, Computation, Key Management)
- Real-world use cases (Banking, Medical)
- Custom hooks and utilities
- Full TypeScript support

## Minimal Setup

For a minimal setup, here's all you need:

### 1. Install Dependencies

```bash
npm install @fhevm/universal-sdk ethers
```

### 2. Create Your Component

```typescript
// app/page.tsx
'use client';

import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/universal-sdk';

export default function Home() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <EncryptDemo />
    </FhevmProvider>
  );
}

function EncryptDemo() {
  const { ready } = useFhevm();
  const { encrypt } = useEncrypt();

  const handleEncrypt = async () => {
    const result = await encrypt(42, 'uint64');
    console.log('Encrypted:', result);
  };

  if (!ready) return <div>Loading FHEVM...</div>;

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

That's it! Less than 10 lines to get started.

## Learn More

- [Full Next.js Example](../../examples/nextjs/)
- [SDK Documentation](../../README.md)
- [API Reference](../../docs/API.md)
