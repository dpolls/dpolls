import { ethers } from 'ethers';

/**
 * Enum for payment types
 */
export enum PaymentType {
  Sponsored = 0,  // Free sponsored transaction
  Prepay = 1,     // Pay for gas before execution
  Postpay = 2     // Pay for gas after execution
}

/**
 * Interface for wallet connection state
 */
export interface WalletConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  userAddress: string;
  aaWalletAddress: string;
  signer: ethers.Signer | null;
  EOAProvider?: ethers.providers.Web3Provider;
  eoaAddress?: string;
  smartAccount?: any;
  address?: string;
}

/**
 * Interface for gas price information
 */
export interface GasPriceInfo {
  gasPrice: string;
  gasPriceGwei: string;
  lastUpdated: Date;
  isLoading: boolean;
}

/**
 * Interface for NFT object
 */
export interface NFT {
  tokenId: string;
  tokenURI: string;
} 