# Getting Started with Universal FHEVM SDK

Quick start guide to get up and running with the Universal FHEVM SDK in **less than 10 minutes**.

## Installation

### Option 1: Use the Monorepo (Development)

```bash
# Clone the repository
git clone <repository-url>
cd fhevm-react-template

# Install dependencies
npm install

# Build the SDK
cd packages/fhevm-sdk
npm run build

# Run Next.js example
cd ../../examples/nextjs
npm run dev
```

### Option 2: Install from NPM (Coming Soon)

```bash
npm install @fhevm/universal-sdk ethers@^6.0.0 react@^18.0.0
```

## Quick Start (< 10 Lines!)

### Step 1: Wrap Your App with FhevmProvider

```typescript
import { FhevmProvider } from '@fhevm/universal-sdk';

function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <YourApp />
    </FhevmProvider>
  );
}
```

### Step 2: Use FHEVM Hooks

```typescript
import { useFhevm, useEncrypt } from '@fhevm/universal-sdk';

function YourComponent() {
  const { ready } = useFhevm();
  const { encrypt } = useEncrypt();

  if (!ready) return <div>Loading FHEVM...</div>;

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint64');
    console.log('Encrypted:', encrypted.handles[0]);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

**That's it!** You're now using fully homomorphic encryption in your React app.

---

## Complete Example

Here's a complete working example:

```typescript
'use client';

import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/universal-sdk';
import { useState } from 'react';

export default function Home() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <EncryptionDemo />
    </FhevmProvider>
  );
}

function EncryptionDemo() {
  const { ready, loading } = useFhevm();
  const { encrypt, encrypting } = useEncrypt();
  const [result, setResult] = useState<string>('');

  if (loading) return <div>Initializing FHEVM...</div>;
  if (!ready) return <div>FHEVM not ready</div>;

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint64');
    setResult(encrypted.handles[0]);
  };

  return (
    <div>
      <h1>FHEVM Encryption Demo</h1>
      <button onClick={handleEncrypt} disabled={encrypting}>
        {encrypting ? 'Encrypting...' : 'Encrypt Value'}
      </button>
      {result && <p>Encrypted Handle: {result}</p>}
    </div>
  );
}
```

---

## Project Setup

### Next.js Setup

1. **Create a Next.js app:**
```bash
npx create-next-app@latest my-fhevm-app
cd my-fhevm-app
```

2. **Install SDK:**
```bash
npm install @fhevm/universal-sdk ethers@^6.0.0
```

3. **Configure Next.js** (`next.config.js`):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
```

4. **Use in your app** (`app/page.tsx`):
```typescript
'use client';

import { FhevmProvider, EncryptInput } from '@fhevm/universal-sdk';

export default function Home() {
  return (
    <FhevmProvider>
      <EncryptInput
        type="uint64"
        onEncrypt={(encrypted) => console.log(encrypted)}
      />
    </FhevmProvider>
  );
}
```

### React (Vite) Setup

1. **Create a Vite app:**
```bash
npm create vite@latest my-fhevm-app -- --template react-ts
cd my-fhevm-app
```

2. **Install SDK:**
```bash
npm install @fhevm/universal-sdk ethers@^6.0.0
```

3. **Use in your app** (`src/App.tsx`):
```typescript
import { FhevmProvider, useEncrypt } from '@fhevm/universal-sdk';

function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <MyComponent />
    </FhevmProvider>
  );
}

function MyComponent() {
  const { encrypt } = useEncrypt();

  return (
    <button onClick={() => encrypt(42, 'uint64')}>
      Encrypt
    </button>
  );
}
```

---

## Core Concepts

### 1. FHEVM Instance

The SDK manages an FHEVM instance for you:

```typescript
const { instance, ready, loading, error } = useFhevm({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
});
```

### 2. Encryption

Encrypt values before sending to smart contracts:

```typescript
const { encrypt } = useEncrypt();

// Encrypt a number
const encrypted = await encrypt(42, 'uint64');

// Use in contract
await contract.submitValue(encrypted.handles[0]);
```

### 3. Decryption

Decrypt values from smart contracts:

```typescript
const { decrypt } = useDecrypt();

const result = await decrypt(handle, {
  contractAddress: '0x...',
  userAddress: account
});

console.log(result.value); // Original value
```

### 4. Pre-built Components

Use ready-made components:

```typescript
import { EncryptInput, DecryptOutput } from '@fhevm/universal-sdk/components';

<EncryptInput
  type="uint64"
  onEncrypt={(encrypted) => setEncryptedValue(encrypted)}
/>

<DecryptOutput
  handle={encryptedHandle}
  contractAddress={contractAddress}
  userAddress={account}
/>
```

---

## Configuration

### Network Configuration

```typescript
<FhevmProvider
  config={{
    network: 'sepolia',          // or 'localhost'
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
    kmsContractAddress: '0x...',  // optional
    aclContractAddress: '0x...',  // optional
  }}
/>
```

### Custom Loading/Error Components

```typescript
<FhevmProvider
  loadingComponent={<CustomLoading />}
  errorComponent={(error) => <CustomError error={error} />}
>
  <App />
</FhevmProvider>
```

---

## Smart Contract Integration

### 1. Encrypt Data Before Sending

```typescript
const { encrypt } = useEncrypt();

async function registerRunner(age: number, experience: number) {
  // Encrypt sensitive data
  const encryptedAge = await encrypt(age, 'uint32');
  const encryptedExp = await encrypt(experience, 'uint8');

  // Send to contract
  await contract.register(
    encryptedAge.handles[0],
    encryptedExp.handles[0]
  );
}
```

### 2. Decrypt Data from Contract

```typescript
const { decrypt } = useDecrypt();

async function viewResult(handle: bigint) {
  const result = await decrypt(handle, {
    contractAddress: CONTRACT_ADDRESS,
    userAddress: account
  });

  return result.value;
}
```

---

## Examples

### Example 1: Simple Encryption

```typescript
function SimpleEncrypt() {
  const { encrypt } = useEncrypt();
  const [value, setValue] = useState('');
  const [encrypted, setEncrypted] = useState('');

  const handleEncrypt = async () => {
    const result = await encrypt(Number(value), 'uint64');
    setEncrypted(result.handles[0]);
  };

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter number"
      />
      <button onClick={handleEncrypt}>Encrypt</button>
      {encrypted && <p>Encrypted: {encrypted}</p>}
    </div>
  );
}
```

### Example 2: Batch Encryption

```typescript
function BatchEncrypt() {
  const { encryptMultiple } = useEncrypt();

  const handleBatchEncrypt = async () => {
    const results = await encryptMultiple([
      { value: 42, type: 'uint64' },
      { value: 100, type: 'uint32' },
      { value: true, type: 'bool' }
    ]);

    results.forEach((r, i) => {
      console.log(`Value ${i}:`, r.handles[0]);
    });
  };

  return <button onClick={handleBatchEncrypt}>Encrypt Multiple</button>;
}
```

### Example 3: Using Pre-built Components

```typescript
function QuickDemo() {
  return (
    <FhevmProvider>
      <EncryptInput
        type="uint64"
        label="Enter your age:"
        onEncrypt={(encrypted, original) => {
          console.log(`${original} encrypted to ${encrypted.handles[0]}`);
        }}
      />
    </FhevmProvider>
  );
}
```

---

## Troubleshooting

### "Instance not ready"

Wait for the instance to initialize:

```typescript
const { ready, loading } = useFhevm();

if (loading) return <div>Loading...</div>;
if (!ready) return <div>Not ready</div>;
```

### Webpack/Build Errors

Add fallbacks to your bundler config:

```javascript
// Next.js (next.config.js)
config.resolve.fallback = {
  fs: false,
  net: false,
  tls: false,
};

// Vite (vite.config.ts)
resolve: {
  alias: {
    fs: false,
    net: false,
    tls: false,
  }
}
```

### TypeScript Errors

Ensure you have the required types:

```bash
npm install --save-dev @types/react @types/node
```

---

## Next Steps

1. **Explore Examples:**
   - [Next.js Example](../examples/nextjs/)
   - [Anonymous Marathon dApp](../examples/anonymous-marathon/)

2. **Read Documentation:**
   - [API Reference](./API.md)
   - [Best Practices](./BEST_PRACTICES.md)
   - [Migration Guide](./MIGRATION.md)

3. **Watch Demo:**
   - [Video Demo](../demo.mp4)

4. **Join Community:**
   - [GitHub Discussions](#)
   - [Discord Server](#)

---

## Support

Need help? Check out:
- [Documentation](./API.md)
- [GitHub Issues](../../issues)
- [Examples](../examples/)

---

**You're now ready to build privacy-preserving dApps!** 🎉
