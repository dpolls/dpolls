/**
 * Application Configuration
 * 
 * This file contains all application settings and constants.
 */

// Network Configuration
export const NERO_CHAIN_CONFIG = {
  chainId: 2052,
  name: 'Nerochain',
  rpcUrl: 'https://testnet.nerochain.io',
  blockExplorerUrl: 'https://testnet.neroscan.io',
  isTestnet: true,
  nativeCurrency: {
    name: 'Nero',
    symbol: 'NERO',
    decimals: 18,
  },
};

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  nftContract: '0xa919E465871871f2D1da94bcCaf3ACAF9609D968',
  testToken: '0x4445c4bc4967F63F95616d98a45bD53d4dcC534a',
  paymaster: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
};

// AA Platform Configuration
export const AA_PLATFORM_CONFIG = {
  paymasterBaseUrl: 'https://paymaster-testnet.nerochain.io',
  apiBaseUrl: 'https://api-testnet.nerochain.io',
};

// NFT Configuration
export const SAMPLE_NFT_METADATA = 'https://ipfs.io/ipfs/QmTgqnhFBMkfT9s8PHKcdXBn1f5bG3Q5hmBaR4U6hoTvb1';

// API Key Configuration
const LOCAL_STORAGE_API_KEY = 'nero_aa_tutorial_apikey';
export let API_KEY = '';

// Initialize API key from local storage
export const initApiKey = () => {
  const storedApiKey = localStorage.getItem(LOCAL_STORAGE_API_KEY);
  if (storedApiKey) {
    API_KEY = storedApiKey;
    return storedApiKey;
  }
  return '';
};

// Set API key and save to local storage
export const setApiKey = (apiKey: string) => {
  API_KEY = apiKey;
  localStorage.setItem(LOCAL_STORAGE_API_KEY, apiKey);
};

// Clear API key
export const clearApiKey = () => {
  API_KEY = '';
  localStorage.removeItem(LOCAL_STORAGE_API_KEY);
};

// Performance Optimizations
export const API_OPTIMIZATION = {
  cacheTimeoutMs: 60000, // 1 minute
  lazyLoadTokens: true,
  debugLogs: false,
  maxConcurrentRequests: 3,
};

// Gas Configuration
export const getGasParameters = (multiplier = 100) => {
  const baseGasPrice = BigInt('500000000000'); // 500 gwei
  const adjustedGasPrice = (baseGasPrice * BigInt(multiplier)) / BigInt(100);
  
  return {
    maxFeePerGas: adjustedGasPrice,
    maxPriorityFeePerGas: adjustedGasPrice,
  };
}; 