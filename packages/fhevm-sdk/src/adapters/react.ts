// React adapter for FHEVM SDK
// Re-exports React hooks and components for convenience

export { useFhevm } from "../react/useFhevm";
export { useEncrypt } from "../react/useEncrypt";
export { useDecrypt } from "../react/useDecrypt";

export { FhevmProvider } from "../components/FhevmProvider";
export { EncryptInput } from "../components/EncryptInput";
export { DecryptOutput } from "../components/DecryptOutput";

// Type re-exports
export type {
  FhevmConfig,
  FhevmInstance,
  EncryptionType,
  EncryptOptions,
  DecryptOptions,
} from "../types";
