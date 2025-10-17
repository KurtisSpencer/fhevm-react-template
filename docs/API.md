# API Reference

Complete API documentation for the Universal FHEVM SDK.

## Table of Contents

- [Core API](#core-api)
- [React Hooks](#react-hooks)
- [React Components](#react-components)
- [Types](#types)

---

## Core API

Framework-independent core functions for FHEVM operations.

### createFhevmInstance

Creates a new FHEVM instance for encryption/decryption operations.

```typescript
import { createFhevmInstance } from '@fhevm/universal-sdk/core';

async function createFhevmInstance(config?: FhevmConfig): Promise<FhevmInstance>
```

**Parameters:**
- `config` (optional): Configuration object
  - `network`: Network name ('sepolia' | 'localhost' | string)
  - `gatewayUrl`: Gateway URL for decryption requests
  - `kmsContractAddress`: KMS contract address
  - `aclContractAddress`: ACL contract address
  - `publicKey`: Public key for encryption

**Returns:** Promise<FhevmInstance>

**Example:**
```typescript
const instance = await createFhevmInstance({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
});
```

---

### encryptValue

Encrypts a value using FHEVM instance.

```typescript
import { encryptValue } from '@fhevm/universal-sdk/core';

async function encryptValue(
  instance: FhevmInstance,
  value: number | boolean | bigint,
  type?: EncryptionType
): Promise<EncryptedValue>
```

**Parameters:**
- `instance`: FHEVM instance
- `value`: Value to encrypt
- `type` (optional): Encryption type (default: 'uint64')

**Encryption Types:**
- `'bool'` - Boolean value
- `'uint4'` - 4-bit unsigned integer
- `'uint8'` - 8-bit unsigned integer
- `'uint16'` - 16-bit unsigned integer
- `'uint32'` - 32-bit unsigned integer (default)
- `'uint64'` - 64-bit unsigned integer
- `'uint128'` - 128-bit unsigned integer
- `'uint256'` - 256-bit unsigned integer
- `'address'` - Ethereum address
- `'bytes'` - Byte array
- `'bytes256'` - 256-byte array

**Returns:** Promise<EncryptedValue>
```typescript
{
  data: Uint8Array;      // Encrypted data
  handles: string[];     // Contract handles
  inputProof: string;    // Proof for verification
}
```

**Example:**
```typescript
const encrypted = await encryptValue(instance, 42, 'uint64');
console.log(encrypted.handles[0]); // Use in smart contract
```

---

### encryptBatch

Encrypts multiple values at once.

```typescript
async function encryptBatch(
  instance: FhevmInstance,
  values: Array<{ value: number | boolean | bigint; type: EncryptionType }>
): Promise<EncryptedValue[]>
```

**Example:**
```typescript
const encrypted = await encryptBatch(instance, [
  { value: 42, type: 'uint64' },
  { value: true, type: 'bool' },
  { value: 100n, type: 'uint256' }
]);
```

---

### decryptValue

Decrypts an encrypted value from FHEVM.

```typescript
import { decryptValue } from '@fhevm/universal-sdk/core';

async function decryptValue(
  instance: FhevmInstance,
  handle: bigint | string,
  options: DecryptOptions
): Promise<DecryptResult>
```

**Parameters:**
- `instance`: FHEVM instance
- `handle`: Encrypted handle from contract
- `options`: Decryption options
  - `contractAddress`: Contract address
  - `userAddress`: User's wallet address
  - `gatewayUrl` (optional): Gateway URL

**Returns:** Promise<DecryptResult>
```typescript
{
  value: bigint | boolean | string;  // Decrypted value
  raw: any;                           // Raw response
}
```

**Example:**
```typescript
const result = await decryptValue(instance, handle, {
  contractAddress: '0x...',
  userAddress: account
});
console.log(result.value); // 42
```

---

## React Hooks

React-specific hooks for FHEVM operations.

### useFhevm

Manages FHEVM instance lifecycle in React components.

```typescript
import { useFhevm } from '@fhevm/universal-sdk/react';

function useFhevm(config?: FhevmConfig): UseFhevmResult
```

**Returns:**
```typescript
{
  instance: FhevmInstance | null;  // FHEVM instance
  ready: boolean;                   // Instance ready state
  error: Error | null;              // Initialization error
  loading: boolean;                 // Loading state
  reinitialize: () => Promise<void>; // Reinitialize function
}
```

**Example:**
```typescript
function MyComponent() {
  const { instance, ready, loading, error } = useFhevm({
    network: 'sepolia'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!ready) return <div>Not ready</div>;

  return <div>FHEVM Ready!</div>;
}
```

---

### useEncrypt

Hook for encrypting values.

```typescript
import { useEncrypt } from '@fhevm/universal-sdk/react';

function useEncrypt(): UseEncryptResult
```

**Returns:**
```typescript
{
  encrypt: (value: number | boolean | bigint, type?: EncryptionType) => Promise<EncryptedValue>;
  encryptMultiple: (values: Array<{value, type}>) => Promise<EncryptedValue[]>;
  encrypting: boolean;              // Encryption in progress
  error: Error | null;              // Encryption error
  lastEncrypted: EncryptedValue | null; // Last encrypted value
}
```

**Example:**
```typescript
function EncryptForm() {
  const { encrypt, encrypting, error } = useEncrypt();

  const handleEncrypt = async () => {
    try {
      const encrypted = await encrypt(42, 'uint64');
      console.log('Encrypted:', encrypted.handles[0]);
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <button onClick={handleEncrypt} disabled={encrypting}>
      {encrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

---

### useDecrypt

Hook for decrypting values.

```typescript
import { useDecrypt } from '@fhevm/universal-sdk/react';

function useDecrypt(): UseDecryptResult
```

**Returns:**
```typescript
{
  decrypt: (handle: bigint | string, options: DecryptOptions) => Promise<DecryptResult>;
  decryptMultiple: (handles: Array<bigint | string>, options: DecryptOptions) => Promise<DecryptResult[]>;
  decrypting: boolean;              // Decryption in progress
  error: Error | null;              // Decryption error
  lastDecrypted: DecryptResult | null; // Last decrypted value
}
```

**Example:**
```typescript
function DecryptView() {
  const { decrypt, decrypting } = useDecrypt();

  const handleDecrypt = async (handle: bigint) => {
    const result = await decrypt(handle, {
      contractAddress: '0x...',
      userAddress: account
    });
    console.log('Decrypted:', result.value);
  };

  return <button onClick={() => handleDecrypt(handle)}>Decrypt</button>;
}
```

---

## React Components

Pre-built UI components for common FHEVM operations.

### FhevmProvider

Context provider for FHEVM instance.

```typescript
import { FhevmProvider } from '@fhevm/universal-sdk/components';

<FhevmProvider
  config?: FhevmConfig;
  loadingComponent?: ReactNode;
  errorComponent?: (error: Error) => ReactNode;
>
  {children}
</FhevmProvider>
```

**Props:**
- `config` (optional): FHEVM configuration
- `loadingComponent` (optional): Custom loading component
- `errorComponent` (optional): Custom error component
- `children`: Child components

**Example:**
```typescript
function App() {
  return (
    <FhevmProvider
      config={{ network: 'sepolia' }}
      loadingComponent={<div>Initializing...</div>}
      errorComponent={(error) => <div>Error: {error.message}</div>}
    >
      <MyApp />
    </FhevmProvider>
  );
}
```

---

### EncryptInput

Pre-built input component for encrypting values.

```typescript
import { EncryptInput } from '@fhevm/universal-sdk/components';

<EncryptInput
  type?: EncryptionType;
  placeholder?: string;
  label?: string;
  onEncrypt?: (encrypted: EncryptedValue, originalValue: string) => void;
  onError?: (error: Error) => void;
  buttonText?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
/>
```

**Props:**
- `type` (optional): Encryption type (default: 'uint64')
- `placeholder` (optional): Input placeholder
- `label` (optional): Input label
- `onEncrypt` (optional): Callback when encryption succeeds
- `onError` (optional): Callback when encryption fails
- `buttonText` (optional): Button text (default: 'Encrypt')
- `className` (optional): Container class name
- `inputClassName` (optional): Input class name
- `buttonClassName` (optional): Button class name

**Example:**
```typescript
<EncryptInput
  type="uint64"
  label="Enter value:"
  placeholder="42"
  onEncrypt={(encrypted, original) => {
    console.log(`${original} encrypted to ${encrypted.handles[0]}`);
  }}
  onError={(err) => alert(err.message)}
/>
```

---

### DecryptOutput

Pre-built component for decrypting and displaying values.

```typescript
import { DecryptOutput } from '@fhevm/universal-sdk/components';

<DecryptOutput
  handle: bigint | string;
  contractAddress: string;
  userAddress: string;
  gatewayUrl?: string;
  label?: string;
  autoDecrypt?: boolean;
  className?: string;
  onDecrypt?: (value: bigint | boolean | string) => void;
  onError?: (error: Error) => void;
  renderValue?: (value: bigint | boolean | string) => ReactNode;
/>
```

**Props:**
- `handle`: Encrypted handle to decrypt
- `contractAddress`: Contract address
- `userAddress`: User's wallet address
- `gatewayUrl` (optional): Gateway URL
- `label` (optional): Component label
- `autoDecrypt` (optional): Auto-decrypt on mount (default: false)
- `className` (optional): Container class name
- `onDecrypt` (optional): Callback when decryption succeeds
- `onError` (optional): Callback when decryption fails
- `renderValue` (optional): Custom value renderer

**Example:**
```typescript
<DecryptOutput
  handle={encryptedHandle}
  contractAddress="0x..."
  userAddress={account}
  label="Finish Time:"
  autoDecrypt={true}
  renderValue={(value) => <span>{value} minutes</span>}
  onDecrypt={(value) => console.log('Decrypted:', value)}
/>
```

---

## Types

### FhevmConfig

```typescript
interface FhevmConfig {
  network?: 'sepolia' | 'localhost' | string;
  gatewayUrl?: string;
  publicKey?: string;
  kmsContractAddress?: string;
  aclContractAddress?: string;
}
```

### EncryptionType

```typescript
type EncryptionType =
  | 'bool'
  | 'uint4'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'address'
  | 'bytes'
  | 'bytes256';
```

### EncryptedValue

```typescript
interface EncryptedValue {
  data: Uint8Array;
  handles: string[];
  inputProof: string;
}
```

### DecryptOptions

```typescript
interface DecryptOptions {
  contractAddress: string;
  userAddress: string;
  gatewayUrl?: string;
}
```

### DecryptResult

```typescript
interface DecryptResult {
  value: bigint | boolean | string;
  raw: any;
}
```

---

## Error Handling

All async functions throw errors that should be caught:

```typescript
try {
  const encrypted = await encrypt(42, 'uint64');
} catch (error) {
  console.error('Encryption failed:', error.message);
}
```

Common errors:
- `Instance not ready` - FHEVM instance not initialized
- `Encryption failed` - Invalid value or type
- `Decryption failed` - Invalid handle or permissions
- `Gateway request failed` - Network or gateway error

---

## Best Practices

1. **Always check `ready` state**:
```typescript
const { ready } = useFhevm();
if (!ready) return <Loading />;
```

2. **Handle errors gracefully**:
```typescript
const { error } = useEncrypt();
if (error) return <Error message={error.message} />;
```

3. **Use TypeScript**:
```typescript
const encrypted: EncryptedValue = await encrypt(42, 'uint64');
```

4. **Cache instances**:
```typescript
// Use FhevmProvider to share instance across components
<FhevmProvider>
  <App />
</FhevmProvider>
```

5. **Validate inputs**:
```typescript
if (value < 0 || value > MAX_VALUE) {
  throw new Error('Value out of range');
}
await encrypt(value, 'uint64');
```

---

For more examples, see:
- [Examples Guide](./EXAMPLES.md)
- [Best Practices](./BEST_PRACTICES.md)
- [Migration Guide](./MIGRATION.md)
