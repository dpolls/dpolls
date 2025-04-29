import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import { checkTokenAllowance, approveToken } from '../../utils/aaUtils';
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
  const { EOAProvider, eoaAddress, supportedTokens } = useWallet();
  const [tokenAllowance, setTokenAllowance] = useState<string>('0');
  const [isCheckingAllowance, setIsCheckingAllowance] = useState<boolean>(false);
  const [isApprovingToken, setIsApprovingToken] = useState<boolean>(false);
  const [approvalError, setApprovalError] = useState<string>('');

  // Get token details
  const getTokenDetails = (): SupportedToken | undefined => {
    if (!supportedTokens || !Array.isArray(supportedTokens)) return undefined;
    return supportedTokens.find(token => token.address === selectedToken);
  };

  // Check token allowance
  const checkAllowance = async () => {
    if (!EOAProvider || !eoaAddress || !selectedToken) return;
    
    setIsCheckingAllowance(true);
    setApprovalError('');
    
    try {
      const allowance = await checkTokenAllowance(
        EOAProvider,
        selectedToken,
        eoaAddress
      );
      setTokenAllowance(allowance);
    } catch (error) {
      console.error('Error checking allowance:', error);
      setApprovalError('Failed to check token allowance');
    } finally {
      setIsCheckingAllowance(false);
    }
  };

  // Handle token approval
  const handleApproveToken = async () => {
    if (!EOAProvider || !eoaAddress || !selectedToken) return;
    
    setIsApprovingToken(true);
    setApprovalError('');
    
    try {
      await approveToken(
        EOAProvider,
        selectedToken,
        ethers.utils.parseUnits('1000000', getTokenDetails()?.decimals || 18)
      );
      await checkAllowance();
      onApprovalComplete();
    } catch (error) {
      console.error('Error approving token:', error);
      setApprovalError('Failed to approve token');
    } finally {
      setIsApprovingToken(false);
    }
  };

  // Check if sufficient allowance exists
  const hasSufficientAllowance = (): boolean => {
    if (!tokenAllowance || !requiredAllowance) return false;
    
    try {
      // Parse the values properly to avoid BigNumber errors
      const currentAllowanceFormatted = parseFloat(tokenAllowance);
      const requiredAllowanceFormatted = parseFloat(requiredAllowance);
      
      // Simple float comparison for UI purposes
      return currentAllowanceFormatted >= requiredAllowanceFormatted;
    } catch (error) {
      console.error('Error comparing allowances:', error);
      return false;
    }
  };

  // Check allowance when selected token or tokenAmount changes
  useEffect(() => {
    if (selectedToken) {
      checkAllowance();
    }
  }, [selectedToken, eoaAddress]);

  // Skip if no token is selected
  if (!selectedToken) return null;

  return (
    <div className="token-approval">
      <div className="allowance-status">
        {isCheckingAllowance ? (
          <p>Checking allowance...</p>
        ) : hasSufficientAllowance() ? (
          <div className="allowance-approved">
            <span className="check-icon">✓</span> Token approved for paymaster
          </div>
        ) : (
          <div className="allowance-required">
            <p>You need to approve the token to pay for gas with {getTokenDetails()?.symbol || 'selected token'}</p>
            <button
              onClick={handleApproveToken}
              disabled={isApprovingToken}
              className="btn btn-primary approval-btn"
            >
              {isApprovingToken ? 'Approving...' : 'Approve Token'}
            </button>
            {approvalError && <p className="error-message">{approvalError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenApproval; 