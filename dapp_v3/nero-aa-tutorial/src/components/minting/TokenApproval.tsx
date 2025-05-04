import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import { 
  checkTokenAllowance, 
  approveToken, 
  checkAAWalletTokenAllowance,
  approveAAWalletToken,
  transferTokenToAAWallet
} from '../../utils/aaUtils';
import { SupportedToken } from '../../types/tokens';
import './TokenApproval.css';

interface TokenApprovalProps {
  selectedToken: string;
  tokenAmount: string;
  requiredAllowance: string;
  onApprovalComplete: () => void;
}

/**
 * Component for handling token approval for paymaster
 */
const TokenApproval: React.FC<TokenApprovalProps> = ({
  selectedToken,
  tokenAmount,
  requiredAllowance,
  onApprovalComplete
}) => {
  const { walletState, EOAProvider, eoaAddress, supportedTokens } = useWallet();
  const [eoaTokenAllowance, setEoaTokenAllowance] = useState<string>('0');
  const [aaTokenAllowance, setAaTokenAllowance] = useState<string>('0');
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [isCheckingAllowance, setIsCheckingAllowance] = useState<boolean>(false);
  const [isTransferringTokens, setIsTransferringTokens] = useState<boolean>(false);
  const [isApprovingToken, setIsApprovingToken] = useState<boolean>(false);
  const [isApprovingAAToken, setIsApprovingAAToken] = useState<string | null>(null);
  const [approvalError, setApprovalError] = useState<string>('');
  const [approvalStep, setApprovalStep] = useState<'check' | 'eoa-approval' | 'transfer' | 'aa-approval' | 'complete'>('check');

  // Get token details
  const getTokenDetails = (): SupportedToken | undefined => {
    if (!supportedTokens || !Array.isArray(supportedTokens)) return undefined;
    return supportedTokens.find(token => token.address === selectedToken);
  };

  // Check EOA allowance to EntryPoint
  const checkEOAAllowance = async () => {
    if (!EOAProvider || !eoaAddress || !selectedToken) return;
    
    try {
      const allowance = await checkTokenAllowance(
        EOAProvider,
        selectedToken,
        eoaAddress
      );
      setEoaTokenAllowance(allowance);
    } catch (error) {
      console.error('Error checking EOA allowance:', error);
    }
  };

  // Check AA wallet allowance to Paymaster
  const checkAAAllowance = async () => {
    if (!walletState.signer || !selectedToken) return;
    
    try {
      const allowance = await checkAAWalletTokenAllowance(
        walletState.signer,
        selectedToken
      );
      setAaTokenAllowance(allowance);
      
      // If AA wallet has allowance, set step to complete
      if (parseFloat(allowance) > parseFloat(requiredAllowance || '0')) {
        setApprovalStep('complete');
        onApprovalComplete();
      }
    } catch (error) {
      console.error('Error checking AA wallet allowance:', error);
    }
  };
  
  // Combined check function
  const checkAllowances = async () => {
    if (!EOAProvider || !eoaAddress || !selectedToken || !walletState.signer) return;
    
    setIsCheckingAllowance(true);
    setApprovalError('');
    
    try {
      // Check both allowances in parallel
      await Promise.all([
        checkEOAAllowance(),
        checkAAAllowance()
      ]);
      
      // After checking, determine the next step based on allowances
      determineApprovalStep();
    } catch (error) {
      console.error('Error checking allowances:', error);
      setApprovalError('Failed to check token allowances');
    } finally {
      setIsCheckingAllowance(false);
    }
  };
  
  // Determine the next approval step based on current state
  const determineApprovalStep = () => {
    if (parseFloat(aaTokenAllowance) > parseFloat(requiredAllowance || '0')) {
      setApprovalStep('complete');
      onApprovalComplete();
    } else {
      // If AA wallet doesn't have allowance, we need approval
      setApprovalStep('aa-approval');
    }
  };

  // Handle EOA token approval for Entry Point
  const handleEOAApprove = async () => {
    if (!EOAProvider || !eoaAddress || !selectedToken) return;
    
    setIsApprovingToken(true);
    setApprovalError('');
    
    try {
      const token = getTokenDetails();
      const decimals = token?.decimals || 18;
      const approvalAmount = ethers.utils.parseUnits('1000000', decimals);
      
      await approveToken(
        EOAProvider,
        selectedToken,
        approvalAmount
      );
      
      await checkEOAAllowance();
      setApprovalStep('transfer');
    } catch (error) {
      console.error('Error approving EOA token:', error);
      setApprovalError('Failed to approve token from EOA wallet');
    } finally {
      setIsApprovingToken(false);
    }
  };
  
  // Handle token transfer from EOA to AA wallet
  const handleTransferToAAWallet = async () => {
    if (!EOAProvider || !eoaAddress || !selectedToken || !walletState.aaWalletAddress) return;
    
    setIsTransferringTokens(true);
    setApprovalError('');
    
    try {
      const token = getTokenDetails();
      const decimals = token?.decimals || 18;
      // Transfer enough tokens for several transactions
      const transferAmount = ethers.utils.parseUnits('100', decimals);
      
      await transferTokenToAAWallet(
        EOAProvider,
        selectedToken,
        transferAmount,
        walletState.aaWalletAddress
      );
      
      setApprovalStep('aa-approval');
    } catch (error) {
      console.error('Error transferring tokens to AA wallet:', error);
      setApprovalError('Failed to transfer tokens to your AA wallet');
    } finally {
      setIsTransferringTokens(false);
    }
  };

  // Handle AA wallet token approval for Paymaster
  const handleAAWalletApprove = async () => {
    if (!walletState.signer || !selectedToken) return;
    
    setIsApprovingAAToken('Preparing approval transaction...');
    setApprovalError('');
    
    try {
      const token = getTokenDetails();
      const decimals = token?.decimals || 18;
      // Approve a large amount to avoid frequent approvals
      const approvalAmount = ethers.utils.parseUnits('10000000', decimals);
      
      setIsApprovingAAToken('Submitting user operation...');
      const result = await approveAAWalletToken(
        walletState.signer,
        selectedToken,
        approvalAmount
      );
      
      setIsApprovingAAToken('Waiting for transaction confirmation...');
      console.log('AA wallet approval result:', result);
      
      // Check the updated allowance
      await checkAAAllowance();
      
      setApprovalStep('complete');
      onApprovalComplete();
    } catch (error) {
      console.error('Error approving AA wallet token:', error);
      setApprovalError('Failed to approve token from AA wallet. Please try again.');
    } finally {
      setIsApprovingAAToken(null);
    }
  };

  // Format allowance for display
  const formatAllowance = (allowance: string): string => {
    if (!allowance) return '0';
    
    const token = getTokenDetails();
    if (!token) return allowance;
    
    return `${parseFloat(allowance).toLocaleString()} ${token.symbol}`;
  };

  // Check allowances when selected token changes
  useEffect(() => {
    if (selectedToken) {
      checkAllowances();
    }
  }, [selectedToken, eoaAddress, walletState.aaWalletAddress]);

  // Skip if no token is selected
  if (!selectedToken) return null;

  // Render based on current approval step
  return (
    <div className="token-approval">
      <div className="allowance-status">
        {isCheckingAllowance ? (
          <p>Checking allowances...</p>
        ) : approvalStep === 'complete' ? (
          <div className="allowance-approved">
            <div className="allowance-info">
              <span className="check-icon">✓</span> Token approved for paymaster
              <div className="current-allowance">
                <span className="allowance-label">Current allowance:</span>
                <span className="allowance-value">{formatAllowance(aaTokenAllowance)}</span>
              </div>
            </div>
            <button
              onClick={handleAAWalletApprove}
              disabled={!!isApprovingAAToken}
              className="btn btn-secondary increase-allowance-btn"
            >
              {isApprovingAAToken ? 'Increasing...' : 'Increase Allowance'}
            </button>
          </div>
        ) : approvalStep === 'aa-approval' ? (
          <div className="allowance-required">
            <p>The paymaster needs approval to use tokens from your AA wallet to pay for gas</p>
            <button
              onClick={handleAAWalletApprove}
              disabled={!!isApprovingAAToken}
              className="btn btn-primary approval-btn"
            >
              {isApprovingAAToken ? isApprovingAAToken : 'Approve AA Wallet Tokens'}
            </button>
            {approvalError && <p className="error-message">{approvalError}</p>}
          </div>
        ) : (
          <div className="allowance-required">
            <p>You need to approve the token to pay for gas with {getTokenDetails()?.symbol || 'selected token'}</p>
            <button
              onClick={handleAAWalletApprove}
              disabled={!!isApprovingAAToken}
              className="btn btn-primary approval-btn"
            >
              {isApprovingAAToken ? isApprovingAAToken : 'Approve Tokens'}
            </button>
            {approvalError && <p className="error-message">{approvalError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenApproval; 