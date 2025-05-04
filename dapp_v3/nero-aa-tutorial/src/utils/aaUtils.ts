import { ethers } from 'ethers';
import { Client, Presets } from 'userop';
import { 
  NERO_CHAIN_CONFIG, 
  AA_PLATFORM_CONFIG, 
  CONTRACT_ADDRESSES, 
  API_KEY,
  getGasParameters,
  API_OPTIMIZATION
} from '../config';
import NeroNFTABI from '../contracts/NeroNFT.json';

// Cache variables to prevent redundant initialization
let cachedClient: any = null;
let cachedBuilder: any = null;
let cachedWalletAddress: string | null = null;
let tokenRequestCount = 0;

// Cache for operation results to prevent duplicate transactions
const pendingOperations = new Map<string, Promise<any>>();

// Cache for API responses
const responseCache = new Map<string, {data: any, timestamp: number}>();

// Simple request throttling/debouncing utility
const throttledRequests = new Map<string, {timestamp: number, promise: Promise<any>}>();

// Cache for NFT data to avoid repeated fetching
const nftCache = new Map<string, {timestamp: number, data: any[]}>();
const NFT_CACHE_DURATION = 60000; // 1 minute cache

export const throttledRequest = async (key: string, requestFn: () => Promise<any>, timeWindow: number = 5000) => {
  const now = Date.now();
  const existing = throttledRequests.get(key);
  
  if (existing && now - existing.timestamp < timeWindow) {
    console.log(`Using cached request for ${key}`);
    // Return the cached promise if request was recent
    return existing.promise;
  }
  
  // Otherwise, make a new request
  console.log(`Making new request for ${key}`);
  const promise = requestFn();
  throttledRequests.set(key, { timestamp: now, promise });
  
  // Clean up after promise resolves
  promise.finally(() => {
    // Only clean if it's the same promise (not replaced by a newer one)
    if (throttledRequests.get(key)?.promise === promise) {
      setTimeout(() => {
        // Only delete if it's still the same promise
        if (throttledRequests.get(key)?.promise === promise) {
          throttledRequests.delete(key);
        }
      }, timeWindow);
    }
  });
  
  return promise;
};

// Generic ERC20 ABI for minting tokens
const ERC20_MINT_ABI = [
  "function mint(address to, uint256 amount) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)"
];

// Initialize Ethereum provider
export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(NERO_CHAIN_CONFIG.rpcUrl);
};

// Get a signer from user's wallet
export const getSigner = async () => {
  // Connect to the user's Ethereum provider (e.g., MetaMask)
  if (!window.ethereum) {
    throw new Error("No Ethereum provider found. Please install MetaMask or a compatible wallet.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

// Initialize Account Abstraction Client with caching
export const initAAClient = async (accountSigner: ethers.Signer) => {
  // Return cached client if available
  if (cachedClient && API_OPTIMIZATION.enableCaching) {
    console.log("Using cached AA client");
    return cachedClient;
  }
  
  console.log("Initializing new AA client");
  cachedClient = await Client.init(NERO_CHAIN_CONFIG.rpcUrl, {
    overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
    entryPoint: CONTRACT_ADDRESSES.entryPoint,
  });
  
  return cachedClient;
};

// Initialize SimpleAccount Builder with caching
export const initAABuilder = async (accountSigner: ethers.Signer, apiKey?: string) => {
  // Only rebuild if signer changes and caching is enabled
  if (API_OPTIMIZATION.enableCaching) {
    const signerAddress = await accountSigner.getAddress();
    if (cachedBuilder && cachedWalletAddress === signerAddress) {
      // Update API key if needed but don't reinitialize
      console.log("Using cached AA builder with updated API key");
      const currentApiKey = apiKey || API_KEY;
      cachedBuilder.setPaymasterOptions({
        apikey: currentApiKey,
        rpc: AA_PLATFORM_CONFIG.paymasterRpc,
        type: 0 // Default to free (sponsored gas)
      });
      return cachedBuilder;
    }
  }
  
  // Otherwise, create a new builder
  console.log("Initializing new AA builder");
  const builder = await Presets.Builder.SimpleAccount.init(
    accountSigner,
    NERO_CHAIN_CONFIG.rpcUrl,
    {
      overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
      entryPoint: CONTRACT_ADDRESSES.entryPoint,
      factory: CONTRACT_ADDRESSES.accountFactory,
    }
  );
  
  // Apply gas parameters from configuration
  const gasParams = getGasParameters();
  
  // Set API key for paymaster - use provided key, global API_KEY, or none
  const currentApiKey = apiKey || API_KEY;
  
  // Set paymaster options with API key and gas parameters
  builder.setPaymasterOptions({
    apikey: currentApiKey,
    rpc: AA_PLATFORM_CONFIG.paymasterRpc,
    type: 0 // Default to free (sponsored gas)
  });
  
  // Set gas parameters for the UserOperation
  builder.setCallGasLimit(gasParams.callGasLimit);
  builder.setVerificationGasLimit(gasParams.verificationGasLimit);
  builder.setPreVerificationGas(gasParams.preVerificationGas);
  builder.setMaxFeePerGas(gasParams.maxFeePerGas);
  builder.setMaxPriorityFeePerGas(gasParams.maxPriorityFeePerGas);
  
  // Update cache variables
  if (API_OPTIMIZATION.enableCaching) {
    cachedBuilder = builder;
    cachedWalletAddress = await accountSigner.getAddress();
  }
  
  return builder;
};

// Generate a unique operation key based on parameters
const generateOperationKey = (functionName: string, params: any[]) => {
  return `${functionName}-${JSON.stringify(params)}`;
};

// Get the AA wallet address with caching
export const getAAWalletAddress = async (accountSigner: ethers.Signer, apiKey?: string) => {
  // Check if we have a cached address for this signer
  if (API_OPTIMIZATION.enableCaching) {
    const signerAddress = await accountSigner.getAddress();
    if (cachedWalletAddress === signerAddress && cachedBuilder) {
      console.log("Using cached AA wallet address");
      return cachedBuilder.getSender();
    }
  }
  
  // Otherwise, get a fresh builder and address
  console.log("Getting fresh AA wallet address");
  const builder = await initAABuilder(accountSigner, apiKey);
  return builder.getSender();
};

// Set the payment type for the paymaster (0: free, 1: prepay, 2: postpay)
export const setPaymentType = (builder: any, paymentType: number, tokenAddress: string = '') => {
  const paymasterOptions: any = { 
    type: paymentType,
    apikey: API_KEY,
    rpc: AA_PLATFORM_CONFIG.paymasterRpc
  };
  
  // Add token address if ERC20 payment is selected
  if (paymentType > 0 && tokenAddress) {
    paymasterOptions.token = tokenAddress;
  }
  
  builder.setPaymasterOptions(paymasterOptions);
  return builder;
};

// Create a minimal UserOp for pm_supported_tokens
const createMinimalUserOp = (sender: string) => {
  // Create a minimal valid UserOp structure
  // Using simpler values that don't cause nonce validation errors
  return {
    sender: sender,
    nonce: "0x0", // Use 0x0 to avoid nonce issues
    initCode: "0x",
    callData: "0x",
    callGasLimit: "0x88b8",
    verificationGasLimit: "0x33450",
    preVerificationGas: "0xc350",
    maxFeePerGas: "0x2162553062",
    maxPriorityFeePerGas: "0x40dbcf36",
    paymasterAndData: "0x",
    signature: "0x"
  };
};

// Use the SDK's built-in method to get tokens
export const getSupportedTokensFromSDK = async (client: any, builder: any) => {
  try {
    if (API_OPTIMIZATION.debugLogs) console.log("Getting supported tokens using SDK");
    return await client.getSupportedTokens(builder);
  } catch (error) {
    console.error("Error getting supported tokens using SDK:", error);
    return { tokens: [] };
  }
};

// Transform the token response to a standardized format
const transformTokensResponse = (response: any) => {
  if (!response) return [];
  
  // Check for tokens array in the response
  let tokens = [];
  
  if (response.tokens && Array.isArray(response.tokens)) {
    tokens = response.tokens.map((token: any) => ({
      address: token.token,
      symbol: token.symbol,
      decimal: token.decimals,
      type: token.type === 'system' ? 1 : 2,
      price: token.price
    }));
  } else if (response.result && response.result.tokens && Array.isArray(response.result.tokens)) {
    tokens = response.result.tokens.map((token: any) => ({
      address: token.token,
      symbol: token.symbol,
      decimal: token.decimals,
      type: token.type === 'system' ? 1 : 2,
      price: token.price
    }));
  } else if (Array.isArray(response)) {
    tokens = response.map((token: any) => ({
      address: token.address || token.token,
      symbol: token.symbol,
      decimal: token.decimal || token.decimals,
      type: token.type || 1,
      price: token.price
    }));
  }
  
  if (API_OPTIMIZATION.debugLogs) {
    console.log("Transformed tokens response:", tokens);
  }
  
  return tokens;
};

// Get token balance
export const getTokenBalance = async (address: string, tokenAddress: string) => {
  try {
    // Expanded ERC20 ABI to cover more potential implementations
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function balanceOf(address) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)'
      ],
      getProvider()
    );
    
    // First check if the contract is deployed and responds
    const code = await getProvider().getCode(tokenAddress);
    if (code === '0x') {
      console.warn(`Token contract at ${tokenAddress} is not deployed`);
      return '0';
    }
    
    const balance = await tokenContract.balanceOf(address);
    let decimals = 18; // Default to 18 decimals
    
    try {
      decimals = await tokenContract.decimals();
    } catch (decimalErr) {
      console.warn(`Could not get decimals for token ${tokenAddress}, using default 18`);
    }
    
    return ethers.utils.formatUnits(balance, decimals);
  } catch (err) {
    console.error(`Error getting token balance for ${tokenAddress}:`, err);
    return '0';
  }
};

// Direct RPC call to pm_supported_tokens without building a full UserOperation
export const directGetSupportedTokens = async (sender: string, apiKey: string) => {
  try {
    // Create a provider connected to the paymaster RPC
    const provider = new ethers.providers.JsonRpcProvider(AA_PLATFORM_CONFIG.paymasterRpc);
    
    // Create minimal UserOp - avoid full UserOp creation that causes extra API calls
    const minimalUserOp = createMinimalUserOp(sender);
    
    // Make direct RPC call
    if (API_OPTIMIZATION.debugLogs) console.log("Making direct RPC call to pm_supported_tokens");
    
    const result = await provider.send("pm_supported_tokens", [
      minimalUserOp, 
      apiKey,
      CONTRACT_ADDRESSES.entryPoint
    ]);
    
    if (API_OPTIMIZATION.debugLogs) {
      console.log("Direct pm_supported_tokens response:", result);
    }
    
    return result;
  } catch (error) {
    console.error("Error in direct RPC call to pm_supported_tokens:", error);
    // Fall back to SDK method
    console.log("Falling back to SDK method for getting supported tokens");
    return null;
  }
};

// Get all token balances for a list of tokens
export const getAllTokenBalances = async (userAddress: string, tokens: any[]) => {
  const balances: { [key: string]: string } = {};
  
  // Process in parallel for efficiency
  await Promise.all(
    tokens.map(async (token) => {
      balances[token.address] = await getTokenBalance(userAddress, token.address);
    })
  );
  
  return balances;
};

// Get supported tokens with fallback and caching
export const getSupportedTokens = async (client: any, builder: any) => {
  // Check for token request limits
  if (tokenRequestCount >= API_OPTIMIZATION.maxTokenRefreshes) {
    console.log("Reached maximum token refresh limit, using cached data");
    // Try to use cached data
    const cacheKey = "supportedTokens";
    const cached = responseCache.get(cacheKey);
    if (cached) {
      return cached.data;
    }
    // If no cache, return empty array to avoid further calls
    return [];
  }
  
  tokenRequestCount++;
  
  // Get sender address
  const sender = await builder.getSender();
  
  // Use throttled request with a direct RPC call first, then fallback to SDK
  const key = `getSupportedTokens-${sender}`;
  return throttledRequest(key, async () => {
    // Check cache first
    const cacheKey = "supportedTokens";
    const cached = responseCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp < API_OPTIMIZATION.tokenCacheTime)) {
      console.log("Using cached supported tokens");
      return cached.data;
    }
    
    try {
      console.log("Fetching supported tokens from API");
      
      // Get API key
      const apiKeyToUse = builder.paymasterOptions.apikey || API_KEY;
      
      // Try direct method first
      let response = await directGetSupportedTokens(sender, apiKeyToUse);
      
      // If direct method fails, fall back to SDK method
      if (!response) {
        response = await getSupportedTokensFromSDK(client, builder);
      }
      
      // Transform response to standardized format
      const supportedTokens = transformTokensResponse(response);
      
      // Cache the result
      responseCache.set(cacheKey, {
        data: supportedTokens,
        timestamp: now
      });
      
      return supportedTokens;
    } catch (error) {
      console.error("Error getting supported tokens:", error);
      return [];
    }
  }, API_OPTIMIZATION.tokenCacheTime);
};

// Reset token request count (can be called when explicitly refreshing)
export const resetTokenRequestCount = () => {
  tokenRequestCount = 0;
};

// Apply gas price settings and other options to a builder
const applyBuilderSettings = (builder: any, paymentType: number = 0, selectedToken: string = '', options?: any) => {
  // Apply gas parameters
  const gasParams = options?.gasMultiplier ? 
    getGasParameters({ feeMultiplier: options.gasMultiplier }) : 
    getGasParameters();
  
  // Set payment type and token
  setPaymentType(builder, paymentType, selectedToken);
  
  // Apply gas parameters
  builder.setCallGasLimit(gasParams.callGasLimit);
  builder.setVerificationGasLimit(gasParams.verificationGasLimit);
  builder.setPreVerificationGas(gasParams.preVerificationGas);
  builder.setMaxFeePerGas(gasParams.maxFeePerGas);
  builder.setMaxPriorityFeePerGas(gasParams.maxPriorityFeePerGas);
  
  return builder;
};

// Generic operation executor to avoid duplicate code and API calls
const executeOperation = async (
  operationKey: string,
  accountSigner: ethers.Signer,
  executeFn: (client: any, builder: any) => Promise<any>,
  paymentType: number = 0,
  selectedToken: string = '',
  options?: any
) => {
  // Check for pending/cached operations
  if (API_OPTIMIZATION.enableCaching && pendingOperations.has(operationKey)) {
    console.log(`Using pending operation result for ${operationKey}`);
    return pendingOperations.get(operationKey);
  }
  
  const executePromise = (async () => {
    try {
      // Initialize client and builder with caching
      const client = await initAAClient(accountSigner);
      const builder = await initAABuilder(accountSigner, options?.apiKey || API_KEY);
      
      // Apply settings
      applyBuilderSettings(builder, paymentType, selectedToken, options);
      
      // Execute the operation
      return await executeFn(client, builder);
    } catch (error) {
      console.error(`Error executing operation ${operationKey}:`, error);
      // Remove from pending operations on error
      pendingOperations.delete(operationKey);
      throw error;
    } finally {
      // Clean up pending operation after a delay
      setTimeout(() => {
        pendingOperations.delete(operationKey);
      }, 5000); // Remove after 5 seconds to prevent caching errors for too long
    }
  })();
  
  // Cache the promise
  if (API_OPTIMIZATION.enableCaching) {
    pendingOperations.set(operationKey, executePromise);
  }
  
  return executePromise;
};

// Mint ERC20 test tokens using Account Abstraction
export const mintERC20Token = async (
  accountSigner: ethers.Signer, 
  recipientAddress: string,
  amount: ethers.BigNumber,
  paymentType: number = 0, // 0: free, 1: prepay, 2: postpay
  selectedToken: string = '', // Token address for ERC20 payment
  options?: {
    apiKey?: string;
    gasMultiplier?: number;
  }
) => {
  // Generate a unique operation key
  const opKey = generateOperationKey('mintERC20', [
    await accountSigner.getAddress(),
    recipientAddress,
    amount.toString(),
    paymentType,
    selectedToken,
    options?.gasMultiplier || 100
  ]);
  
  // Use memoized operation execution
  return executeOperation(
    opKey,
    accountSigner,
    async (client, builder) => {
      try {
        // Create ERC20 contract instance
        const erc20Contract = new ethers.Contract(
          CONTRACT_ADDRESSES.testTokenContract,
          [
            // Simple ERC20 functions we need
            'function mint(address, uint256) returns (bool)',
            'function balanceOf(address) view returns (uint256)',
            'function decimals() view returns (uint8)'
          ],
          getProvider()
        );
        
        // Prepare the mint function call data
        const callData = erc20Contract.interface.encodeFunctionData('mint', [
          recipientAddress,
          amount
        ]);
        
        // Set transaction data in the builder
        const userOp = await builder.execute(CONTRACT_ADDRESSES.testTokenContract, 0, callData);
        
        // Send the user operation
        if (API_OPTIMIZATION.debugLogs) console.log(`Sending mint ERC20 operation to paymaster`);
        const res = await client.sendUserOperation(userOp);
        
        console.log("UserOperation sent with hash:", res.userOpHash);
        
        // Wait for the UserOperation to be included in a transaction
        const receipt = await res.wait();
        
        let transactionHash = '';
        try {
          // Directly get the transaction hash from the receipt if available
          if (receipt && receipt.transactionHash) {
            transactionHash = receipt.transactionHash;
          } 
          // Otherwise try to get it using SimpleAccount (if available)
          else if (Presets && Presets.SimpleAccount) {
            // Get the account address
            const accountAddress = await getAAWalletAddress(accountSigner);
            const simpleAccountInstance = await Presets.SimpleAccount.init(
              accountSigner,
              NERO_CHAIN_CONFIG.rpcUrl,
              {
                overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
                entryPoint: CONTRACT_ADDRESSES.entryPoint,
                factory: CONTRACT_ADDRESSES.accountFactory,
              }
            );
            
            // Get transaction details from the UserOp hash
            const userOpResult = await simpleAccountInstance.checkUserOp(res.userOpHash);
            transactionHash = userOpResult.receipt?.transactionHash || '';
            
            return {
              userOpHash: res.userOpHash,
              transactionHash,
              receipt: userOpResult
            };
          }
        } catch (error) {
          console.warn("Error getting transaction details:", error);
          // Continue with UserOp hash only
        }
        
        // Fall back to just returning the UserOp hash if we couldn't get the transaction hash
        return {
          userOpHash: res.userOpHash,
          transactionHash,
          receipt: null
        };
      } catch (error) {
        console.error("Error in mintERC20 operation:", error);
        throw error;
      }
    },
    paymentType,
    selectedToken,
    options
  );
};

// Optimized mintNFT function with better caching and API handling
export const mintNFT = async (
  accountSigner: ethers.Signer, 
  recipientAddress: string,
  metadataUri: string,
  paymentType: number = 0, // 0: free, 1: prepay, 2: postpay
  selectedToken: string = '', // Token address for ERC20 payment
  options?: {
    apiKey?: string;
    gasMultiplier?: number;
  }
) => {
  // Generate a unique operation key
  const opKey = generateOperationKey('mintNFT', [
    await accountSigner.getAddress(),
    recipientAddress,
    metadataUri,
    paymentType,
    selectedToken,
    options?.gasMultiplier || 100
  ]);
  
  // Use memoized operation execution to reduce redundant API calls
  return executeOperation(
    opKey,
    accountSigner,
    async (client, builder) => {
      try {
        // Create NFT contract instance
        const nftContract = new ethers.Contract(
          CONTRACT_ADDRESSES.nftContract,
          [
            // Simple ERC721 functions we need
            'function mint(address, string) returns (uint256)',
            'function balanceOf(address) view returns (uint256)',
            'function tokenURI(uint256) view returns (string)'
          ],
          getProvider()
        );
        
        // Prepare the mint function call data
        const callData = nftContract.interface.encodeFunctionData('mint', [
          recipientAddress,
          metadataUri
        ]);
        
        // Set transaction data in the builder
        // This internally calls the paymaster API
        const userOp = await builder.execute(CONTRACT_ADDRESSES.nftContract, 0, callData);
        
        // Send the user operation with retry capability
        if (API_OPTIMIZATION.debugLogs) console.log(`Sending mint NFT operation to paymaster`);
        const res = await client.sendUserOperation(userOp);
        
        console.log("UserOperation sent with hash:", res.userOpHash);
        
        // Wait for the UserOperation to be included in a transaction
        const receipt = await res.wait();
        
        let transactionHash = '';
        try {
          // Directly get the transaction hash from the receipt if available
          if (receipt && receipt.transactionHash) {
            transactionHash = receipt.transactionHash;
          } 
          // Otherwise try to get it using SimpleAccount (if available)
          else if (Presets && Presets.SimpleAccount) {
            // Get the account address
            const accountAddress = await getAAWalletAddress(accountSigner);
            const simpleAccountInstance = await Presets.SimpleAccount.init(
              accountSigner,
              NERO_CHAIN_CONFIG.rpcUrl,
              {
                overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
                entryPoint: CONTRACT_ADDRESSES.entryPoint,
                factory: CONTRACT_ADDRESSES.accountFactory,
              }
            );
            
            // Get transaction details from the UserOp hash
            const userOpResult = await simpleAccountInstance.checkUserOp(res.userOpHash);
            transactionHash = userOpResult.receipt?.transactionHash || '';
            
            return {
              userOpHash: res.userOpHash,
              transactionHash,
              receipt: userOpResult
            };
          }
        } catch (error) {
          console.warn("Error getting transaction details:", error);
          // Continue with UserOp hash only
        }
        
        // Fall back to just returning the UserOp hash if we couldn't get the transaction hash
        return {
          userOpHash: res.userOpHash,
          transactionHash,
          receipt: null
        };
      } catch (error) {
        console.error("Error in mintNFT operation:", error);
        throw error;
      }
    },
    paymentType,
    selectedToken,
    options
  );
};

// Fetch NFTs owned by an address with optimized performance
export const getNFTsForAddress = async (address: string) => {
  if (!address) return [];
  
  // Check cache first
  const cacheKey = `nfts-${address.toLowerCase()}`;
  const cachedData = nftCache.get(cacheKey);
  const now = Date.now();
  
  if (cachedData && (now - cachedData.timestamp < NFT_CACHE_DURATION)) {
    console.log("Using cached NFT data");
    return cachedData.data;
  }
  
  try {
    const nftContract = new ethers.Contract(
      CONTRACT_ADDRESSES.nftContract,
      [
        'function balanceOf(address owner) view returns (uint256)',
        'function tokenURI(uint256 tokenId) view returns (string)',
        'function ownerOf(uint256 tokenId) view returns (address)',
        'function totalSupply() view returns (uint256)'
      ],
      getProvider()
    );
    
    // Try to get the total supply first (if the contract supports it)
    let totalSupply = 100; // Default fallback
    try {
      totalSupply = (await nftContract.totalSupply()).toNumber();
      // Cap at a reasonable number to avoid excessive requests
      totalSupply = Math.min(totalSupply, 500);
    } catch (err) {
      console.log("Contract doesn't support totalSupply, using default range");
    }

    // Prepare batched requests
    const batchSize = 10; // Process 10 tokens at a time
    const nfts = [];
    
    // Process in batches to improve performance
    for (let batchStart = 1; batchStart <= totalSupply; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize - 1, totalSupply);
      console.log(`Processing NFT batch ${batchStart}-${batchEnd}`);
      
      // Create batch of promises for ownerOf calls
      const ownerPromises = [];
      for (let tokenId = batchStart; tokenId <= batchEnd; tokenId++) {
        // Wrap in a promise that resolves even if the token doesn't exist
        const ownerPromise = nftContract.ownerOf(tokenId)
          .then((owner: string) => ({ tokenId, owner, exists: true }))
          .catch(() => ({ tokenId, owner: null, exists: false }));
        
        ownerPromises.push(ownerPromise);
      }
      
      // Wait for all owner checks to complete
      const ownerResults = await Promise.all(ownerPromises);
      
      // Filter for tokens owned by the address
      const ownedTokens = ownerResults
        .filter(result => result.exists && result.owner.toLowerCase() === address.toLowerCase())
        .map(result => result.tokenId);
      
      // Get token URIs for owned tokens (in parallel)
      if (ownedTokens.length > 0) {
        const uriPromises = ownedTokens.map(tokenId => 
          nftContract.tokenURI(tokenId)
            .then((uri: string) => ({ tokenId: tokenId.toString(), tokenURI: uri }))
            .catch((err: Error) => {
              console.warn(`Error fetching URI for token #${tokenId}:`, err);
              return { tokenId: tokenId.toString(), tokenURI: '' };
            })
        );
        
        const uriResults = await Promise.all(uriPromises);
        nfts.push(...uriResults.filter(token => token.tokenURI));
      }
    }
    
    // Cache the results
    nftCache.set(cacheKey, { timestamp: now, data: nfts });
    
    return nfts;
  } catch (err) {
    console.error("Error fetching NFTs:", err);
    return [];
  }
};

// Get test token balance with mock data for development
export const getTestTokenBalance = async (address: string) => {
  try {
    // Try to get the real balance first
    const balance = await getTokenBalance(address, CONTRACT_ADDRESSES.testTokenContract);
    
    // If we get a valid balance, return it
    if (balance !== '0') {
      return balance;
    }
    
    // For development/testing, return a mock balance if real balance fails
    if (process.env.NODE_ENV === 'development' || API_OPTIMIZATION.debugLogs) {
      console.log("Using mock test token balance for development");
      return '1000.0'; // Mock balance for testing
    }
    
    return '0';
  } catch (err) {
    console.error("Error fetching test token balance:", err);
    
    // For development/testing, return a mock balance
    if (process.env.NODE_ENV === 'development' || API_OPTIMIZATION.debugLogs) {
      return '1000.0'; // Mock balance for testing
    }
    
    return '0';
  }
};

// Check token allowance for a spender address
export const checkTokenAllowance = async (provider: ethers.providers.Provider, tokenAddress: string, ownerAddress: string, spenderAddress: string = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789') => {
  try {
    // Create token contract instance
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function allowance(address owner, address spender) view returns (uint256)',
        'function decimals() view returns (uint8)'
      ],
      provider
    );
    
    // Get current allowance
    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    
    // Get token decimals
    let decimals = 18;
    try {
      decimals = await tokenContract.decimals();
    } catch (err) {
      console.warn(`Could not get decimals for token ${tokenAddress}, using default 18`);
    }
    
    return ethers.utils.formatUnits(allowance, decimals);
  } catch (error) {
    console.error("Error checking token allowance:", error);
    return '0';
  }
};

// Approve token spending for paymaster
export const approveToken = async (provider: ethers.providers.Web3Provider, tokenAddress: string, amount: ethers.BigNumber, spenderAddress: string = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789') => {
  try {
    // Get signer from provider
    const signer = provider.getSigner();
    
    // Create token contract instance
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function approve(address spender, uint256 amount) returns (bool)'
      ],
      signer
    );
    
    // Send approval transaction
    const tx = await tokenContract.approve(spenderAddress, amount);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.transactionHash
    };
  } catch (error) {
    console.error("Error approving token:", error);
    return {
      success: false,
      error
    };
  }
};

// Transfer tokens to an AA wallet
export const transferTokenToAAWallet = async (provider: ethers.providers.Web3Provider, tokenAddress: string, amount: ethers.BigNumber, recipientAddress: string) => {
  try {
    // Get signer from provider
    const signer = provider.getSigner();
    
    // Create token contract instance
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function transfer(address to, uint256 amount) returns (bool)'
      ],
      signer
    );
    
    // Send transfer transaction
    const tx = await tokenContract.transfer(recipientAddress, amount);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.transactionHash
    };
  } catch (error) {
    console.error("Error transferring token:", error);
    return {
      success: false,
      error
    };
  }
};

// Get NFTs for the given address
export const getNFTs = async (ownerAddress: string) => {
  if (!ownerAddress) return [];
  
  try {
    // Call the existing getNFTsForAddress function
    const nftMetadata = await getNFTsForAddress(ownerAddress);
    
    // Transform the NFT data to the expected format
    const formattedNFTs = await Promise.all(
      nftMetadata.map(async (nft: any) => {
        try {
          // If the tokenURI is a JSON string, parse it
          let metadata = nft.tokenURI;
          let imageUrl = '';
          let name = `NFT #${nft.tokenId}`;
          let description = '';
          
          if (typeof metadata === 'string') {
            // If it's an IPFS URI, use a gateway
            if (metadata.startsWith('ipfs://')) {
              metadata = metadata.replace('ipfs://', 'https://ipfs.io/ipfs/');
            }
            
            // Check if it's a direct image URL by file extension
            const isDirectImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(metadata);
            
            if (isDirectImage) {
              // If it's a direct image URL, use it directly
              imageUrl = metadata;
            } else if (metadata.startsWith('http')) {
              // Try to fetch metadata if it's a URL
              try {
                const response = await fetch(metadata);
                // Check content type to determine if it's JSON or an image
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('application/json')) {
                  // It's JSON, parse it
                  const jsonData = await response.json();
                  metadata = jsonData;
                } else if (contentType && contentType.includes('image/')) {
                  // It's an image, use the URL directly
                  imageUrl = metadata;
                } else {
                  // Try to parse as JSON anyway, but catch errors
                  try {
                    const jsonData = await response.json();
                    metadata = jsonData;
                  } catch (parseError) {
                    console.warn(`Could not parse response as JSON from ${metadata}`, parseError);
                    imageUrl = metadata; // Assume it's an image or other resource
                  }
                }
              } catch (e) {
                console.warn(`Failed to fetch metadata from ${metadata}`, e);
                // If we can't fetch, assume it might be a direct image URL
                imageUrl = metadata;
              }
            }
          }
          
          // Extract metadata properties or use defaults
          if (typeof metadata === 'object' && metadata !== null) {
            imageUrl = metadata.image || imageUrl;
            // If image is an IPFS URI, use a gateway
            if (imageUrl.startsWith('ipfs://')) {
              imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
            }
            name = metadata.name || name;
            description = metadata.description || '';
          }
          
          return {
            id: nft.tokenId,
            tokenId: parseInt(nft.tokenId),
            name,
            description,
            image: imageUrl
          };
        } catch (err) {
          console.error(`Error processing NFT metadata for token ID ${nft.tokenId}:`, err);
          return {
            id: nft.tokenId,
            tokenId: parseInt(nft.tokenId),
            name: `NFT #${nft.tokenId}`,
            description: 'Metadata unavailable',
            image: ''
          };
        }
      })
    );
    
    return formattedNFTs;
  } catch (error) {
    console.error("Error fetching and processing NFTs:", error);
    return [];
  }
};

// Transfer ERC20 tokens through Account Abstraction (gasless transfers)
export const transferERC20Token = async (
  accountSigner: ethers.Signer, 
  recipientAddress: string,
  amount: ethers.BigNumber,
  paymentType: number = 0, // 0: free (gasless), 1: prepay, 2: postpay
  selectedToken: string = '', // Token address for ERC20 payment
  options?: {
    apiKey?: string;
    gasMultiplier?: number;
  }
) => {
  // Generate a unique operation key
  const opKey = generateOperationKey('transferERC20', [
    await accountSigner.getAddress(),
    recipientAddress,
    amount.toString(),
    paymentType,
    selectedToken,
    options?.gasMultiplier || 100
  ]);
  
  // Use memoized operation execution
  return executeOperation(
    opKey,
    accountSigner,
    async (client, builder) => {
      try {
        // Create ERC20 contract instance
        const erc20Contract = new ethers.Contract(
          CONTRACT_ADDRESSES.testTokenContract,
          [
            // Simple ERC20 functions we need
            'function transfer(address, uint256) returns (bool)',
            'function balanceOf(address) view returns (uint256)',
            'function decimals() view returns (uint8)'
          ],
          getProvider()
        );
        
        // Prepare the transfer function call data
        const callData = erc20Contract.interface.encodeFunctionData('transfer', [
          recipientAddress,
          amount
        ]);
        
        // Set transaction data in the builder
        const userOp = await builder.execute(CONTRACT_ADDRESSES.testTokenContract, 0, callData);
        
        // Send the user operation
        if (API_OPTIMIZATION.debugLogs) console.log(`Sending transfer ERC20 operation to paymaster`);
        const res = await client.sendUserOperation(userOp);
        
        console.log("UserOperation sent with hash:", res.userOpHash);
        
        // Wait for the UserOperation to be included in a transaction
        const receipt = await res.wait();
        
        let transactionHash = '';
        try {
          // Directly get the transaction hash from the receipt if available
          if (receipt && receipt.transactionHash) {
            transactionHash = receipt.transactionHash;
          } 
          // Otherwise try to get it using SimpleAccount (if available)
          else if (Presets && Presets.SimpleAccount) {
            // Get the account address
            const accountAddress = await getAAWalletAddress(accountSigner);
            const simpleAccountInstance = await Presets.SimpleAccount.init(
              accountSigner,
              NERO_CHAIN_CONFIG.rpcUrl,
              {
                overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
                entryPoint: CONTRACT_ADDRESSES.entryPoint,
                factory: CONTRACT_ADDRESSES.accountFactory,
              }
            );
            
            // Get transaction details from the UserOp hash
            const userOpResult = await simpleAccountInstance.checkUserOp(res.userOpHash);
            transactionHash = userOpResult.receipt?.transactionHash || '';
            
            return {
              userOpHash: res.userOpHash,
              transactionHash,
              receipt: userOpResult
            };
          }
        } catch (error) {
          console.warn("Error getting transaction details:", error);
          // Continue with UserOp hash only
        }
        
        // Fall back to just returning the UserOp hash if we couldn't get the transaction hash
        return {
          userOpHash: res.userOpHash,
          transactionHash,
          receipt: null
        };
      } catch (error) {
        console.error("Error in transferERC20 operation:", error);
        throw error;
      }
    },
    paymentType,
    selectedToken,
    options
  );
};

// Check token allowance from AA wallet to the paymaster
export const checkAAWalletTokenAllowance = async (
  accountSigner: ethers.Signer,
  tokenAddress: string,
  spenderAddress: string = CONTRACT_ADDRESSES.paymaster
) => {
  try {
    // Get AA wallet address
    const aaWalletAddress = await getAAWalletAddress(accountSigner);
    
    // Create token contract instance
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function allowance(address owner, address spender) view returns (uint256)',
        'function decimals() view returns (uint8)'
      ],
      getProvider()
    );
    
    // Get current allowance
    const allowance = await tokenContract.allowance(aaWalletAddress, spenderAddress);
    
    // Get token decimals
    let decimals = 18;
    try {
      decimals = await tokenContract.decimals();
    } catch (err) {
      console.warn(`Could not get decimals for token ${tokenAddress}, using default 18`);
    }
    
    return ethers.utils.formatUnits(allowance, decimals);
  } catch (error) {
    console.error("Error checking AA wallet token allowance:", error);
    return '0';
  }
};

// Approve token spending from AA wallet to the paymaster using UserOperation
export const approveAAWalletToken = async (
  accountSigner: ethers.Signer,
  tokenAddress: string,
  amount: ethers.BigNumber,
  spenderAddress: string = CONTRACT_ADDRESSES.paymaster,
  options?: {
    apiKey?: string;
    gasMultiplier?: number;
  }
) => {
  // Generate a unique operation key
  const opKey = generateOperationKey('approveAAWalletToken', [
    await accountSigner.getAddress(),
    tokenAddress,
    amount.toString(),
    spenderAddress
  ]);
  
  // Use memoized operation execution to reduce redundant API calls
  return executeOperation(
    opKey,
    accountSigner,
    async (client, builder) => {
      try {
        // Create token contract instance
        const tokenContract = new ethers.Contract(
          tokenAddress,
          [
            'function approve(address spender, uint256 amount) returns (bool)'
          ],
          getProvider()
        );
        
        // Prepare the approve function call data
        const callData = tokenContract.interface.encodeFunctionData('approve', [
          spenderAddress,
          amount
        ]);
        
        // Override payment type to use free (sponsored) for this approval operation
        // to avoid circular dependency (approving tokens to be able to pay for the approval transaction)
        builder.setPaymasterOptions({
          apikey: API_KEY,
          rpc: AA_PLATFORM_CONFIG.paymasterRpc,
          type: 0 // Free (sponsored)
        });
        
        // Set transaction data in the builder
        const userOp = await builder.execute(tokenAddress, 0, callData);
        
        // Send the user operation
        console.log(`Sending AA wallet token approval operation`);
        const res = await client.sendUserOperation(userOp);
        
        console.log("UserOperation sent with hash:", res.userOpHash);
        
        // Wait for the UserOperation to be included in a transaction
        const receipt = await res.wait();
        
        let transactionHash = '';
        if (receipt && receipt.transactionHash) {
          transactionHash = receipt.transactionHash;
        }
        
        return {
          success: true,
          userOpHash: res.userOpHash,
          transactionHash,
          receipt
        };
      } catch (error) {
        console.error("Error in AA wallet token approval:", error);
        throw error;
      }
    },
    0, // Always use free (sponsored) for token approvals
    '',
    options
  );
}; 