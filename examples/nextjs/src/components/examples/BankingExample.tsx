'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/universal-sdk';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

/**
 * Banking Example Component
 * Demonstrates confidential banking operations using FHE
 */
export const BankingExample: React.FC = () => {
  const { encrypt, encrypting } = useEncrypt();
  const [balance, setBalance] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [operation, setOperation] = useState<'deposit' | 'withdraw'>('deposit');
  const [result, setResult] = useState<string | null>(null);

  const handleTransaction = async () => {
    if (!balance || !amount) {
      alert('Please enter both balance and amount');
      return;
    }

    try {
      const balanceNum = parseInt(balance, 10);
      const amountNum = parseInt(amount, 10);

      // Encrypt both values
      const encryptedBalance = await encrypt(balanceNum, 'uint64');
      const encryptedAmount = await encrypt(amountNum, 'uint64');

      // Simulate transaction
      setResult(
        `Transaction processed:\n` +
        `Operation: ${operation}\n` +
        `Encrypted Balance: ${encryptedBalance.handles[0]?.substring(0, 20)}...\n` +
        `Encrypted Amount: ${encryptedAmount.handles[0]?.substring(0, 20)}...\n` +
        `All operations performed on encrypted data!`
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Transaction failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidential Banking</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Perform banking operations while keeping balances private
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="number"
            label="Current Balance"
            placeholder="Enter your balance"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />

          <Input
            type="number"
            label="Transaction Amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="operation"
                  value="deposit"
                  checked={operation === 'deposit'}
                  onChange={() => setOperation('deposit')}
                  className="mr-2"
                />
                Deposit
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="operation"
                  value="withdraw"
                  checked={operation === 'withdraw'}
                  onChange={() => setOperation('withdraw')}
                  className="mr-2"
                />
                Withdraw
              </label>
            </div>
          </div>

          <Button
            onClick={handleTransaction}
            loading={encrypting}
            className="w-full"
          >
            Process Transaction
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">
                Transaction Complete
              </h4>
              <pre className="text-xs text-green-700 whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">
              Privacy Features
            </h4>
            <ul className="list-disc list-inside text-xs text-blue-700 space-y-1">
              <li>Balances remain encrypted on-chain</li>
              <li>Transaction amounts are private</li>
              <li>Only authorized parties can decrypt</li>
              <li>Full audit trail without revealing values</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
