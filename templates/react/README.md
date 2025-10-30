# React Template for Universal FHEVM SDK

This template provides a starting point for building React applications with the Universal FHEVM SDK.

## Quick Start

```bash
# Create a new React project
npx create-react-app my-fhe-app --template typescript

# Install the Universal FHEVM SDK
cd my-fhe-app
npm install @fhevm/universal-sdk ethers
```

## Minimal Setup

```typescript
// src/App.tsx
import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/universal-sdk';

function App() {
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

export default App;
```

## Features

- Client-side encryption
- React hooks integration
- TypeScript support
- Component library

## Learn More

- [SDK Documentation](../../README.md)
- [API Reference](../../docs/API.md)
- [Next.js Example](../../examples/nextjs/)
