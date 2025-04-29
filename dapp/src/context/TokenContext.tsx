import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { 
  getSupportedTokens,
  getAllTokenBalances,
  initAAClient,
  initAABuilder
} from '../utils/aaUtils';
import { API_KEY, API_OPTIMIZATION } from '../config';
import { SupportedToken, TokenBalances, TokenApprovals } from '../types/tokens';
import { useWallet } from './WalletContext';

// Create context type
interface TokenContextType {
  supportedTokens: SupportedToken[];
  tokenBalances: TokenBalances;
  eoaTokenBalances: TokenBalances;
  tokenApprovals: TokenApprovals;
  selectedToken: string;
  isLoadingTokens: boolean;
  isLoadingBalances: boolean;
  isApproving: boolean;
  loadSupportedTokens: (signer: ethers.Signer) => Promise<void>;
  loadTokenBalances: () => Promise<void>;
  loadEoaTokenBalances: () => Promise<void>;
  checkTokenAllowance: (tokenAddress: string) => Promise<boolean>;
  approveToken: (tokenAddress: string) => Promise<boolean>;
  transferTokensToAAWallet: (tokenAddress: string, amount: string) => Promise<boolean>;
  setSelectedToken: (tokenAddress: string) => void;
  hasEnoughTokens: (tokenAddress: string) => boolean;
}

// Create context with default values
export const TokenContext = createContext<TokenContextType>({
  supportedTokens: [],
  tokenBalances: {},
  eoaTokenBalances: {},
  tokenApprovals: {},
  selectedToken: '',
  isLoadingTokens: false,
  isLoadingBalances: false,
  isApproving: false,
  loadSupportedTokens: async () => {},
  loadTokenBalances: async () => {},
  loadEoaTokenBalances: async () => {},
  checkTokenAllowance: async () => false,
  approveToken: async () => false,
  transferTokensToAAWallet: async () => false,
  setSelectedToken: () => {},
  hasEnoughTokens: () => false,
});

// Create provider component
export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { walletState } = useWallet();
  const { isConnected, signer, userAddress, aaWalletAddress } = walletState;
  
  const [supportedTokens, setSupportedTokens] = useState<SupportedToken[]>([]);
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({});
  const [eoaTokenBalances, setEoaTokenBalances] = useState<TokenBalances>({});
  const [tokenApprovals, setTokenApprovals] = useState<TokenApprovals>({});
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  
  // Load tokens when wallet connects
  useEffect(() => {
    if (isConnected && signer) {
      loadSupportedTokens(signer);
    }
  }, [isConnected, signer]);
  
  // Load token balances when wallet and tokens are available
  useEffect(() => {
    if (aaWalletAddress && supportedTokens.length > 0) {
      loadTokenBalances();
      loadEoaTokenBalances();
    }
  }, [aaWalletAddress, supportedTokens]);
  
  // Load supported tokens
  const loadSupportedTokens = async (walletSigner: ethers.Signer) => {
    try {
      setIsLoadingTokens(true);
      
      // Initialize AA client and builder
      const client = await initAAClient(walletSigner);
      const builder = await initAABuilder(walletSigner);
      
      // Get supported tokens
      const tokens = await getSupportedTokens(client, builder);
      setSupportedTokens(tokens);
      
      // Debug logs
      if (API_OPTIMIZATION.debugLogs) {
        console.log("Supported tokens loaded:", tokens);
      }
      
      return tokens;
    } catch (error: any) {
      console.error("Error loading supported tokens:", error);
      toast.error("Failed to load supported tokens");
      return [];
    } finally {
      setIsLoadingTokens(false);
    }
  };
  
  // Load token balances
  const loadTokenBalances = async () => {
    // Make sure we have both the AA wallet address and supported tokens before fetching
    if (!aaWalletAddress || supportedTokens.length === 0) return;
    
    try {
      setIsLoadingBalances(true);
      
      // Get balances for all tokens from the AA wallet address (not EOA)
      const balances = await getAllTokenBalances(aaWalletAddress, supportedTokens);
      setTokenBalances(balances);
      
      if (API_OPTIMIZATION.debugLogs) {
        console.log("Token balances loaded for AA wallet:", balances);
      }
    } catch (error) {
      console.error("Error loading token balances:", error);
    } finally {
      setIsLoadingBalances(false);
    }
  };
  
  // Load EOA token balances
  const loadEoaTokenBalances = async () => {
    if (!userAddress || supportedTokens.length === 0) return;
    
    try {
      // Get balances for all tokens from the EOA address
      const balances = await getAllTokenBalances(userAddress, supportedTokens);
      setEoaTokenBalances(balances);
      
      if (API_OPTIMIZATION.debugLogs) {
        console.log("EOA Token balances loaded:", balances);
      }
    } catch (error: any) {
      console.error("Error loading EOA token balances:", error);
    }
  };
  
  // Check token allowance
  const checkTokenAllowance = async (tokenAddress: string) => {
    if (!signer || !aaWalletAddress) return false;
    
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function allowance(address owner, address spender) view returns (uint256)'
        ],
        signer
      );
      
      // Get the paymaster address from config or use default
      const paymasterAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
      const allowance = await tokenContract.allowance(aaWalletAddress, paymasterAddress);
      
      // Consider approved if allowance is greater than 0
      const hasAllowance = !allowance.isZero();
      
      // Update the approvals state
      setTokenApprovals(prev => ({
        ...prev,
        [tokenAddress]: hasAllowance
      }));
      
      return hasAllowance;
    } catch (error) {
      console.error("Error checking token allowance:", error);
      return false;
    }
  };
  
  // Approve token
  const approveToken = async (tokenAddress: string) => {
    if (!signer || !aaWalletAddress) {
      toast.error("Connect your wallet first");
      return false;
    }
    
    setIsApproving(true);
    
    try {
      // Initialize AA client and builder
      const client = await initAAClient(signer);
      const builder = await initAABuilder(signer);
      
      // Set up sponsored payment for the approval transaction
      builder.setPaymasterOptions({
        apikey: API_KEY,
        rpc: "https://paymaster-testnet.nerochain.io",
        type: "0" // Use free sponsorship for approval
      });
      
      // Encode approval function (approve max uint256)
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function approve(address spender, uint256 amount) returns (bool)'
        ],
        signer
      );
      
      // Paymaster contract needs approval
      const paymasterAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
      
      // Approve a large amount
      const maxApproval = ethers.utils.parseUnits("1000000000", 18);
      const callData = tokenContract.interface.encodeFunctionData('approve', [paymasterAddress, maxApproval]);
      
      // Create a UserOperation for approval
      const userOp = await builder.execute(
        tokenAddress,
        0,
        callData
      );
      
      // Send via bundler and paymaster
      const result = await client.sendUserOperation(userOp);
      
      // Wait for the transaction to be mined
      const receipt = await result.wait();
      
      // Update approval status
      setTokenApprovals(prev => ({
        ...prev,
        [tokenAddress]: true
      }));
      
      toast.success("Token approved successfully!");
      return true;
    } catch (error: any) {
      console.error("Error approving token:", error);
      toast.error(`Error approving token: ${error.message || "Unknown error"}`);
      return false;
    } finally {
      setIsApproving(false);
    }
  };
  
  // Transfer tokens from EOA to AA wallet
  const transferTokensToAAWallet = async (tokenAddress: string, amount: string) => {
    if (!signer || !userAddress || !aaWalletAddress) {
      toast.error("Wallet not connected");
      return false;
    }
    
    try {
      setIsApproving(true);
      
      // Create token contract instance
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function transfer(address to, uint amount) returns (bool)',
          'function decimals() view returns (uint8)'
        ],
        signer
      );
      
      // Get token decimals
      const decimals = await tokenContract.decimals();
      
      // Format amount with correct decimals
      const amountToTransfer = ethers.utils.parseUnits(amount, decimals);
      
      // Send transaction to transfer tokens from EOA to AA wallet
      const tx = await tokenContract.transfer(aaWalletAddress, amountToTransfer);
      
      // Wait for transaction to complete
      const receipt = await tx.wait();
      
      toast.success("Tokens transferred successfully to your AA wallet!");
      
      // Refresh token balances after transfer
      await loadTokenBalances();
      await loadEoaTokenBalances();
      
      return true;
    } catch (error: any) {
      console.error("Error transferring tokens:", error);
      toast.error(`Error transferring tokens: ${error.message || "Unknown error"}`);
      return false;
    } finally {
      setIsApproving(false);
    }
  };
  
  // Check if user has enough tokens for payment
  const hasEnoughTokens = (tokenAddress: string) => {
    const token = supportedTokens.find(t => t.address === tokenAddress);
    const balance = tokenBalances[tokenAddress] || "0";
    
    // We don't know how much is required, but show a warning if balance is very low
    if (parseFloat(balance) < 0.0001) {
      return false;
    }
    
    return true;
  };
  
  return (
    <TokenContext.Provider value={{
      supportedTokens,
      tokenBalances,
      eoaTokenBalances,
      tokenApprovals,
      selectedToken,
      isLoadingTokens,
      isLoadingBalances,
      isApproving,
      loadSupportedTokens,
      loadTokenBalances,
      loadEoaTokenBalances,
      checkTokenAllowance,
      approveToken,
      transferTokensToAAWallet,
      setSelectedToken,
      hasEnoughTokens,
    }}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook for using token context
export const useTokens = () => useContext(TokenContext); 