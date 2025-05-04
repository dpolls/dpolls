# Nerochain Paymaster & Account Abstraction Tutorial

This document provides a step-by-step guide to understanding and implementing Account Abstraction (AA) with Nerochain's Paymaster platform. 

## What is Account Abstraction?

Account Abstraction (AA) is a paradigm shift in how blockchain accounts work. Traditional Ethereum accounts come in two types:
1. **Externally Owned Accounts (EOAs)** - Controlled by private keys
2. **Contract Accounts** - Smart contracts controlled by code

Account Abstraction aims to blur the line between these types, giving users more flexibility by:
- Allowing smart contracts to initiate transactions
- Enabling custom verification logic (e.g., multisig, social recovery)
- Separating the account that pays gas from the account that signs transactions
- Supporting gas sponsorship and alternative payment methods

## Nerochain's AA Architecture

Nerochain implements Account Abstraction based on the ERC-4337 standard with these key components:

1. **EntryPoint Contract**: The universal infrastructure contract that executes all UserOperations.
2. **UserOperation**: A data structure representing an action to be performed on behalf of a user.
3. **Bundler**: A service that collects UserOperations and submits them as regular transactions.
4. **Paymaster**: A service that can sponsor gas fees or accept alternative payment methods.
5. **AA Wallet**: A smart contract wallet that can be controlled by the user through UserOperations.

## Tutorial Steps

This tutorial will walk you through:

1. Creating an AA wallet
2. Getting an API key from the Nero AA Platform
3. Minting an NFT through the AA wallet
4. Using different payment types for gas

### Step 1: Understanding the UserOperation Flow

Before we dive into the code, let's understand the flow of a UserOperation:

1. The user creates a UserOperation, which includes:
   - Sender (AA wallet address)
   - CallData (function call to be executed)
   - Gas parameters
   - Signature

2. The UserOperation is sent to the Bundler, which:
   - Verifies the UserOperation
   - Batches multiple UserOperations
   - Submits them to the EntryPoint contract

3. If using a Paymaster, the UserOperation also includes:
   - PaymasterAndData (Paymaster address and verification data)
   - The Paymaster pays for gas or accepts alternative payment

4. The EntryPoint executes the UserOperation, which:
   - Calls the AA wallet with the CallData
   - The AA wallet executes the requested function (e.g., minting an NFT)

### Step 2: Setting Up the Nerochain AA Platform

To use the Nerochain Paymaster, you need to:

1. **Create a Team**:
   - Visit the [Nero AA Platform](https://aa-platform.nerochain.io/)
   - Click "Create a team"
   - Fill in the required information

2. **Create an API Key**:
   - Select "Nero Testnet Chain" from the dropdown
   - Click "Create ApiKey"
   - You might need to sign a transaction to register a bound wallet

3. **Configure Your Payment Settings**:
   - **ERC-20 Payment Configuration**: Choose which tokens to accept for gas payments
   - **Discount per Address Settings**: Set free usage limits for new addresses
   - **All Address Offers**: Configure free usage for all addresses
   - **Callback Configuration**: Define policies for sponsorship

4. **Fund Your Account**:
   - Add NERO to your account to sponsor gas fees
   - Monitor your balance in the "Payment Management" section

### Step 3: Implementing the Frontend

Our frontend implementation:

1. **Connects to a Wallet**: Using MetaMask or another web3 wallet
2. **Creates an AA Wallet**: Using Nerochain's SimpleAccount factory
3. **Configures the Paymaster**: Using your API key
4. **Mints an NFT**: Creating a UserOperation to mint an NFT

The key steps in the code:

#### Initializing the AA Client and Builder

```typescript
// Initialize AA Client
const client = await Client.init(NERO_CHAIN_CONFIG.rpcUrl, {
  overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
  entryPoint: CONTRACT_ADDRESSES.entryPoint,
});

// Initialize SimpleAccount Builder
const builder = await Presets.Builder.SimpleAccount.init(
  accountSigner,
  NERO_CHAIN_CONFIG.rpcUrl,
  {
    overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
    entryPoint: CONTRACT_ADDRESSES.entryPoint,
    factory: CONTRACT_ADDRESSES.accountFactory,
  }
);

// Set API key for paymaster
builder.setPaymasterOptions({
  apikey: API_KEY,
  rpc: AA_PLATFORM_CONFIG.paymasterRpc
});
```

#### Creating a UserOperation to Mint an NFT

```typescript
// Create NFT contract instance
const nftContract = new ethers.Contract(
  CONTRACT_ADDRESSES.nftContract,
  NeroNFTABI.abi,
  getProvider()
);

// Prepare the mint function call data
const callData = nftContract.interface.encodeFunctionData('mint', [
  recipientAddress,
  metadataUri
]);

// Set transaction data in the builder
builder.execute(CONTRACT_ADDRESSES.nftContract, 0, callData);
```

#### Setting the Payment Type

```typescript
// Set payment type (0: free, 1: prepay, 2: postpay)
builder.setPaymasterOptions({ type: paymentType });
```

#### Sending the UserOperation

```typescript
// Send the user operation
const res = await client.sendUserOperation(builder);
return res;
```

### Step 4: Understanding the Different Payment Types

Nerochain's Paymaster supports three payment types:

1. **Free Gas (type 0)**: The developer sponsors the gas fees, and users don't need to pay anything.
2. **Prepay ERC20 (type 1)**: During the verification phase, the system deducts the full ERC20 amount and returns the excess after execution.
3. **Postpay ERC20 (type 2)**: After the UserOperation is executed, the system deducts the ERC20 from the user.

### Step 5: Deploying Your NFT Contract

For this tutorial, we use a simple ERC-721 contract:

```solidity
// NeroNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NeroNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner) 
        ERC721("NeroNFT", "NERO") 
        Ownable(initialOwner) 
    {}

    // Anyone can mint an NFT (for demo purposes)
    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

To deploy this contract to Nerochain:
1. Use Remix or Hardhat to deploy
2. Replace the NFT contract address in the `config.ts` file

## Advanced Topics

### Webhooks for Custom Verification

Nerochain's AA Platform allows you to configure webhooks to verify UserOperations. This is useful for implementing custom business logic, such as:
- Rate limiting
- Whitelist/blacklist checks
- Custom payment rules

### Batch Transactions

You can execute multiple operations in a single UserOperation using `executeBatch`:

```typescript
const callData = [
  nftContract.interface.encodeFunctionData('mint', [recipient1, uri1]),
  nftContract.interface.encodeFunctionData('mint', [recipient2, uri2])
];
const callTo = [nftContract.address, nftContract.address];
builder.executeBatch(callTo, callData);
```

### Monitoring UserOperations

You can track your UserOperations through:
1. The bundler's events
2. The EntryPoint contract events
3. Nerochain's explorer: [https://testnet.neroscan.io](https://testnet.neroscan.io)

## Conclusion

Account Abstraction with Nerochain's Paymaster offers developers a powerful tool to enhance user experience by:
- Eliminating the need for users to have native tokens for gas
- Supporting alternative payment methods
- Enabling advanced transaction features
- Simplifying onboarding for new users

This tutorial demonstrated how to create a simple NFT minting application using these features. You can extend this example to build more complex applications with custom verification logic, batch transactions, and advanced payment strategies.

## Resources

- [Nerochain AA Documentation](https://docs.nerochain.io/en/aa/architecture)
- [Paymaster API Documentation](https://docs.nerochain.io/en/aa/paymaster/paymasterApi)
- [UserOp SDK Usage](https://docs.nerochain.io/en/aa/userOpSdkUsage)
- [AA Platform Usage](https://docs.nerochain.io/en/aa/aaPlatformUsageGuide) 