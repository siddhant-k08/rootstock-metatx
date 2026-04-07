# Sponsored Transactions on Rootstock

A complete implementation of gasless transactions on Rootstock using the EIP-2771 trusted forwarder pattern. This project demonstrates how to enable users to interact with smart contracts without needing to hold native tokens for gas fees.

## 🌟 Overview

This repository contains a full-stack implementation of meta-transactions on Rootstock, including:

- **Smart Contracts**: EIP-2771 compatible contracts using OpenZeppelin's audited implementations
- **Relayer Service**: Node.js backend that validates signatures and submits transactions
- **Frontend Demo**: Web interface with MetaMask integration for gasless interactions
- **Comprehensive Tests**: Full test coverage for the meta-transaction flow

## 🏗️ Architecture

The system consists of four primary components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Wallet   │    │   Frontend      │    │   Relayer       │    │   Blockchain    │
│   (MetaMask)    │───▶│   Application   │───▶│   Service       │───▶│   Layer         │
│                 │    │                 │    │                 │    │                 │
│ • Signs EIP-712 │    │ • Prepares tx   │    │ • Validates     │    │ • MinimalForwarder│
│ • No gas needed │    │ • Requests sig  │    │ • Pays gas      │    │ • Recipient     │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **User Wallet** | Signs EIP-712 typed data; never submits transactions directly |
| **Frontend** | Prepares transaction data; requests signature; sends to relayer |
| **Relayer** | Validates signatures; submits transactions; pays gas fees |
| **MinimalForwarder** | Verifies signatures on-chain; enforces nonce; forwards calls |
| **Recipient Contract** | Trusts forwarder; uses `_msgSender()`; executes business logic |

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Rootstock Testnet RBTC (from [faucet](https://faucet.rootstock.io/))

### 1. Clone and Install

```bash
git clone https://github.com/siddhant-k08/rootstock-metatx.git
cd rootstock-metatx
npm install
cd relayer && npm install && cd ..
```

### 2. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
# Deployer wallet (for contract deployment)
DEPLOYER_PRIVATE_KEY=your_deployer_private_key

# Relayer wallet (for paying gas fees)
RELAYER_PRIVATE_KEY=your_relayer_private_key

# Rootstock Testnet RPC
ROOTSTOCK_RPC_URL=https://rpc.testnet.rootstock.io/your_api_key

# Contract addresses (filled after deployment)
FORWARDER_ADDRESS=
RECIPIENT_ADDRESS=

# Relayer service
RELAYER_PORT=3001
```

**⚠️ Important**: Never commit private keys to version control. The `.env` file is already included in `.gitignore`.

### 3. Deploy Smart Contracts

```bash
npx hardhat ignition deploy ignition/modules/ExampleRecipient.ts --network rootstockTestnet
```

After deployment, update your `.env` file with the deployed contract addresses.

### 4. Fund Relayer Wallet

Get your relayer wallet address:

```bash
node -e "require('dotenv').config(); console.log(new (require('ethers').Wallet)(process.env.RELAYER_PRIVATE_KEY).address)"
```

Visit [Rootstock Testnet Faucet](https://faucet.rootstock.io/) to fund the relayer wallet with tRBTC.

### 5. Start the Services

**Terminal 1 - Start Relayer:**
```bash
cd relayer
npm install
node server.ts
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npx serve .
```

### 6. Use the Application

1. Open `http://localhost:3000` in your browser
2. Connect MetaMask (ensure Rootstock Testnet is selected)
3. Click "Increment (Gasless)" to execute a transaction without paying gas!

## 📁 Project Structure

```
rootstock-metatx/
├── contracts/                 # Smart contracts
├── ignition/modules/          # Deployment scripts
├── relayer/                   # Backend relayer service
├── frontend/                  # Web frontend
├── test/                      # Test suite
├── hardhat.config.ts          # Hardhat configuration
├── package.json               # Project dependencies
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npx hardhat test
```

The tests cover:
- Forwarder trust relationship
- EIP-712 signature verification
- Meta-transaction execution flow
- Nonce management
- Error handling

## 🔧 Development

### Smart Contracts

The contracts use OpenZeppelin's audited EIP-2771 implementations:

- **ERC2771Context**: Provides `_msgSender()` functionality
- **MinimalForwarder**: Verifies signatures and forwards calls

Key patterns:
- Always use `_msgSender()` instead of `msg.sender` in meta-transaction enabled functions
- The trusted forwarder is set at construction time and cannot be changed
- All signature verification happens on-chain for security

### Relayer Service

The relayer service provides three main endpoints:

- `POST /relay`: Execute meta-transactions
- `GET /nonce/{address}`: Get current nonce for an address
- `GET /health`: Check relayer status and balance

Security features:
- Off-chain signature verification before submission
- Balance monitoring and insufficient funds handling
- Rate limiting capabilities (ready for production)

### Frontend Integration

The frontend demonstrates:
- EIP-712 typed data signing with MetaMask
- Proper domain verification for security
- Error handling and user feedback
- Network switching to Rootstock Testnet

## 🌐 Network Configuration

### Rootstock Testnet (Default)

| Parameter | Value |
|-----------|-------|
| Chain ID | 31 |
| RPC URL | `https://rpc.testnet.rootstock.io` |
| Explorer | `https://explorer.testnet.rootstock.io` |
| Currency | tRBTC |

### Mainnet Deployment

For production deployment on Rootstock Mainnet:

1. Update `hardhat.config.ts` with mainnet configuration
2. Deploy fresh contracts to mainnet
3. Fund relayer with real RBTC
4. Update frontend configuration with mainnet addresses
5. Implement additional security measures (rate limiting, monitoring)

## 🔒 Security Considerations

### Smart Contract Security

- ✅ Uses audited OpenZeppelin implementations
- ✅ Immutable trusted forwarder configuration
- ✅ Proper `_msgSender()` usage throughout
- ✅ Comprehensive test coverage

### Relayer Security

- ✅ Off-chain signature verification
- ✅ Balance monitoring and alerts
- ✅ Nonce management to prevent replay attacks
- ⚠️ **Production**: Implement rate limiting and monitoring

### Frontend Security

- ✅ EIP-712 domain verification
- ✅ Request parameter validation
- ✅ Proper error handling
- ✅ Network validation

## 📖 Learning Resources

This repository accompanies the comprehensive tutorial: [Sponsored Transactions on Rootstock](<PLACEHOLDER_FOR_BLOG_LINK>) // TODO: Replace with actual blog link

**Additional Resources:**
- [EIP-2771 Specification](https://eips.ethereum.org/EIPS/eip-2771)
- [OpenZeppelin Metatx Documentation](https://docs.openzeppelin.com/contracts/4.x/api/metatx)
- [Rootstock Developer Portal](https://dev.rootstock.io/)
- [Rootstock Testnet Faucet](https://faucet.rootstock.io/)

## 🚨 Production Considerations

**This implementation is intended for educational and testing purposes.** For production use, consider:

1. **Relayer Management**
   - Implement automated balance monitoring and refilling
   - Use hardware wallets or secure key management
   - Set up multi-signature controls for critical operations

2. **Security Hardening**
   - Add rate limiting per address
   - Implement allowlisting for permitted functions
   - Set up circuit breakers for unusual activity
   - Add comprehensive logging and monitoring

3. **Operational Concerns**
   - Implement health checks and alerting
   - Set up transaction monitoring and failure recovery
   - Consider multiple relayer instances for redundancy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## ⚠️ Disclaimer

This software is provided "as-is" for educational and demonstration purposes. Users should conduct their own security audits and testing before using in production environments. The authors are not responsible for any financial losses or security vulnerabilities.

---

**Built with ❤️ for the Rootstock ecosystem**