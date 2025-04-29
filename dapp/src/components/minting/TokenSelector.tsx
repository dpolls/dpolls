import React from 'react';
import { useTokens } from '../../context/TokenContext';
import './TokenSelector.css';

interface TokenSelectorProps {
  selectedToken: string;
  onTokenSelect: (tokenAddress: string) => void;
}

/**
 * Component for selecting a token for payment
 */
const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenSelect
}) => {
  const { 
    supportedTokens, 
    tokenBalances, 
    isLoadingTokens,
    loadTokenBalances 
  } = useTokens();

  // Format balance for display
  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (isNaN(num)) return '0';
    if (num === 0) return '0';
    if (num < 0.001) return '<0.001';
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  const forceRefreshTokens = () => {
    loadTokenBalances();
  };

  return (
    <div className="token-selector">
      <label>Token to Use for Gas:</label>
      {isLoadingTokens ? (
        <p>Loading tokens...</p>
      ) : supportedTokens.length > 0 ? (
        <select
          value={selectedToken}
          onChange={(e) => onTokenSelect(e.target.value)}
          className="select-field"
        >
          <option value="">Select a token</option>
          {supportedTokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol} - {tokenBalances[token.address] ? formatBalance(tokenBalances[token.address]) : '0'} available
            </option>
          ))}
        </select>
      ) : (
        <div className="tokens-not-loaded">
          <p>No tokens loaded. <button onClick={forceRefreshTokens} className="btn btn-small">Refresh Tokens</button></p>
        </div>
      )}
      <div className="token-info-note">
        <p>* Balances shown are from your AA wallet address, which is used for paymaster payments</p>
      </div>
    </div>
  );
};

export default TokenSelector; 