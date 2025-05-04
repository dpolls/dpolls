# NERO Chain DApp Samples

This repository contains a collection of proof-of-concept (PoC) applications built on NERO Chain, showcasing various blockchain functionalities and features with a focus on Account Abstraction (AA).

## Overview

NERO Chain is a blockchain platform that offers powerful features for developers, including Account Abstraction, Paymasters, and more. This repository serves as a learning resource and reference implementation for developers interested in building on NERO Chain.

## Applications

### 1. NERO Account Abstraction (AA) Tutorial

A demonstration of NERO Chain's Account Abstraction capabilities, allowing users to:
- Create smart contract wallets (AA wallets)
- Use the NERO Paymaster to sponsor gas fees
- Pay gas fees with ERC20 tokens
- Mint NFTs through UserOperations

### 2. NERO Wallet Example With Functionalities
A demo of how to use the Nero Wallet in your application. Three features in this example
- Mint NFT
- Create a ERC20 Token (pump fun like)
- Retrieve NFTs from user (NFT Gallery)

### 2. Future Applications

Additional applications will be added to showcase:
- DeFi protocols on NERO Chain
- Cross-chain interactions
- Governance mechanisms
- Advanced AA use cases
- And more

## Key Features Demonstrated

- **Account Abstraction**: Smart contract wallets with enhanced functionality
- **Paymaster Integration**: Gas sponsorship and alternative payment methods
- **ERC-4337 Compliance**: Following industry standards for AA
- **User-Friendly Onboarding**: Simplifying user experience with NERO Chain
- **Smart Contract Interactions**: Examples of various contract interactions

## Getting Started

Each application in this repository has its own README and setup instructions. Navigate to the specific application directory for detailed instructions.

```bash
# Example: To run the AA tutorial
cd nero-aa-tutorial
npm install
npm start
```

## Prerequisites

- Node.js (>= 14.x)
- npm or yarn
- MetaMask or another web3 wallet
- Basic knowledge of blockchain development

## NERO Chain Resources

- [NERO Chain Documentation](https://docs.nerochain.io/)
- [NERO AA Platform](https://aa-platform.nerochain.io/)
- [NERO Chain Explorer](https://testnet.neroscan.io/)

## Technical Architecture

Applications in this repository demonstrate NERO Chain's architecture, which includes:

1. **EntryPoint Contract**: The universal entry point for UserOperations
2. **UserOperation**: Data structure for smart contract wallet transactions
3. **Bundler**: Service that collects and submits UserOperations
4. **Paymaster**: Service that handles gas payments and sponsorship
5. **AA Wallet**: Smart contract wallet controlled by the user

## Contributing

Contributions are welcome! If you have ideas for new sample applications or improvements to existing ones, please submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
