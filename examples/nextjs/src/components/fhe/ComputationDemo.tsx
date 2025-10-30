'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

/**
 * Computation Demo Component
 * Demonstrates homomorphic computation capabilities
 */
export const ComputationDemo: React.FC = () => {
  const [computing, setComputing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCompute = async () => {
    setComputing(true);
    try {
      // Simulate computation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setResult('Computation completed on encrypted data (simulated)');
    } catch (err) {
      setResult('Computation failed');
    } finally {
      setComputing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homomorphic Computation</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Perform operations on encrypted data without decryption
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Supported Operations
            </h4>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Addition (encrypted + encrypted)</li>
              <li>Subtraction (encrypted - encrypted)</li>
              <li>Multiplication (encrypted * encrypted)</li>
              <li>Comparison (encrypted {'>'} encrypted)</li>
            </ul>
          </div>

          <Button
            onClick={handleCompute}
            loading={computing}
            className="w-full"
          >
            Run Sample Computation
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-700">{result}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
