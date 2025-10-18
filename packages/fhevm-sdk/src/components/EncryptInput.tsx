/**
 * EncryptInput Component
 * Reusable input component for encrypting values
 */

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useEncrypt } from '../react/useEncrypt';
import { EncryptionType, EncryptedValue } from '../core/encrypt';

export interface EncryptInputProps {
  type?: EncryptionType;
  placeholder?: string;
  label?: string;
  onEncrypt?: (encrypted: EncryptedValue, originalValue: string) => void;
  onError?: (error: Error) => void;
  buttonText?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

/**
 * EncryptInput Component
 * Pre-built component for encrypting user input
 */
export function EncryptInput({
  type = 'uint64',
  placeholder = 'Enter value to encrypt',
  label,
  onEncrypt,
  onError,
  buttonText = 'Encrypt',
  className = '',
  inputClassName = '',
  buttonClassName = '',
}: EncryptInputProps) {
  const [value, setValue] = useState('');
  const { encrypt, encrypting, error } = useEncrypt();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!value) {
      return;
    }

    try {
      // Convert value based on type
      let numericValue: number | boolean | bigint;

      if (type === 'bool') {
        numericValue = value.toLowerCase() === 'true' || value === '1';
      } else if (
        type === 'uint128' ||
        type === 'uint256' ||
        type === 'address' ||
        type === 'bytes' ||
        type === 'bytes256'
      ) {
        numericValue = BigInt(value);
      } else {
        numericValue = Number(value);
      }

      const encrypted = await encrypt(numericValue, type);

      if (onEncrypt) {
        onEncrypt(encrypted, value);
      }

      // Clear input after successful encryption
      setValue('');
    } catch (err) {
      if (onError) {
        onError(err as Error);
      }
    }
  };

  return (
    <div className={className}>
      {label && <label style={{ display: 'block', marginBottom: '8px' }}>{label}</label>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={encrypting}
          className={inputClassName}
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          disabled={encrypting || !value}
          className={buttonClassName}
          style={{
            padding: '8px 16px',
            backgroundColor: encrypting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: encrypting ? 'not-allowed' : 'pointer',
          }}
        >
          {encrypting ? 'Encrypting...' : buttonText}
        </button>
      </form>
      {error && (
        <div style={{ marginTop: '8px', color: 'red', fontSize: '14px' }}>
          Error: {error.message}
        </div>
      )}
    </div>
  );
}
