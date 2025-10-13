# Security & Performance Optimization Guide

This document outlines the security measures and performance optimizations implemented in the Anonymous Marathon Platform.

## Table of Contents

- [Security Measures](#security-measures)
- [Performance Optimizations](#performance-optimizations)
- [Toolchain Integration](#toolchain-integration)
- [Best Practices](#best-practices)
- [Security Audit Checklist](#security-audit-checklist)

## Security Measures

### 1. Solidity Security Linting

**Tool**: Solhint with security-focused rules

**Configuration**: `.solhint-security.json`

**Key Rules**:
- ✅ **Reentrancy Protection**: Detect reentrancy vulnerabilities
- ✅ **tx.origin Prevention**: Avoid using tx.origin
- ✅ **Send Result Checking**: Ensure send/transfer results are checked
- ✅ **Low-level Calls**: Warn about low-level calls
- ✅ **Complex Fallback**: Prevent complex fallback functions
- ✅ **Multiple Sends**: Detect multiple send operations

**Usage**:
```bash
# Run security-focused linting
npm run lint:sol:security

# Fix security issues (where auto-fixable)
npm run lint:sol:fix
```

**Security Checks**:
```solidity
// ✅ Good - Checks return value
(bool success, ) = recipient.call{value: amount}("");
require(success, "Transfer failed");

// ❌ Bad - Doesn't check return value
recipient.call{value: amount}("");

// ✅ Good - Uses msg.sender
require(msg.sender == owner, "Not owner");

// ❌ Bad - Uses tx.origin (phishing risk)
require(tx.origin == owner, "Not owner");
```

### 2. JavaScript Security Linting

**Tool**: ESLint with security plugin

**Configuration**: `.eslintrc.security.json`

**Key Features**:
- Detect unsafe regex patterns
- Prevent eval() usage
- Identify timing attack vectors
- Warn about object injection
- Check for CSRF vulnerabilities

**Usage**:
```bash
npm run lint:security
```

### 3. Dependency Auditing

**Automated Daily Scans**: Security workflow runs daily

**Manual Checks**:
```bash
# Run npm audit
npm run security:audit

# Check for outdated packages
npm outdated

# Full security check
npm run security:check
```

### 4. DoS (Denial of Service) Protection

**Strategies Implemented**:

#### Gas Limits
- Set reasonable gas limits for operations
- Avoid unbounded loops
- Use pagination for large datasets

```solidity
// ✅ Good - Bounded iteration
for (uint256 i = 0; i < MAX_BATCH_SIZE && i < items.length; i++) {
    process(items[i]);
}

// ❌ Bad - Unbounded loop
for (uint256 i = 0; i < participants.length; i++) {
    processParticipant(participants[i]);
}
```

#### Rate Limiting
- Configurable via `.env`:
  ```
  RATE_LIMIT_PER_HOUR=100
  MAX_TRANSACTION_VALUE=10
  ```

#### Testing
```bash
# Run DoS protection tests
npm run test:dos
```

### 5. Access Control

**Role-Based Permissions**:
- **Organizer**: Can create marathons, record times, complete events
- **Pauser**: Emergency pause functionality (if enabled)
- **Runners**: Can register and view information

**Configuration** (`.env`):
```env
PAUSER_ENABLED=true
PAUSER_ADDRESS=0x...
PAUSER_PRIVATE_KEY=...
```

### 6. Data Validation

**Input Sanitization**:
- Age validation
- Experience level bounds (1-10)
- Anonymous ID uniqueness
- Registration fee verification
- Date/time validation

**Example**:
```solidity
require(_experienceLevel >= 1 && _experienceLevel <= 10, "Experience level must be 1-10");
require(_anonymousId != bytes32(0), "Invalid anonymous ID");
require(msg.value >= registrationFee, "Insufficient registration fee");
```

### 7. Sensitive Data Protection

**Automated Checks**:
- CI/CD scans for hardcoded secrets
- Environment variable validation
- .gitignore enforcement

**Never Commit**:
- Private keys
- API keys
- Passwords
- Email addresses (in code)

## Performance Optimizations

### 1. Compiler Optimization

**Solidity Optimizer**:
```javascript
// hardhat.config.js
solidity: {
  version: "0.8.24",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,  // Balanced: deployment cost vs runtime cost
    },
    viaIR: true,  // Advanced optimization via Intermediate Representation
  },
}
```

**Optimization Runs**:
- **200 runs**: Balanced (default) - Good for contracts with moderate usage
- **1 runs**: Optimize for deployment cost
- **999999 runs**: Optimize for runtime gas cost

**Trade-offs**:
```
Low Runs (1-50)     → Cheaper deployment, Higher runtime gas
Medium Runs (200)   → Balanced
High Runs (1000+)   → Expensive deployment, Lower runtime gas
```

### 2. Gas Optimization

**Gas Reporter**:
```bash
# Run tests with gas reporting
npm run test:gas

# Compare gas usage
npm run gas:compare
```

**Output** (`gas-report.txt`):
```
·----------------------------------------|---------------------------|
|  Contract              ·  Method       ·  Gas Used  ·  Gas Price  │
·························|···············|············|··············
|  AnonymousMarathon     ·  create       ·   152,500  ·   2 gwei   │
|  AnonymousMarathon     ·  register     ·   182,500  ·   2 gwei   │
·----------------------------------------|---------------------------|
```

**Gas Optimization Techniques**:

#### Storage Optimization
```solidity
// ✅ Good - Pack variables
struct Marathon {
    uint32 maxParticipants;     // 4 bytes
    uint32 currentRegistrations; // 4 bytes
    bool isActive;              // 1 byte
    bool isCompleted;           // 1 byte
    // Total: 10 bytes (fits in 1 slot)
}

// ❌ Bad - Wastes storage
struct Marathon {
    uint256 maxParticipants;    // 32 bytes
    bool isActive;              // 32 bytes (separate slot)
    uint256 currentRegistrations; // 32 bytes
}
```

#### Memory vs Storage
```solidity
// ✅ Good - Use memory for temporary data
function processLeaderboard() internal {
    uint256[] memory tempArray = new uint256[](10);
    // Work with tempArray
}

// ❌ Bad - Use storage unnecessarily
uint256[] public tempArray;  // Expensive!
```

#### Avoid Redundant Operations
```solidity
// ✅ Good - Cache storage reads
Marathon storage marathon = marathons[id];
uint256 count = marathon.currentRegistrations;

// ❌ Bad - Multiple storage reads
require(marathons[id].currentRegistrations < marathons[id].maxParticipants);
```

### 3. Contract Size Optimization

**Size Checking**:
```bash
# Check contract sizes
npm run size-check
```

**Maximum Size**: 24KB (24,576 bytes)

**Size Reduction Strategies**:

#### Code Splitting
- Split large contracts into libraries
- Use minimal proxies for repeated deployments
- External function calls for complex logic

```solidity
// Library for complex operations
library MarathonLogic {
    function calculatePrizes(uint256 pool) external pure returns (uint256[3] memory) {
        // Complex logic here
    }
}

// Main contract uses library
contract AnonymousMarathon {
    function distributePrizes(uint256 marathonId) external {
        uint256[3] memory prizes = MarathonLogic.calculatePrizes(prizePool);
    }
}
```

#### Remove Dead Code
- Eliminate unused functions
- Remove debugging code
- Minimize error messages

### 4. Load Testing

**Purpose**: Test contract performance under high load

```bash
# Run load tests
npm run test:load
```

**Test Scenarios**:
- Multiple simultaneous registrations
- Batch operations
- Maximum participant capacity
- Concurrent transactions

### 5. Code Complexity Reduction

**Complexity Check**:
```bash
npm run complexity
```

**Maximum Complexity**: 10 (configurable)

**Simplification Techniques**:
- Extract complex logic into separate functions
- Use libraries for reusable code
- Simplify conditional logic
- Reduce nesting levels

```solidity
// ✅ Good - Simple, readable
function isEligible(address runner, uint256 marathonId) public view returns (bool) {
    if (!runners[marathonId][runner].hasRegistered) return false;
    if (runners[marathonId][runner].hasFinished) return false;
    return block.timestamp >= marathons[marathonId].eventDate;
}

// ❌ Bad - Complex, nested
function isEligible(address runner, uint256 marathonId) public view returns (bool) {
    return runners[marathonId][runner].hasRegistered &&
           !runners[marathonId][runner].hasFinished &&
           block.timestamp >= marathons[marathonId].eventDate;
}
```

## Toolchain Integration

### Complete Stack

```
┌─────────────────────────────────────────┐
│      Smart Contract Development        │
│  Hardhat + Solhint + Gas Reporter +    │
│  Optimizer + Contract Sizer             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        Frontend & Scripts               │
│  ESLint + ESLint Security + Prettier +  │
│  Code Splitting                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          CI/CD Pipeline                 │
│  Security Checks + Performance Tests +  │
│  Automated Audits + Gas Monitoring      │
└─────────────────────────────────────────┘
```

### Integrated Workflow

```bash
# 1. Pre-commit Checks (Automatic via Husky)
git commit -m "feat: add feature"
# → Runs: prettier:check, lint, lint:sol

# 2. Pre-push Checks (Automatic via Husky)
git push
# → Runs: test, security:check

# 3. CI/CD (Automatic on GitHub)
# → Runs: All tests, security audit, performance checks

# 4. Manual Quality Check
npm run format          # Format all code
npm run security:check  # Security audit
npm run test:gas        # Gas benchmarks
npm run size-check      # Contract sizes
```

## Best Practices

### Security Best Practices

1. **Keep Dependencies Updated**
   ```bash
   npm outdated
   npm update
   ```

2. **Regular Security Audits**
   - Run `npm run security:check` before each release
   - Review audit findings weekly
   - Fix high/critical issues immediately

3. **Access Control**
   - Use minimal permissions
   - Implement role-based access
   - Consider multi-sig for critical operations

4. **Input Validation**
   - Validate all external inputs
   - Use require() with descriptive errors
   - Check array bounds

5. **Error Handling**
   ```solidity
   // ✅ Good - Clear error messages
   require(msg.sender == organizer, "Only organizer can perform this action");

   // ❌ Bad - Generic errors
   require(msg.sender == organizer);
   ```

### Performance Best Practices

1. **Optimize Storage Access**
   - Cache storage reads in memory
   - Use memory for temporary data
   - Pack storage variables

2. **Minimize On-Chain Data**
   - Use events for historical data
   - Store minimal information on-chain
   - Consider off-chain storage for large data

3. **Batch Operations**
   ```solidity
   // ✅ Good - Batch processing
   function registerMultiple(bytes32[] calldata ids) external {
       for (uint i = 0; i < ids.length; i++) {
           _register(ids[i]);
       }
   }
   ```

4. **Gas-Efficient Patterns**
   - Use `calldata` for external function parameters
   - Prefer `external` over `public` for functions
   - Use `immutable` for constants set at deployment
   - Use `constant` for compile-time constants

5. **Monitoring**
   - Track gas usage trends
   - Monitor contract sizes
   - Review performance metrics regularly

## Security Audit Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Security linting clean
- [ ] No high/critical npm audit findings
- [ ] Gas usage optimized
- [ ] Contract size under 24KB
- [ ] Access control implemented
- [ ] Input validation complete
- [ ] Error handling robust
- [ ] Documentation complete

### Continuous Monitoring

- [ ] Daily dependency audits (automated)
- [ ] Weekly security reviews
- [ ] Monthly gas usage analysis
- [ ] Quarterly performance optimization
- [ ] Regular update cycles

### Incident Response

1. **Detection**: Automated monitoring
2. **Assessment**: Severity classification
3. **Response**: Emergency pause if needed
4. **Resolution**: Fix and deploy
5. **Review**: Post-mortem analysis

## Tools Reference

### Security Tools

| Tool | Purpose | Command |
|------|---------|---------|
| Solhint | Solidity linting | `npm run lint:sol` |
| Solhint Security | Security-focused linting | `npm run lint:sol:security` |
| ESLint Security | JavaScript security | `npm run lint:security` |
| npm audit | Dependency audit | `npm run security:audit` |
| Slither | Static analysis | Runs in CI/CD |

### Performance Tools

| Tool | Purpose | Command |
|------|---------|---------|
| Gas Reporter | Gas usage analysis | `npm run test:gas` |
| Contract Sizer | Size verification | `npm run size-check` |
| Complexity Checker | Code complexity | `npm run complexity` |
| Load Tester | Performance testing | `npm run test:load` |

### Automation Tools

| Tool | Purpose | When |
|------|---------|------|
| Husky | Pre-commit hooks | Every commit |
| Lint-staged | Staged file linting | Every commit |
| GitHub Actions | CI/CD pipeline | Every push/PR |
| Codecov | Coverage tracking | After tests |

## Conclusion

Security and performance are ongoing concerns. Regular audits, monitoring, and updates are essential for maintaining a secure and efficient smart contract platform.

**Remember**:
- Security is not a one-time task
- Performance optimization is continuous
- Automation reduces human error
- Regular reviews catch issues early

---

**Last Updated**: October 2024
**Version**: 1.0.0
