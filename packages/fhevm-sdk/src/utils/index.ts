// Utility functions for FHEVM SDK

/**
 * Validates an Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates encryption type
 */
export function isValidEncryptionType(type: string): boolean {
  const validTypes = [
    "uint8",
    "uint16",
    "uint32",
    "uint64",
    "uint128",
    "address",
    "bool",
  ];
  return validTypes.includes(type);
}

/**
 * Formats a value for display
 */
export function formatValue(value: unknown): string {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return String(value);
}

/**
 * Converts a value to the appropriate type for encryption
 */
export function normalizeValue(
  value: unknown,
  type: string
): number | bigint | boolean | string {
  switch (type) {
    case "uint8":
    case "uint16":
    case "uint32":
      return Number(value);
    case "uint64":
    case "uint128":
      return BigInt(value as string | number | bigint);
    case "bool":
      return Boolean(value);
    case "address":
      return String(value);
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await sleep(delayMs * Math.pow(2, attempt - 1));
      }
    }
  }

  throw lastError;
}

/**
 * Truncates an address for display
 */
export function truncateAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!isValidAddress(address)) {
    return address;
  }
  return `${address.substring(0, startChars)}...${address.substring(
    address.length - endChars
  )}`;
}
