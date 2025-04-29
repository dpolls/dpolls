import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { getSigner, getAAWalletAddress, initAABuilder } from '../utils/aaUtils';
import { WalletConnectionState } from '../types/wallet';

// Default wallet state
const defaultWalletState: WalletConnectionState = {
  isConnected: false,
  isLoading: false,
  userAddress: '',
  aaWalletAddress: '',
  signer: null,
  EOAProvider: undefined,
  eoaAddress: '',
  smartAccount: null,
  address: '',
};

// Create context
export const WalletContext = createContext<{
  walletState: WalletConnectionState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  updateSigner: (signer: ethers.Signer) => void;
  EOAProvider?: ethers.providers.Web3Provider;
  eoaAddress?: string;
  supportedTokens?: any[];
}>({
  walletState: defaultWalletState,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  updateSigner: () => {},
});

// Create provider component
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletConnectionState>(defaultWalletState);
  const [supportedTokens, setSupportedTokens] = useState<any[]>([]);

  // Connect wallet function
  const connectWallet = async () => {
    if (walletState.isLoading) return;

    try {
      setWalletState(prev => ({ ...prev, isLoading: true }));
      
      // Get web3 provider
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found. Please install MetaMask or a compatible wallet.");
      }
      const EOAProvider = new ethers.providers.Web3Provider(window.ethereum);
      await EOAProvider.send("eth_requestAccounts", []);
      
      // Get signer
      const walletSigner = EOAProvider.getSigner();
      
      // Get addresses
      const address = await walletSigner.getAddress();
      
      // Get AA wallet address
      const aaAddress = await getAAWalletAddress(walletSigner);
      
      // Initialize simple account builder (for smartAccount)
      const aaBuilder = await initAABuilder(walletSigner);

      // Update state
      setWalletState({
        isConnected: true,
        isLoading: false,
        userAddress: address,
        aaWalletAddress: aaAddress,
        signer: walletSigner,
        EOAProvider,
        eoaAddress: address,
        smartAccount: aaBuilder,
        address: aaAddress,
      });
      
      // Success notification
      toast.success("Wallet connected successfully!");
      
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast.error(error.message || "Failed to connect wallet");
      
      // Reset state on error
      setWalletState(defaultWalletState);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setWalletState(defaultWalletState);
  };

  // Update signer
  const updateSigner = (signer: ethers.Signer) => {
    setWalletState(prev => ({ ...prev, signer }));
  };

  return (
    <WalletContext.Provider value={{ 
      walletState, 
      connectWallet, 
      disconnectWallet,
      updateSigner,
      EOAProvider: walletState.EOAProvider,
      eoaAddress: walletState.eoaAddress,
      supportedTokens,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook for using wallet context
export const useWallet = () => useContext(WalletContext); 