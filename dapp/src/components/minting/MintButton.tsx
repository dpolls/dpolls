import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { mintNFT } from '../../utils/aaUtils';
import { PaymentType } from '../../types/wallet';
import './MintButton.css';

interface MintButtonProps {
  recipientAddress: string;
  selectedToken: string;
  paymentType: PaymentType;
  gasMultiplier: number;
  onMintSuccess: (txHash: string) => void;
  onMintError: (error: Error) => void;
}

/**
 * Component for minting NFTs with transaction status
 */
const MintButton: React.FC<MintButtonProps> = ({
  recipientAddress,
  selectedToken,
  paymentType,
  gasMultiplier,
  onMintSuccess,
  onMintError
}) => {
  const { walletState } = useWallet();
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintStatus, setMintStatus] = useState<string>('');
  const [mintError, setMintError] = useState<string>('');

  // Handle mint action
  const handleMint = async () => {
    if (!walletState.smartAccount || !recipientAddress || !walletState.signer) {
      setMintError('Wallet, signer, or recipient address not available');
      return;
    }

    setIsMinting(true);
    setMintStatus('Initializing transaction...');
    setMintError('');

    try {
      // Update user on progress
      const statusCallback = (status: string) => {
        setMintStatus(status);
      };

      // Sample NFT metadata URI - In a real app, this would be dynamic
      const metadataUri = "https://neroapi.com/nfts/metadata/sample";

      // Perform mint operation
      const result = await mintNFT(
        walletState.signer,
        recipientAddress,
        metadataUri, // NFT metadata URI
        paymentType,
        selectedToken,
        {
          gasMultiplier: gasMultiplier
        }
      );

      setMintStatus('Transaction completed!');
      onMintSuccess(result.transactionHash);
    } catch (error) {
      console.error('Error minting NFT:', error);
      setMintError('Failed to mint NFT. Please try again.');
      onMintError(error as Error);
    } finally {
      setIsMinting(false);
    }
  };

  const canMint = (): boolean => {
    const hasRequiredInput = Boolean(walletState.isConnected && recipientAddress);
    
    // For sponsored payment, we only need the wallet and recipient
    // Handle both enum value and string representation
    if (paymentType === PaymentType.Sponsored || 
        (typeof paymentType === 'string' && paymentType === 'SPONSORED')) {
      return hasRequiredInput;
    }
    
    // For token payment, we also need a selected token
    return hasRequiredInput && Boolean(selectedToken);
  };

  return (
    <div className="mint-button-container">
      <button
        onClick={handleMint}
        disabled={isMinting || !canMint()}
        className={`btn btn-primary mint-btn ${isMinting ? 'minting' : ''}`}
      >
        {isMinting ? 'Creating Poll...' : 'Create Poll'}
      </button>

      {isMinting && mintStatus && (
        <div className="mint-status">
          <p className="status-text">{mintStatus}</p>
          <div className="spinner"></div>
        </div>
      )}

      {mintError && (
        <div className="mint-error">
          <p className="error-message">{mintError}</p>
        </div>
      )}
    </div>
  );
};

export default MintButton; 