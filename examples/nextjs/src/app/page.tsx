'use client';

import { FhevmProvider } from '@fhevm/universal-sdk';
import { EncryptionDemo } from '../components/fhe/EncryptionDemo';
import { ComputationDemo } from '../components/fhe/ComputationDemo';
import { KeyManager } from '../components/fhe/KeyManager';
import { BankingExample } from '../components/examples/BankingExample';
import { MedicalExample } from '../components/examples/MedicalExample';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'basic' | 'examples'>('basic');

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Universal FHEVM SDK
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Next.js Integration Example
          </p>
          <p className="text-sm text-gray-500">
            Privacy-preserving applications with Fully Homomorphic Encryption
          </p>
        </header>

        <FhevmProvider
          config={{
            network: 'sepolia',
            gatewayUrl: 'https://gateway.sepolia.zama.ai',
          }}
        >
          <div className="mb-8">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'basic'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Basic Features
              </button>
              <button
                onClick={() => setActiveTab('examples')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'examples'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Use Case Examples
              </button>
            </div>

            {activeTab === 'basic' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <EncryptionDemo />
                  <ComputationDemo />
                </div>
                <div>
                  <KeyManager />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BankingExample />
                <MedicalExample />
              </div>
            )}
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This SDK
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg text-blue-600 mb-2">
                  Framework Agnostic
                </h3>
                <p className="text-sm text-gray-600">
                  Works seamlessly with React, Next.js, Vue, or vanilla JavaScript
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-600 mb-2">
                  Simple Integration
                </h3>
                <p className="text-sm text-gray-600">
                  Get started with less than 10 lines of code
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-600 mb-2">
                  Complete Workflow
                </h3>
                <p className="text-sm text-gray-600">
                  Full support for init, encrypt, decrypt, and contract interaction
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Quick Start Example
              </h4>
              <pre className="text-xs text-blue-800 overflow-x-auto">
{`import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/universal-sdk';

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
    const encrypted = await encrypt(42);
    console.log(encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}`}
              </pre>
            </div>
          </div>
        </FhevmProvider>

        <footer className="mt-12 text-center text-gray-600">
          <p className="mb-2">
            Built with{' '}
            <a
              href="https://github.com/KurtisSpencer/fhevm-react-template"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Universal FHEVM SDK
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Making privacy-preserving applications accessible to every developer
          </p>
        </footer>
      </div>
    </main>
  );
}
