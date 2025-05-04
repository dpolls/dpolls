import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { GasPriceInfo } from '../types/wallet';
import { TokenGasPrices, SupportedToken } from '../types/tokens';
import { useWallet } from './WalletContext';

// Create context type
interface GasPriceContextType {
  gasPriceInfo: GasPriceInfo;
  tokenGasPrices: TokenGasPrices;
  loadingTokenGasPrices: boolean;
  gasPrice?: string;
  fetchGasPrice: () => Promise<void>;
  fetchTokenGasPrices: (supportedTokens: SupportedToken[]) => Promise<void>;
  formatLastUpdated: (date: Date) => string;
}

// Default gas price info
const defaultGasPriceInfo: GasPriceInfo = {
  gasPrice: '0',
  gasPriceGwei: '0',
  lastUpdated: new Date(),
  isLoading: false
};

// Create context with default values
export const GasPriceContext = createContext<GasPriceContextType>({
  gasPriceInfo: defaultGasPriceInfo,
  tokenGasPrices: {},
  loadingTokenGasPrices: false,
  fetchGasPrice: async () => {},
  fetchTokenGasPrices: async () => {},
  formatLastUpdated: () => '',
});

// Create provider component
export const GasPriceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { walletState } = useWallet();
  const { isConnected, signer } = walletState;
  
  const [gasPriceInfo, setGasPriceInfo] = useState<GasPriceInfo>(defaultGasPriceInfo);
  const [tokenGasPrices, setTokenGasPrices] = useState<TokenGasPrices>({});
  const [loadingTokenGasPrices, setLoadingTokenGasPrices] = useState(false);
  
  // Fetch current gas price - wrapped in useCallback to prevent infinite loops
  const fetchGasPrice = useCallback(async () => {
    try {
      setGasPriceInfo(prev => ({ ...prev, isLoading: true }));
      
      if (!signer) {
        throw new Error("Signer not available");
      }
      
      // Use the provider from the signer
      const provider = signer.provider;
      if (!provider) {
        throw new Error("Provider not available");
      }
      
      // Get current gas price
      const gasPrice = await provider.getGasPrice();
      
      // Convert to Gwei for display (1 Gwei = 10^9 wei)
      const gasPriceGwei = ethers.utils.formatUnits(gasPrice, "gwei");
      
      setGasPriceInfo({
        gasPrice: gasPrice.toString(),
        gasPriceGwei: parseFloat(gasPriceGwei).toFixed(2),
        lastUpdated: new Date(),
        isLoading: false
      });
    } catch (error: any) {
      console.error("Error fetching gas price:", error);
      toast.error(`Could not fetch gas price: ${error.message || "Unknown error"}`);
      setGasPriceInfo(prev => ({ ...prev, isLoading: false }));
    }
  }, [signer]);
  
  // Fetch gas price on connection
  useEffect(() => {
    if (isConnected) {
      fetchGasPrice();
      
      // Set up interval to refresh gas price every 30 seconds
      const interval = setInterval(() => {
        fetchGasPrice();
      }, 30000);
      
      // Clean up interval on component unmount or disconnect
      return () => clearInterval(interval);
    }
  }, [isConnected, fetchGasPrice]);
  
  // Format the last updated time string
  const formatLastUpdated = (date: Date) => {
    // Check if date is within the last minute
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    }
    
    // Otherwise show the time
    return date.toLocaleTimeString();
  };
  
  // Fetch token-specific gas prices
  const fetchTokenGasPrices = useCallback(async (supportedTokens: SupportedToken[]) => {
    if (!signer || supportedTokens.length === 0) return;
    
    try {
      setLoadingTokenGasPrices(true);
      
      // Get current gas price from already fetched info or fetch new
      let gasPrice = ethers.BigNumber.from(gasPriceInfo.gasPrice || '0');
      if (gasPrice.isZero()) {
        const provider = signer.provider;
        if (provider) {
          gasPrice = await provider.getGasPrice();
        }
      }
      
      // Sample gas cost for a typical transaction (estimation)
      const estimatedGasLimit = ethers.BigNumber.from('100000'); // 100k gas units
      const estimatedGasCostWei = gasPrice.mul(estimatedGasLimit);
      
      // Calculate gas cost for each token
      const newTokenGasPrices: TokenGasPrices = {};
      
      for (const token of supportedTokens) {
        try {
          // Create a contract instance to get token decimals
          const tokenContract = new ethers.Contract(
            token.address,
            ['function decimals() view returns (uint8)'],
            signer
          );
          
          // Get token decimals
          const decimals = await tokenContract.decimals();
          
          // For demo purposes, using the token's price property or a default conversion rate
          const conversionRate = token.price || 1; // 1 ETH = x Token units
          
          // Calculate gas cost in token units
          // conversion: wei * (token/eth) / (10^18) * (10^token_decimals)
          const gasCostInToken = estimatedGasCostWei
            .mul(ethers.BigNumber.from(Math.floor(conversionRate * 100))) // Multiply by conversion rate * 100 for precision
            .div(ethers.BigNumber.from('1000000000000000000')) // Divide by 10^18 (wei to eth)
            .mul(ethers.BigNumber.from('10').pow(decimals)) // Multiply by 10^token_decimals
            .div(ethers.BigNumber.from('100')); // Divide by 100 to adjust for the precision multiplier
          
          // Format for display
          const formattedGasCost = ethers.utils.formatUnits(gasCostInToken, decimals);
          
          newTokenGasPrices[token.address] = {
            priceInToken: formattedGasCost,
            lastUpdated: new Date()
          };
        } catch (error) {
          console.error(`Error calculating gas price for token ${token.symbol}:`, error);
        }
      }
      
      setTokenGasPrices(newTokenGasPrices);
    } catch (error: any) {
      console.error("Error fetching token gas prices:", error);
    } finally {
      setLoadingTokenGasPrices(false);
    }
  }, [signer, gasPriceInfo.gasPrice]);
  
  return (
    <GasPriceContext.Provider value={{
      gasPriceInfo,
      tokenGasPrices,
      loadingTokenGasPrices,
      gasPrice: gasPriceInfo.gasPrice,
      fetchGasPrice,
      fetchTokenGasPrices,
      formatLastUpdated,
    }}>
      {children}
    </GasPriceContext.Provider>
  );
};

// Custom hook for using gas price context
export const useGasPrice = () => useContext(GasPriceContext); 