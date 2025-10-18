# Next.js Example - Universal FHEVM SDK

This example demonstrates how to integrate the Universal FHEVM SDK with Next.js 14.

## Features

- **< 10 Lines Setup** - Minimal configuration required
- **App Router** - Uses Next.js 14 app directory structure
- **Client Components** - Demonstrates 'use client' pattern
- **Pre-built Components** - Uses SDK's EncryptInput component
- **Type Safety** - Full TypeScript support

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Code Example

The entire integration is just a few lines:

```typescript
'use client';

import { FhevmProvider, EncryptInput, useFhevm } from '@fhevm/universal-sdk';

export default function Home() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <EncryptionDemo />
    </FhevmProvider>
  );
}

function EncryptionDemo() {
  const { ready } = useFhevm();

  if (!ready) return <div>Loading...</div>;

  return (
    <EncryptInput
      type="uint64"
      onEncrypt={(encrypted) => console.log(encrypted)}
    />
  );
}
```

That's it! Less than 10 lines to get started with FHEVM encryption.

## Project Structure

```
nextjs/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with FHEVM integration
│   ├── page.module.css     # Styles
│   └── globals.css         # Global styles
├── next.config.js          # Next.js configuration
├── package.json
└── tsconfig.json
```

## Key Features Demonstrated

### 1. FhevmProvider Setup
```typescript
<FhevmProvider
  config={{
    network: 'sepolia',
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
  }}
>
  {children}
</FhevmProvider>
```

### 2. Using Hooks
```typescript
const { ready, loading, error } = useFhevm();
```

### 3. Pre-built Components
```typescript
<EncryptInput
  type="uint64"
  placeholder="Enter a number"
  onEncrypt={(encrypted, originalValue) => {
    // Handle encrypted value
  }}
/>
```

## Configuration

The SDK automatically configures itself for Sepolia testnet. You can customize:

```typescript
<FhevmProvider
  config={{
    network: 'sepolia' | 'localhost',
    gatewayUrl: 'your-gateway-url',
    kmsContractAddress: 'your-kms-address',
    aclContractAddress: 'your-acl-address',
  }}
/>
```

## Learn More

- [Universal FHEVM SDK Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)

## Deployment

### Deploy to Vercel

```bash
vercel deploy
```

### Deploy to Any Platform

```bash
npm run build
npm start
```

The app will run on port 3000 by default.
