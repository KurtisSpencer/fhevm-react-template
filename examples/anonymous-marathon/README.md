# Anonymous Marathon - Real-World dApp Example

A privacy-preserving marathon registration platform built with the Universal FHEVM SDK.

## Overview

This example demonstrates a production-ready dApp using FHEVM for privacy:
- **Encrypted Runner Data**: Age, experience, and previous times are encrypted
- **Anonymous Identifiers**: Runners maintain privacy until results are revealed
- **Homomorphic Operations**: Computations on encrypted data
- **SDK Integration**: All FHEVM operations use the Universal SDK

## Features

- **Marathon Creation**: Organizers create events with registration deadlines
- **Private Registration**: Runners register with encrypted personal data
- **Time Recording**: Record finish times while maintaining privacy
- **Leaderboard**: Anonymous leaderboard until official reveal
- **Prize Distribution**: Automated prize pool distribution

## Smart Contract

The `AnonymousMarathon.sol` contract handles:
- Marathon lifecycle management
- Encrypted runner registration
- Time recording and verification
- Privacy-preserving leaderboards
- Prize pool management

### Key Data Structures

```solidity
struct Runner {
    euint32 encryptedAge;          // FHE encrypted
    euint8 encryptedExperience;    // FHE encrypted
    euint16 encryptedPreviousTime; // FHE encrypted
    bool hasRegistered;
    bool hasFinished;
    euint32 encryptedFinishTime;   // FHE encrypted
    uint256 registrationTime;
    bytes32 anonymousId;           // Privacy identifier
}
```

## SDK Integration

This example showcases the Universal FHEVM SDK in action:

### 1. Setup (< 10 lines)

```typescript
import { FhevmProvider, useEncrypt, useDecrypt } from '@fhevm/universal-sdk';

function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <MarathonApp />
    </FhevmProvider>
  );
}
```

### 2. Encrypt Runner Data

```typescript
function RegisterRunner() {
  const { encrypt } = useEncrypt();

  const handleRegister = async (age: number, experience: number, previousTime: number) => {
    // Encrypt sensitive data
    const encryptedAge = await encrypt(age, 'uint32');
    const encryptedExp = await encrypt(experience, 'uint8');
    const encryptedTime = await encrypt(previousTime, 'uint16');

    // Register with encrypted values
    await contract.registerForMarathon(
      marathonId,
      encryptedAge.handles[0],
      encryptedExp.handles[0],
      encryptedTime.handles[0],
      anonymousId,
      { value: registrationFee }
    );
  };

  return <RegistrationForm onSubmit={handleRegister} />;
}
```

### 3. Decrypt Results

```typescript
function ViewResults() {
  const { decrypt } = useDecrypt();

  const revealTime = async (handle: bigint) => {
    const result = await decrypt(handle, {
      contractAddress: MARATHON_ADDRESS,
      userAddress: account,
    });

    return result.value; // Decrypted finish time
  };

  return <Leaderboard onReveal={revealTime} />;
}
```

## Running the Example

### Prerequisites

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify on Etherscan
npx hardhat run scripts/verify.js --network sepolia
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
anonymous-marathon/
├── contracts/
│   └── AnonymousMarathon.sol      # Main contract
├── scripts/
│   ├── deploy.js                  # Deployment script
│   ├── verify.js                  # Etherscan verification
│   └── interact.js                # Interaction examples
├── frontend/
│   ├── components/
│   │   ├── RegisterForm.tsx       # Registration with SDK
│   │   ├── Leaderboard.tsx        # Results display
│   │   └── MarathonList.tsx       # Marathon listing
│   ├── hooks/
│   │   └── useMarathon.ts         # Contract interaction
│   └── pages/
│       └── index.tsx              # Main page
├── test/
│   └── AnonymousMarathon.test.js  # Comprehensive tests
├── hardhat.config.js
├── package.json
└── README.md
```

## Key Workflows

### 1. Create Marathon

```typescript
const createMarathon = async (
  name: string,
  eventDate: number,
  registrationDeadline: number,
  maxParticipants: number
) => {
  const tx = await contract.createMarathon(
    name,
    eventDate,
    registrationDeadline,
    maxParticipants
  );
  await tx.wait();
};
```

### 2. Register Runner

```typescript
const registerRunner = async (runnerData) => {
  // SDK handles encryption automatically
  const encryptedAge = await encrypt(runnerData.age, 'uint32');
  const encryptedExp = await encrypt(runnerData.experience, 'uint8');
  const encryptedTime = await encrypt(runnerData.previousTime, 'uint16');

  await contract.registerForMarathon(
    marathonId,
    encryptedAge.handles[0],
    encryptedExp.handles[0],
    encryptedTime.handles[0],
    runnerData.anonymousId,
    { value: registrationFee }
  );
};
```

### 3. Record Finish Time

```typescript
const recordFinishTime = async (runnerId: address, timeMinutes: number) => {
  const encryptedTime = await encrypt(timeMinutes, 'uint32');

  await contract.recordFinishTime(
    marathonId,
    runnerId,
    encryptedTime.handles[0]
  );
};
```

### 4. View Results

```typescript
const viewResults = async (handle: bigint) => {
  const result = await decrypt(handle, {
    contractAddress: marathonAddress,
    userAddress: account,
  });

  console.log('Finish time:', result.value, 'minutes');
};
```

## Privacy Features

### Data Encryption

All sensitive runner data is encrypted using FHEVM:
- **Age**: `euint32` - Encrypted 32-bit unsigned integer
- **Experience**: `euint8` - Encrypted 8-bit unsigned integer (1-10 scale)
- **Previous Time**: `euint16` - Encrypted previous marathon time
- **Finish Time**: `euint32` - Encrypted race completion time

### Anonymous Identifiers

Runners use anonymous IDs (bytes32) for privacy:
- Generated off-chain
- Linked to wallet but not revealed publicly
- Allows participation tracking without identity exposure

### Controlled Revelation

Results can be revealed in a controlled manner:
- Only after race completion
- With proper authorization
- Through decryption permits

## Testing

The example includes comprehensive tests:

```bash
# Run all tests
npm test

# Test with gas reporting
npm run test:gas

# Test with coverage
npm run test:coverage
```

### Test Coverage

- ✅ Marathon creation and management
- ✅ Runner registration with encrypted data
- ✅ Time recording and verification
- ✅ Leaderboard functionality
- ✅ Access control
- ✅ Edge cases and error handling

## Deployment

### Sepolia Testnet

```bash
# Set environment variables in .env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key

# Deploy
npm run deploy:sepolia

# Verify
npm run verify:sepolia
```

### Contract Addresses

- **Sepolia**: `0x...` (update after deployment)
- **Gateway**: `https://gateway.sepolia.zama.ai`

## SDK Benefits Demonstrated

This example showcases why the Universal FHEVM SDK is valuable:

1. **Simplified Encryption**: No manual fhevmjs setup
2. **React Integration**: Hooks make encryption/decryption easy
3. **Type Safety**: Full TypeScript support
4. **Error Handling**: Built-in error management
5. **Reusable Components**: Pre-built UI components
6. **Consistent API**: wagmi-like patterns

## Learn More

- [Universal FHEVM SDK Documentation](../../README.md)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Solidity Library](https://github.com/zama-ai/fhevm)
- [Example Video Demo](../../demo.mp4)

## License

MIT
