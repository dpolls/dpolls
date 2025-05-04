import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import { getTestTokenBalance, mintERC20Token, transferERC20Token } from '../../utils/aaUtils';
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
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [mintAmount, setMintAmount] = useState<string>('10');
  const [transferAmount, setTransferAmount] = useState<string>('1');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transferRecipientAddress, setTransferRecipientAddress] = useState<string>('');
  const [mintSuccess, setMintSuccess] = useState<boolean>(false);
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);
  const [mintError, setMintError] = useState<string>('');
  const [transferError, setTransferError] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('SPONSORED');
  const [transferPaymentType, setTransferPaymentType] = useState<string>('SPONSORED');
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [transferSelectedToken, setTransferSelectedToken] = useState<string>('');
  const [approvalComplete, setApprovalComplete] = useState<boolean>(false);
  const [transferApprovalComplete, setTransferApprovalComplete] = useState<boolean>(false);
  const [requiredAllowance, setRequiredAllowance] = useState<string>('0.01');
  const [gasMultiplier, setGasMultiplier] = useState<number>(1);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [userOpHash, setUserOpHash] = useState<string>('');
  const [transferTransactionHash, setTransferTransactionHash] = useState<string>('');
  const [transferUserOpHash, setTransferUserOpHash] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'mint' | 'transfer'>('mint');

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

  // Handle transfer payment type selection
  const handleTransferPaymentTypeChange = (type: string) => {
    setTransferPaymentType(type);
    if (type === 'SPONSORED') {
      setTransferSelectedToken('');
    }
  };

  // Handle token selection
  const handleTokenSelect = (tokenAddress: string) => {
    setSelectedToken(tokenAddress);
    setApprovalComplete(false);
  };

  // Handle transfer token selection
  const handleTransferTokenSelect = (tokenAddress: string) => {
    setTransferSelectedToken(tokenAddress);
    setTransferApprovalComplete(false);
  };

  // Handle approval completion
  const handleApprovalComplete = () => {
    setApprovalComplete(true);
  };

  // Handle transfer approval completion
  const handleTransferApprovalComplete = () => {
    setTransferApprovalComplete(true);
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
    setUserOpHash('');

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

      console.log("Mint result:", result);
      setMintSuccess(true);
      
      // Store transaction hash and user operation hash
      if (result) {
        // Set user operation hash
        if (result.userOpHash) {
          setUserOpHash(result.userOpHash);
        }
        
        // Set transaction hash with fallbacks
        if (result.transactionHash) {
          setTransactionHash(result.transactionHash);
        } else if (result.receipt && result.receipt.transactionHash) {
          setTransactionHash(result.receipt.transactionHash);
        } else if (typeof result === 'string') {
          // Handle case where result might just be the transaction hash as a string
          setTransactionHash(result);
        } else {
          console.warn("No transaction hash found in the result");
        }
      }
      
      // Refresh balance
      loadTestTokenBalance();
    } catch (error) {
      console.error('Error minting test tokens:', error);
      setMintError('Failed to mint test tokens. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  // Handle transferring test tokens
  const handleTransferTestToken = async () => {
    if (!walletState.signer || !transferRecipientAddress) {
      setTransferError('Wallet or recipient address not available');
      return;
    }

    setIsTransferring(true);
    setTransferSuccess(false);
    setTransferError('');
    setTransferTransactionHash('');
    setTransferUserOpHash('');

    try {
      // Parse amount to transfer with 18 decimals
      const amountToTransfer = ethers.utils.parseUnits(transferAmount, 18);
      
      // Convert payment type to number
      const paymentTypeNum = transferPaymentType === 'SPONSORED' ? 0 : 
                             transferPaymentType === 'PREPAY' ? 1 : 2;
      
      // Transfer test tokens
      const result = await transferERC20Token(
        walletState.signer,
        transferRecipientAddress,
        amountToTransfer,
        paymentTypeNum,
        transferSelectedToken,
        {
          gasMultiplier: gasMultiplier
        }
      );

      console.log("Transfer result:", result);
      setTransferSuccess(true);
      
      // Store both transaction hash and user operation hash
      if (result) {
        // Set user operation hash
        if (result.userOpHash) {
          setTransferUserOpHash(result.userOpHash);
        }
        
        // Set transaction hash with fallbacks
        if (result.transactionHash) {
          setTransferTransactionHash(result.transactionHash);
        } else if (result.receipt && result.receipt.transactionHash) {
          setTransferTransactionHash(result.receipt.transactionHash);
        } else if (typeof result === 'string') {
          // Handle case where result might just be the transaction hash as a string
          setTransferTransactionHash(result);
        } else {
          console.warn("No transaction hash found in the result");
        }
      }
      
      // Refresh balance
      loadTestTokenBalance();
    } catch (error) {
      console.error('Error transferring test tokens:', error);
      setTransferError('Failed to transfer test tokens. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  // If wallet not connected, don't show
  if (!walletState.isConnected) {
    return null;
  }

  return (
    <div className="test-token-minting">
      <h3 className="section-title">Test Token Operations</h3>
      
      {/* API Key Input */}
      <ApiKeyInput />
      
      {/* Tab Navigation */}
      <div className="token-tabs">
        <button 
          className={`token-tab-button ${activeTab === 'mint' ? 'active' : ''}`}
          onClick={() => setActiveTab('mint')}
        >
          Mint Tokens
        </button>
        <button 
          className={`token-tab-button ${activeTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfer')}
        >
          Transfer Tokens
        </button>
      </div>
      
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
      
      {activeTab === 'mint' ? (
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
              <div className="transfer-details">
                <p>To: {recipientAddress}</p>
                <p>Amount: {mintAmount} TEST</p>
                <p>Payment Type: {paymentType}</p>
              </div>
              {userOpHash && (
                <div className="transaction-info">
                  <p>User Operation Hash:</p>
                  <div className="hash-container">
                    <code className="transaction-hash">{userOpHash}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(userOpHash)}
                      className="copy-hash-btn"
                      title="Copy user operation hash"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
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
          
          {mintError && <div className="error-message">{mintError}</div>}
        </div>
      ) : (
        <div className="transfer-form">
          <div className="form-group">
            <label htmlFor="transfer-recipient-address">Recipient Address:</label>
            <input
              id="transfer-recipient-address"
              type="text"
              value={transferRecipientAddress}
              onChange={(e) => setTransferRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="input-field"
            />
            <p className="help-text">Enter the address to receive the transferred tokens</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="transfer-amount">Amount to Transfer:</label>
            <input
              id="transfer-amount"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              min="0.000001"
              step="0.000001"
              className="input-field"
            />
            <p className="help-text">Maximum available: {testTokenBalance} TEST</p>
          </div>
          
          {/* Payment Options */}
          <div className="payment-options">
            <h4 className="subsection-title">Gas Payment Options</h4>
            
            <PaymentTypeSelector
              selectedPaymentType={transferPaymentType}
              onPaymentTypeChange={handleTransferPaymentTypeChange}
            />
            
            {transferPaymentType !== 'SPONSORED' && (
              <>
                <TokenSelector 
                  selectedToken={transferSelectedToken}
                  onTokenSelect={handleTransferTokenSelect}
                />
                
                {transferSelectedToken && (
                  <TokenApproval 
                    selectedToken={transferSelectedToken}
                    tokenAmount={transferAmount}
                    requiredAllowance={requiredAllowance}
                    onApprovalComplete={handleTransferApprovalComplete}
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
            onClick={handleTransferTestToken}
            disabled={
              isTransferring || 
              !transferRecipientAddress || 
              !transferAmount ||
              Number(transferAmount) <= 0 ||
              Number(transferAmount) > Number(testTokenBalance) ||
              (transferPaymentType !== 'SPONSORED' && (!transferSelectedToken || !transferApprovalComplete))
            }
            className="btn btn-primary transfer-btn"
          >
            {isTransferring ? 'Transferring...' : 'Transfer Test Tokens'}
          </button>
          
          {transferSuccess && (
            <div className="success-message">
              <p>Test tokens transferred successfully!</p>
              <div className="transfer-details">
                <p>From: {walletState.aaWalletAddress}</p>
                <p>To: {transferRecipientAddress}</p>
                <p>Amount: {transferAmount} TEST</p>
                <p>Payment Type: {transferPaymentType}</p>
              </div>
              {transferUserOpHash && (
                <div className="transaction-info">
                  <p>User Operation Hash:</p>
                  <div className="hash-container">
                    <code className="transaction-hash">{transferUserOpHash}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(transferUserOpHash)}
                      className="copy-hash-btn"
                      title="Copy user operation hash"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
              {transferTransactionHash && (
                <div className="transaction-info">
                  <p>Transaction Hash:</p>
                  <div className="hash-container">
                    <code className="transaction-hash">{transferTransactionHash}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(transferTransactionHash)}
                      className="copy-hash-btn"
                      title="Copy transaction hash"
                    >
                      Copy
                    </button>
                  </div>
                  <a 
                    href={`https://testnet.neroscan.io/tx/${transferTransactionHash}`} 
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
          
          {transferError && <div className="error-message">{transferError}</div>}
        </div>
      )}
    </div>
  );
};

export default TestTokenMinting; 