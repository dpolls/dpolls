import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import { getTestTokenBalance, mintERC20Token } from '../../utils/aaUtils';
import PaymentTypeSelector from './PaymentTypeSelector';
import TokenSelector from './TokenSelector';
import TokenApproval from './TokenApproval';
import AdvancedSettings from './AdvancedSettings';
import ApiKeyInput from './ApiKeyInput';
import './TestTokenMinting.css';

/**
 * Component for minting test tokens
 */
const TestTokenMinting: React.FC = () => {
  const { walletState } = useWallet();
  const [testTokenBalance, setTestTokenBalance] = useState<string>('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintAmount, setMintAmount] = useState<string>('10');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [mintSuccess, setMintSuccess] = useState<boolean>(false);
  const [mintError, setMintError] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('SPONSORED');
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [approvalComplete, setApprovalComplete] = useState<boolean>(false);
  const [requiredAllowance, setRequiredAllowance] = useState<string>('0.01');
  const [gasMultiplier, setGasMultiplier] = useState<number>(1);
  const [transactionHash, setTransactionHash] = useState<string>('');

  // Load test token balance when connected
  useEffect(() => {
    if (walletState.isConnected && walletState.aaWalletAddress) {
      loadTestTokenBalance();
    }
  }, [walletState.isConnected, walletState.aaWalletAddress]);

  // Load test token balance
  const loadTestTokenBalance = async () => {
    if (!walletState.aaWalletAddress) return;

    setIsLoadingBalance(true);
    
    try {
      const balance = await getTestTokenBalance(walletState.aaWalletAddress);
      setTestTokenBalance(balance);
    } catch (error) {
      console.error('Error loading test token balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Handle payment type selection
  const handlePaymentTypeChange = (type: string) => {
    setPaymentType(type);
    if (type === 'SPONSORED') {
      setSelectedToken('');
    }
  };

  // Handle token selection
  const handleTokenSelect = (tokenAddress: string) => {
    setSelectedToken(tokenAddress);
    setApprovalComplete(false);
  };

  // Handle approval completion
  const handleApprovalComplete = () => {
    setApprovalComplete(true);
  };

  // Handle gas multiplier change
  const handleGasMultiplierChange = (multiplier: number) => {
    console.log("Setting gas multiplier to:", multiplier);
    setGasMultiplier(multiplier);
  };

  // Handle minting test tokens
  const handleMintTestToken = async () => {
    if (!walletState.signer || !recipientAddress) {
      setMintError('Wallet or recipient address not available');
      return;
    }

    setIsMinting(true);
    setMintSuccess(false);
    setMintError('');
    setTransactionHash('');

    try {
      // Parse amount to mint with 18 decimals
      const amountToMint = ethers.utils.parseUnits(mintAmount, 18);
      
      // Convert payment type to number
      const paymentTypeNum = paymentType === 'SPONSORED' ? 0 : 
                             paymentType === 'PREPAY' ? 1 : 2;
      
      // Mint test tokens
      const result = await mintERC20Token(
        walletState.signer,
        recipientAddress,
        amountToMint,
        paymentTypeNum,
        selectedToken,
        {
          gasMultiplier: gasMultiplier
        }
      );

      setMintSuccess(true);
      setTransactionHash(result.transactionHash);
      
      // Refresh balance
      loadTestTokenBalance();
    } catch (error) {
      console.error('Error minting test tokens:', error);
      setMintError('Failed to mint test tokens. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  // If wallet not connected, don't show
  if (!walletState.isConnected) {
    return null;
  }

  return (
    <div className="test-token-minting">
      <h3 className="section-title">Mint Test Tokens</h3>
      
      {/* API Key Input */}
      <ApiKeyInput />
      
      <div className="token-balance-card">
        <div className="token-balance-info">
          <h4>Your Test Token Balance</h4>
          {isLoadingBalance ? (
            <p>Loading balance...</p>
          ) : (
            <p className="token-balance-amount">{testTokenBalance} TEST</p>
          )}
        </div>
        <button 
          onClick={loadTestTokenBalance} 
          className="btn btn-small refresh-btn"
          disabled={isLoadingBalance}
        >
          Refresh
        </button>
      </div>
      
      <div className="minting-form">
        <div className="form-group">
          <label htmlFor="recipient-address">Recipient Address:</label>
          <input
            id="recipient-address"
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            className="input-field"
          />
          <p className="help-text">Enter the address to receive the tokens (can be your own address)</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="mint-amount">Amount to Mint:</label>
          <input
            id="mint-amount"
            type="number"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            min="1"
            step="1"
            className="input-field"
          />
        </div>
        
        {/* Payment Options */}
        <div className="payment-options">
          <h4 className="subsection-title">Payment Options</h4>
          
          <PaymentTypeSelector
            selectedPaymentType={paymentType}
            onPaymentTypeChange={handlePaymentTypeChange}
          />
          
          {paymentType !== 'SPONSORED' && (
            <>
              <TokenSelector 
                selectedToken={selectedToken}
                onTokenSelect={handleTokenSelect}
              />
              
              {selectedToken && (
                <TokenApproval 
                  selectedToken={selectedToken}
                  tokenAmount={mintAmount}
                  requiredAllowance={requiredAllowance}
                  onApprovalComplete={handleApprovalComplete}
                />
              )}
            </>
          )}
        </div>
        
        {/* Advanced Settings */}
        <AdvancedSettings 
          gasMultiplier={gasMultiplier}
          onGasMultiplierChange={handleGasMultiplierChange}
        />
        
        <button
          onClick={handleMintTestToken}
          disabled={
            isMinting || 
            !recipientAddress || 
            !mintAmount ||
            (paymentType !== 'SPONSORED' && (!selectedToken || !approvalComplete))
          }
          className="btn btn-primary mint-btn"
        >
          {isMinting ? 'Minting...' : 'Mint Test Tokens'}
        </button>
        
        {mintSuccess && (
          <div className="success-message">
            <p>Test tokens minted successfully!</p>
            {transactionHash && (
              <div className="transaction-info">
                <p>Transaction Hash:</p>
                <div className="hash-container">
                  <code className="transaction-hash">{transactionHash}</code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(transactionHash)}
                    className="copy-hash-btn"
                    title="Copy transaction hash"
                  >
                    Copy
                  </button>
                </div>
                <a 
                  href={`https://testnet.neroscan.io/tx/${transactionHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-tx-link"
                >
                  View on Explorer
                </a>
              </div>
            )}
          </div>
        )}
        
        {mintError && (
          <div className="error-message">
            <p>{mintError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestTokenMinting; 