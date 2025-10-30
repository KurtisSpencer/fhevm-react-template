# Vue Template for Universal FHEVM SDK

This template provides a starting point for building Vue 3 applications with the Universal FHEVM SDK.

## Quick Start

```bash
# Create a new Vue project
npm create vue@latest my-fhe-app

# Install the Universal FHEVM SDK
cd my-fhe-app
npm install @fhevm/universal-sdk ethers
```

## Minimal Setup

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createFhevmInstance, encryptValue } from '@fhevm/universal-sdk/core';

const ready = ref(false);
const instance = ref(null);

onMounted(async () => {
  instance.value = await createFhevmInstance({
    network: 'sepolia',
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
  });
  ready.value = true;
});

const handleEncrypt = async () => {
  if (!instance.value) return;
  const result = await encryptValue(instance.value, 42, 'uint64');
  console.log('Encrypted:', result);
};
</script>

<template>
  <div>
    <div v-if="!ready">Loading FHEVM...</div>
    <button v-else @click="handleEncrypt">Encrypt</button>
  </div>
</template>
```

## Features

- Vue 3 Composition API
- TypeScript support
- Reactive encryption state
- Framework-agnostic core

## Learn More

- [SDK Documentation](../../README.md)
- [API Reference](../../docs/API.md)
- [Next.js Example](../../examples/nextjs/)
