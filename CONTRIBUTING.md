# Contributing to Universal FHEVM SDK

Thank you for your interest in contributing to the Universal FHEVM SDK! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:
- Be respectful and considerate
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
```bash
git clone https://github.com/your-username/fhevm-universal-sdk.git
cd fhevm-universal-sdk
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/original-org/fhevm-universal-sdk.git
```

### Install Dependencies

```bash
npm install
```

### Build the SDK

```bash
cd packages/fhevm-sdk
npm run build
```

### Run Examples

```bash
# Next.js example
cd examples/nextjs
npm install
npm run dev
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards (below)
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run SDK tests
cd packages/fhevm-sdk
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add new encryption type support"
git commit -m "fix: resolve decryption timeout issue"
git commit -m "docs: update API reference"
```

Commit types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Provide complete type definitions
- Use interfaces for public APIs

**Good:**
```typescript
export interface EncryptOptions {
  type?: EncryptionType;
  contractAddress?: string;
}

export async function encryptValue(
  instance: FhevmInstance,
  value: number,
  options?: EncryptOptions
): Promise<EncryptedValue> {
  // Implementation
}
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 100 characters
- Use meaningful variable names

**Good:**
```typescript
const encryptedValue = await encrypt(42, 'uint64');
```

**Bad:**
```typescript
const ev=await encrypt(42,'uint64')
```

### React Components

- Use functional components
- Use hooks instead of class components
- Extract complex logic into custom hooks
- Provide prop types

**Good:**
```typescript
interface Props {
  value: number;
  onEncrypt: (encrypted: EncryptedValue) => void;
}

export function EncryptButton({ value, onEncrypt }: Props) {
  const { encrypt } = useEncrypt();
  // Component logic
}
```

### Documentation

- Document all public APIs
- Use JSDoc comments
- Provide examples
- Keep README updated

**Good:**
```typescript
/**
 * Encrypts a value using FHEVM instance
 * @param instance - FHEVM instance
 * @param value - Value to encrypt
 * @param type - Encryption type
 * @returns Encrypted value with handles
 * @example
 * const encrypted = await encryptValue(instance, 42, 'uint64');
 */
export async function encryptValue(
  instance: FhevmInstance,
  value: number,
  type: EncryptionType
): Promise<EncryptedValue> {
  // Implementation
}
```

### Testing

- Write tests for new features
- Maintain test coverage > 80%
- Use descriptive test names
- Test edge cases

**Good:**
```typescript
describe('encryptValue', () => {
  it('should encrypt uint64 values correctly', async () => {
    const encrypted = await encryptValue(instance, 42, 'uint64');
    expect(encrypted.handles).toHaveLength(1);
  });

  it('should throw error for invalid type', async () => {
    await expect(
      encryptValue(instance, 42, 'invalid' as EncryptionType)
    ).rejects.toThrow();
  });
});
```

## Pull Request Process

### Before Submitting

- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (for notable changes)
- [ ] No merge conflicts with main branch

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**: CI/CD must pass
2. **Code Review**: At least one maintainer review
3. **Testing**: Changes tested in examples
4. **Documentation**: Updated if needed
5. **Approval**: Maintainer approval required

### After Approval

- Squash commits if needed
- Ensure clean commit history
- Maintainer will merge

## Reporting Issues

### Bug Reports

Include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment (Node version, OS, etc.)
- Code samples if applicable

**Template:**
```markdown
**Describe the bug**
Clear description

**To Reproduce**
1. Step 1
2. Step 2
3. See error

**Expected behavior**
What should happen

**Environment**
- Node version: 18.0.0
- OS: Windows 11
- SDK version: 1.0.0

**Additional context**
Any other information
```

### Feature Requests

Include:
- Clear title and description
- Use case and motivation
- Proposed solution (if any)
- Alternatives considered

## Development Tips

### Hot Reloading

```bash
# SDK with watch mode
cd packages/fhevm-sdk
npm run dev

# In another terminal, run example
cd examples/nextjs
npm run dev
```

### Debugging

- Use `console.log` for quick debugging
- Use VS Code debugger for complex issues
- Check browser console for frontend issues

### Performance

- Minimize re-renders in React components
- Use memoization where appropriate
- Profile before optimizing

### Security

- Never commit private keys or secrets
- Validate all inputs
- Follow security best practices
- Report security issues privately

## Community

### Getting Help

- GitHub Discussions for questions
- GitHub Issues for bugs
- Discord for community chat

### Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Thanked in the community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing!** 🎉

Your contributions help make privacy-preserving dApps accessible to everyone.
