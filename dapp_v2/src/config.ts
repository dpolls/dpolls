// Default configurations for the application

// Nerochain Configuration
export const NERO_CHAIN_CONFIG = {
  chainId: 689,
  chainName: "NERO Chain Testnet",
  rpcUrl: "https://rpc-testnet.nerochain.io",
  currency: "NERO",
  explorer: "https://testnet.neroscan.io"
};

// Account Abstraction Platform Configuration
export const AA_PLATFORM_CONFIG = {
  platformUrl: "https://aa-platform.nerochain.io/",
  platformApiUrl: "https://api-aa-platform.nerochain.io/",
  paymasterRpc: "https://paymaster-testnet.nerochain.io",
  bundlerRpc: "https://bundler.service.nerochain.io",
  priceServiceUrl: "https://price-service.nerochain.io"
};

// Contract addresses
export const CONTRACT_ADDRESSES = {
  paymaster: "0x5a6680dFd4a77FEea0A7be291147768EaA2414ad",
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  accountFactory: "0x9406Cc6185a346906296840746125a0E44976454",
  multiCall: "0x343A0DdD8e58bEaf29d69936c82F1516C6677B0E",
  // This would be your deployed NFT contract address
  nftContract: "0x63f1f7c6a24294a874d7c8ea289e4624f84b48cb", // Replace with your deployed contract address
  dpollsContract: "0x84De6C2a1728F5723530089FD35366649468E511", // Replace with your deployed contract address
  testTokenContract: "0xA919e465871871F2D1da94BccAF3acaF9609D968" // TestToken contract address
};

// ERC20 Token Addresses (for testing)
export const ERC20_ADDRESSES = {
  dai: "0x5d0E342cCD1aD86a16BfBa26f404486940DBE345",
  usdt: "0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74",
  usdc: "0xC86Fed58edF0981e927160C50ecB8a8B05B32fed",
  testToken: "0xA919e465871871F2D1da94BccAF3acaF9609D968"
};

// Sample NFT Metadata URI - This could be a real IPFS link in production
export const SAMPLE_NFT_METADATA = "https://ipfs.io/ipfs/QmTgqnhFBMkfT9s8PHKcdXBn1f5bG3Q5hmBaR4U6hoTvb1";

// AA Platform API Key (will be set dynamically in the app)
export let API_KEY: string = "";

// API Optimization settings to reduce call volume
export const API_OPTIMIZATION = {
  // Cache SupportedTokens calls for this many milliseconds
  tokenCacheTime: 30000, // 30 seconds
  
  // Only load tokens when payment type requires them
  lazyLoadTokens: true,
  
  // Limit getSupportedTokens calls per session
  maxTokenRefreshes: 5,
  
  // Enable/disable API caching globally
  enableCaching: true,
  
  // Debug logging for API calls
  debugLogs: true
};

// Gas parameters configuration
// These values will be used for all UserOperations
export const GAS_CONFIG = {
  // Default gas limits for operations
  callGasLimit: "0x88b8",               // Gas limit for the main execution call
  verificationGasLimit: "0x33450",      // Gas limit for the verification part of execution
  preVerificationGas: "0xc350",         // Gas to compensate bundler for verification costs
  
  // Default gas pricing
  maxFeePerGas: "0x2162553062",         // Maximum fee per gas (total fee willing to pay)
  maxPriorityFeePerGas: "0x40dbcf36",   // Maximum priority fee (tip for miners/validators)
  
  // Fee multipliers - used to adjust fees based on network conditions
  // Values represent percentages (100 = normal, 200 = double, etc.)
  feeMultiplier: 100,
  priorityFeeMultiplier: 100
};

// Set API key - can be called at app initialization or runtime
export const setApiKey = (key: string) => {
  API_KEY = key;
  
  // Optionally store in localStorage for persistence across page reloads
  localStorage.setItem('nerochain_api_key', key);
};

// Initialize API key from localStorage if available
export const initApiKey = () => {
  const savedApiKey = localStorage.getItem('nerochain_api_key');
  if (savedApiKey) {
    API_KEY = savedApiKey;
    return true;
  }
  return false;
};

// Get current gas parameters with optional multipliers
export const getGasParameters = (options?: {
  feeMultiplier?: number;
  priorityFeeMultiplier?: number;
}) => {
  const feeMultiplier = options?.feeMultiplier || GAS_CONFIG.feeMultiplier;
  const priorityFeeMultiplier = options?.priorityFeeMultiplier || GAS_CONFIG.priorityFeeMultiplier;
  
  // Apply multipliers if they differ from 100%
  let maxFeePerGas = GAS_CONFIG.maxFeePerGas;
  let maxPriorityFeePerGas = GAS_CONFIG.maxPriorityFeePerGas;
  
  if (feeMultiplier !== 100) {
    // Remove 0x prefix, convert to number, apply multiplier, convert back to hex
    const feeValue = parseInt(GAS_CONFIG.maxFeePerGas.substring(2), 16);
    const adjustedFee = Math.floor(feeValue * (feeMultiplier / 100));
    maxFeePerGas = "0x" + adjustedFee.toString(16);
  }
  
  if (priorityFeeMultiplier !== 100) {
    const priorityFeeValue = parseInt(GAS_CONFIG.maxPriorityFeePerGas.substring(2), 16);
    const adjustedPriorityFee = Math.floor(priorityFeeValue * (priorityFeeMultiplier / 100));
    maxPriorityFeePerGas = "0x" + adjustedPriorityFee.toString(16);
  }
  
  return {
    callGasLimit: GAS_CONFIG.callGasLimit,
    verificationGasLimit: GAS_CONFIG.verificationGasLimit,
    preVerificationGas: GAS_CONFIG.preVerificationGas,
    maxFeePerGas,
    maxPriorityFeePerGas
  };
}; 