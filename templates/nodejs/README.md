# Node.js Template for Universal FHEVM SDK

This template provides a starting point for building Node.js backend services with the Universal FHEVM SDK.

## Quick Start

```bash
# Create a new Node.js project
mkdir my-fhe-backend
cd my-fhe-backend
npm init -y

# Install dependencies
npm install @fhevm/universal-sdk express ethers
npm install -D typescript @types/node @types/express tsx
```

## Minimal Setup

```typescript
// src/server.ts
import express from 'express';
import { createFhevmInstance, encryptValue, decryptValue } from '@fhevm/universal-sdk/core';

const app = express();
app.use(express.json());

let fhevmInstance: any = null;

// Initialize FHEVM
async function initFhevm() {
  fhevmInstance = await createFhevmInstance({
    network: 'sepolia',
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
  });
  console.log('FHEVM initialized');
}

// Encryption endpoint
app.post('/encrypt', async (req, res) => {
  try {
    const { value, type = 'uint64' } = req.body;
    const encrypted = await encryptValue(fhevmInstance, value, type);
    res.json({ success: true, encrypted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Decryption endpoint
app.post('/decrypt', async (req, res) => {
  try {
    const { encryptedData, contractAddress, account } = req.body;
    const decrypted = await decryptValue(
      fhevmInstance,
      encryptedData,
      contractAddress,
      account
    );
    res.json({ success: true, decrypted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
initFhevm().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

## Features

- Express.js server
- Server-side FHE operations
- RESTful API endpoints
- TypeScript support

## Running

```bash
# Development
npx tsx src/server.ts

# Build
npx tsc

# Production
node dist/server.js
```

## Learn More

- [SDK Documentation](../../README.md)
- [API Reference](../../docs/API.md)
- [Next.js Example](../../examples/nextjs/)
