'use client';

import { FhevmProvider, EncryptInput, useFhevm } from '@fhevm/universal-sdk';
import { useState } from 'react';
import styles from './page.module.css';

function EncryptionDemo() {
  const { ready, loading, error } = useFhevm();
  const [encryptedValues, setEncryptedValues] = useState<string[]>([]);

  if (loading) {
    return (
      <div className={styles.status}>
        <div className={styles.loader}></div>
        <p>Initializing FHEVM...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h3>Error</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className={styles.status}>
        <p>FHEVM instance not ready</p>
      </div>
    );
  }

  return (
    <div className={styles.demo}>
      <div className={styles.card}>
        <h2>Encrypt Your Data</h2>
        <p className={styles.subtitle}>
          Enter a number to encrypt it using FHEVM (Fully Homomorphic Encryption)
        </p>

        <div className={styles.inputSection}>
          <EncryptInput
            type="uint64"
            placeholder="Enter a number (e.g., 42)"
            label="Value to encrypt:"
            onEncrypt={(encrypted, originalValue) => {
              const handle = encrypted.handles[0] || 'N/A';
              setEncryptedValues((prev) => [
                ...prev,
                `${originalValue} → ${handle}`,
              ]);
            }}
            onError={(err) => alert(`Encryption failed: ${err.message}`)}
            buttonText="Encrypt"
          />
        </div>

        {encryptedValues.length > 0 && (
          <div className={styles.results}>
            <h3>Encrypted Values</h3>
            <ul>
              {encryptedValues.map((value, index) => (
                <li key={index}>
                  <code>{value}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h3>How It Works</h3>
        <ol>
          <li>Enter a number in the input field</li>
          <li>Click "Encrypt" to encrypt the value</li>
          <li>The encrypted handle will be displayed below</li>
          <li>This encrypted value can be used in smart contracts</li>
        </ol>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Universal FHEVM SDK</h1>
          <p>Next.js Integration Example</p>
        </header>

        <FhevmProvider
          config={{
            network: 'sepolia',
            gatewayUrl: 'https://gateway.sepolia.zama.ai',
          }}
        >
          <EncryptionDemo />
        </FhevmProvider>

        <footer className={styles.footer}>
          <p>
            Built with{' '}
            <a
              href="https://github.com/your-org/fhevm-universal-sdk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Universal FHEVM SDK
            </a>
          </p>
          <p className={styles.codeCount}>
            <strong>Less than 10 lines of code to get started!</strong>
          </p>
        </footer>
      </div>
    </main>
  );
}
