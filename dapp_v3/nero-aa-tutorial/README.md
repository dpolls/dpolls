# Nerochain Paymaster NFT Tutorial

This tutorial demonstrates how to use the Nerochain Paymaster platform for Account Abstraction to create a frontend application that mints NFTs with sponsored gas or ERC20 token payments.

## Overview

This project showcases the powerful capabilities of Nerochain's Account Abstraction platform, allowing developers to:

1. Create an AA wallet for users
2. Use the Nerochain Paymaster to sponsor gas fees
3. Allow users to pay gas fees with ERC20 tokens
4. Mint NFTs through UserOperations

## Prerequisites

- Node.js (>= 14.x)
- npm or yarn
- MetaMask or another web3 wallet
- An API key from the Nero AA Platform (https://aa-platform.nerochain.io/)

## Getting Started

Follow these steps to set up and run the project:

1. Clone this repository:
   ```
   git clone <repository-url>
   cd nero-aa-tutorial
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
   Note: If you encounter dependency conflicts, use:
   ```
   npm install --legacy-peer-deps
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## How It Works

This tutorial demonstrates the entire workflow for using Account Abstraction with the Nerochain Paymaster:

### Step 1: Connect Your Wallet

When you connect your wallet, the application creates an AA wallet address for you using Nerochain's SimpleAccount factory contract.

### Step 2: Set Your API Key

You'll need to get an API key from the [Nero AA Platform](https://aa-platform.nerochain.io/). This API key is used to authenticate requests to the Paymaster.

**To create an API key:**
1. Visit the [Nero AA Platform](https://aa-platform.nerochain.io/)
2. Create a team (if you don't have one already)
3. Select "Nero Testnet Chain" from the dropdown menu
4. Click "Create ApiKey"
5. Set your payment settings on the platform

### Step 3: Mint an NFT

Once your wallet is connected and API key is set, you can mint an NFT by:
1. Entering the recipient address (or use your own)
2. Selecting the payment type:
   - Free (Sponsored Gas)
   - Pre-pay with ERC20
   - Post-pay with ERC20
3. Clicking "Mint NFT"

The application will:
1. Create a UserOperation to mint the NFT
2. Sign the UserOperation with your wallet
3. Submit the UserOperation to the bundler through the Paymaster
4. Get a transaction hash once the operation is successful

## Integration Details

### Key Components

1. **Account Abstraction SDK**: Uses Nerochain's `aa-userop-sdk` to create and send UserOperations
2. **Paymaster Integration**: Connects to the Nerochain Paymaster for gas sponsorship or ERC20 payments
3. **NFT Contract**: Simple ERC-721 contract for minting NFTs

### Configuration

The application uses the Nerochain Testnet with the following configurations:

- Network: Nerochain Testnet (Chain ID: 689)
- EntryPoint: 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
- AccountFactory: 0x9406Cc6185a346906296840746125a0E44976454
- Paymaster: 0x5a6680dFd4a77FEea0A7be291147768EaA2414ad

## Learn More

- [Nerochain AA Documentation](https://docs.nerochain.io/en/aa/architecture)
- [Paymaster API Documentation](https://docs.nerochain.io/en/aa/paymaster/paymasterApi)
- [UserOp SDK Usage](https://docs.nerochain.io/en/aa/userOpSdkUsage)
- [AA Platform Usage](https://docs.nerochain.io/en/aa/aaPlatformUsageGuide)

## Troubleshooting

**Error: No Ethereum provider found**
- Make sure you have MetaMask or another web3 wallet installed and unlocked

**Error: Failed to load supported tokens**
- Verify that your API key is correct and has been properly set up on the AA Platform

**Error: Failed to mint NFT**
- Check that you have set up your API key correctly on the AA Platform
- Ensure you have selected the Nerochain Testnet network in your wallet
- Make sure the recipient address is valid

## License

This project is licensed under the MIT License - see the LICENSE file for details. 