import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../../context/WalletContext';
import { useTokens } from '../../context/TokenContext';
import { transferTokenToAAWallet } from '../../utils/aaUtils';
import './TokenTransfer.css';

interface TokenTransferProps {
  selectedToken: string;
  transferAmount: string;
  onTransferComplete: () => void;
}

/**
 * Component for transferring tokens to AA wallet
 */
const TokenTransfer: React.FC<TokenTransferProps> = ({
  selectedToken,
  transferAmount,
  onTransferComplete
}) => {
  const { walletState, EOAProvider } = useWallet(); 
  const { supportedTokens, loadTokenBalances } = useTokens();
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [transferError, setTransferError] = useState<string>('');
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);

  // Get token details
  const getTokenDetails = () => {
    return supportedTokens.find(token => token.address === selectedToken);
  };

  // Format amount for display
  const formatAmount = (amount: string) => {
    try {
      const tokenInfo = getTokenDetails();
      if (!tokenInfo) return amount;
      
      // No need to convert to BigNumber here, just format for display
      return `${amount} ${tokenInfo.symbol}`;
    } catch (error) {
      console.error('Error formatting amount:', error);
      return amount;
    }
  };

  // Handle token transfer
  const handleTransfer = async () => {
    if (!EOAProvider || !selectedToken || !transferAmount || !walletState.smartAccount) {
      setTransferError('Missing required information for transfer');
      return;
    }

    setIsTransferring(true);
    setTransferError('');
    setTransferSuccess(false);

    try {
      const tokenInfo = getTokenDetails();
      if (!tokenInfo) {
        setTransferError('Token information not found');
        return;
      }

      const amountToTransfer = ethers.utils.parseUnits(transferAmount, tokenInfo.decimals);
      const aaWalletAddress = await walletState.smartAccount.getAccountAddress();
      
      await transferTokenToAAWallet(
        EOAProvider,
        selectedToken,
        amountToTransfer,
        aaWalletAddress
      );
      
      setTransferSuccess(true);
      await loadTokenBalances();
      onTransferComplete();
    } catch (error) {
      console.error('Error transferring tokens:', error);
      setTransferError('Failed to transfer tokens. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  if (!selectedToken || !transferAmount) return null;

  return (
    <div className="token-transfer">
      <div className="transfer-info">
        <p>Transfer {formatAmount(transferAmount)} to your Account Abstraction wallet to use for gas fees</p>
        
        {!transferSuccess ? (
          <button 
            onClick={handleTransfer}
            disabled={isTransferring}
            className="btn btn-primary transfer-btn"
          >
            {isTransferring ? 'Transferring...' : 'Transfer Tokens'}
          </button>
        ) : (
          <div className="transfer-success">
            <span className="check-icon">✓</span> Tokens transferred successfully
          </div>
        )}
        
        {transferError && (
          <p className="error-message">{transferError}</p>
        )}
      </div>
    </div>
  );
};

export default TokenTransfer; 