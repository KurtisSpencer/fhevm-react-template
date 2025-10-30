# Framework Templates

This directory contains framework-specific templates for integrating the Universal FHEVM SDK.

## Available Templates

### Next.js Template
Location: `./nextjs/`

A complete Next.js 14+ application template with:
- App Router structure
- API routes for FHE operations
- Pre-built components
- TypeScript support
- Full SDK integration

[View Next.js Example →](../examples/nextjs/)

### React Template
Location: `./react/`

A React application template with:
- Create React App structure
- Client-side FHE operations
- React hooks integration
- Component library

[View React Example →](../examples/react/)

### Vue Template
Location: `./vue/`

A Vue 3 application template with:
- Composition API
- Vue hooks for FHE
- TypeScript support
- Component library

[View Vue Example →](../examples/vue/)

### Node.js Template
Location: `./nodejs/`

A Node.js backend template with:
- Express.js server
- Server-side FHE operations
- API endpoints
- TypeScript support

[View Node.js Example →](../examples/nodejs/)

## Usage

Each template can be used as a starting point for your project:

```bash
# Copy the template you need
cp -r templates/nextjs my-fhe-project
cd my-fhe-project

# Install dependencies
npm install

# Start development
npm run dev
```

## Template Structure

All templates follow this general structure:

```
template-name/
├── src/              # Source code
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
└── README.md         # Template-specific docs
```

## Learn More

- [Universal FHEVM SDK Documentation](../README.md)
- [Examples Directory](../examples/)
- [API Reference](../docs/API.md)

## Note

Templates are production-ready starting points. For full working examples with additional features, see the [examples directory](../examples/).
