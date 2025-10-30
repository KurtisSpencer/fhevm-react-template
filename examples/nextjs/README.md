# Next.js FHEVM SDK Integration Example

This is a comprehensive Next.js example demonstrating the integration of the Universal FHEVM SDK for building privacy-preserving applications with Fully Homomorphic Encryption.

## Features

- Complete FHEVM SDK integration with Next.js 14+ App Router
- Comprehensive component library for FHE operations
- API routes for server-side encryption/decryption
- Real-world use case examples (Banking, Medical)
- Custom hooks for encryption, decryption, and computation
- Full TypeScript support with type safety
- Responsive UI with Tailwind CSS

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   └── api/                    # API routes
│       ├── fhe/
│       │   ├── route.ts         # FHE operations
│       │   ├── encrypt/route.ts # Encryption endpoint
│       │   ├── decrypt/route.ts # Decryption endpoint
│       │   └── compute/route.ts # Computation endpoint
│       └── keys/route.ts       # Key management
│
├── components/                 # React components
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── fhe/                    # FHE components
│   │   ├── FHEProvider.tsx     # FHE context provider
│   │   ├── EncryptionDemo.tsx  # Encryption demo
│   │   ├── ComputationDemo.tsx # Computation demo
│   │   └── KeyManager.tsx      # Key management UI
│   └── examples/               # Use case examples
│       ├── BankingExample.tsx  # Banking use case
│       └── MedicalExample.tsx  # Medical use case
│
├── lib/                        # Utility libraries
│   ├── fhe/                    # FHE utilities
│   │   ├── client.ts           # Client-side FHE
│   │   ├── server.ts           # Server-side FHE
│   │   ├── keys.ts             # Key management
│   │   └── types.ts            # FHE types
│   └── utils/                  # Helper functions
│       ├── security.ts         # Security utils
│       └── validation.ts       # Validation utils
│
├── hooks/                      # Custom React hooks
│   ├── useFHE.ts               # FHE hook
│   ├── useEncryption.ts        # Encryption hook
│   └── useComputation.ts       # Computation hook
│
├── types/                      # TypeScript types
│   ├── fhe.ts                  # FHE type definitions
│   └── api.ts                  # API type definitions
│
└── styles/                     # Style files
    └── globals.css
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# or
yarn install
```

### Development

```bash
# Run development server
npm run dev

# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Usage Examples

### Basic Encryption

```typescript
import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/universal-sdk';

function App() {
  return (
    <FhevmProvider>
      <MyComponent />
    </FhevmProvider>
  );
}

function MyComponent() {
  const { ready } = useFhevm();
  const { encrypt } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint64');
    console.log('Encrypted:', encrypted);
  };

  return (
    <button onClick={handleEncrypt} disabled={!ready}>
      Encrypt Value
    </button>
  );
}
```

### Using API Routes

```typescript
// Call encryption API
const response = await fetch('/api/fhe/encrypt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    value: 42,
    type: 'uint64',
  }),
});

const data = await response.json();
console.log('Encrypted:', data.encrypted);
```

### Custom Hooks

```typescript
import { useEncryption } from '@/hooks/useEncryption';

function MyComponent() {
  const { encrypt, encrypting, error } = useEncryption();

  const handleEncrypt = async () => {
    try {
      const result = await encrypt(100, 'uint32');
      console.log('Success:', result);
    } catch (err) {
      console.error('Failed:', error);
    }
  };

  return (
    <button onClick={handleEncrypt} disabled={encrypting}>
      {encrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

## Components

### UI Components

- **Button**: Customizable button with loading states
- **Input**: Form input with validation and error handling
- **Card**: Container component for content sections

### FHE Components

- **FHEProvider**: Context provider for FHEVM instance
- **EncryptionDemo**: Interactive encryption demonstration
- **ComputationDemo**: Homomorphic computation examples
- **KeyManager**: Public key display and management

### Example Components

- **BankingExample**: Confidential banking operations
- **MedicalExample**: Private medical record handling

## API Routes

### POST /api/fhe/encrypt

Encrypt a value using FHEVM.

**Request:**
```json
{
  "value": 42,
  "type": "uint64",
  "network": "sepolia"
}
```

**Response:**
```json
{
  "success": true,
  "encrypted": {
    "handles": ["0x..."],
    "inputProof": "..."
  }
}
```

### POST /api/fhe/decrypt

Decrypt an encrypted value.

**Request:**
```json
{
  "encryptedData": "...",
  "contractAddress": "0x...",
  "account": "0x..."
}
```

### GET /api/keys

Get the public key.

**Response:**
```json
{
  "success": true,
  "publicKey": "...",
  "network": "sepolia"
}
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_GATEWAY_URL=https://gateway.sepolia.zama.ai
```

## Features Showcase

### 1. Encryption Demo
Interactive component demonstrating value encryption with real-time feedback.

### 2. Banking Example
Confidential banking operations:
- Encrypted balances
- Private transactions
- Secure deposits/withdrawals

### 3. Medical Records Example
Healthcare data privacy:
- Encrypted patient data
- Private medical records
- HIPAA-compliant storage

## Technology Stack

- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Universal FHEVM SDK**: Privacy-preserving encryption
- **React Hooks**: State management

## Best Practices

1. **Always wrap your app with FhevmProvider**
2. **Check `ready` state before encryption**
3. **Handle errors appropriately**
4. **Validate inputs before encryption**
5. **Use TypeScript types for safety**

## Troubleshooting

### FHEVM instance not ready
Ensure the FhevmProvider is wrapping your components and wait for the `ready` state.

### Encryption fails
Check that:
- The value is valid for the specified type
- Network configuration is correct
- Gateway URL is accessible

### Build errors
Clear the `.next` directory and rebuild:
```bash
rm -rf .next
npm run build
```

## Learn More

- [Universal FHEVM SDK Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)

## License

MIT

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/KurtisSpencer/fhevm-react-template/issues).
