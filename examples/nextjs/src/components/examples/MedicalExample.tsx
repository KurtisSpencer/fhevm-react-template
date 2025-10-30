'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/universal-sdk';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

/**
 * Medical Example Component
 * Demonstrates confidential medical data handling using FHE
 */
export const MedicalExample: React.FC = () => {
  const { encrypt, encrypting } = useEncrypt();
  const [age, setAge] = useState<string>('');
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [glucose, setGlucose] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!age || !bloodPressure || !glucose) {
      alert('Please fill in all medical data fields');
      return;
    }

    try {
      const ageNum = parseInt(age, 10);
      const bpNum = parseInt(bloodPressure, 10);
      const glucoseNum = parseInt(glucose, 10);

      // Encrypt all medical data
      const encryptedAge = await encrypt(ageNum, 'uint32');
      const encryptedBP = await encrypt(bpNum, 'uint32');
      const encryptedGlucose = await encrypt(glucoseNum, 'uint32');

      setResult(
        `Medical data encrypted successfully:\n\n` +
        `Age Handle: ${encryptedAge.handles[0]?.substring(0, 30)}...\n` +
        `Blood Pressure Handle: ${encryptedBP.handles[0]?.substring(0, 30)}...\n` +
        `Glucose Handle: ${encryptedGlucose.handles[0]?.substring(0, 30)}...\n\n` +
        `Your medical data is now encrypted and can be stored securely on-chain!\n` +
        `Healthcare providers can perform analysis without seeing raw values.`
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Encryption failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidential Medical Records</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Store medical data securely with complete privacy
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="number"
            label="Age"
            placeholder="Enter age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <Input
            type="number"
            label="Blood Pressure (mmHg)"
            placeholder="e.g., 120"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
          />

          <Input
            type="number"
            label="Glucose Level (mg/dL)"
            placeholder="e.g., 100"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
          />

          <Button
            onClick={handleSubmit}
            loading={encrypting}
            className="w-full"
          >
            Encrypt Medical Data
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">
                Encryption Complete
              </h4>
              <pre className="text-xs text-purple-700 whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2 text-sm">
              Healthcare Privacy Benefits
            </h4>
            <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
              <li>Patient data stays encrypted at all times</li>
              <li>Doctors can analyze without seeing raw values</li>
              <li>HIPAA-compliant data storage</li>
              <li>Selective disclosure to authorized parties</li>
              <li>Computational analysis on encrypted records</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-yellow-800">
              <strong>Demo Only:</strong> This is a demonstration of FHE
              capabilities. Real medical applications require additional
              security measures and regulatory compliance.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
