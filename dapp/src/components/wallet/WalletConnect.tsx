import React from 'react';
import { useWallet } from '../../context/WalletContext';
import './WalletConnect.css';

/**
 * Component for connecting to a wallet
 */
const WalletConnect: React.FC = () => {
  const { walletState, connectWallet } = useWallet();
  const { isConnected, isLoading, userAddress, aaWalletAddress } = walletState;

  return (
    <div className="wallet-container">
      <div className="flex-row">
        <button
          onClick={connectWallet}
          disabled={isLoading || isConnected}
          className={`btn ${isConnected ? 'btn-connected' : 'btn-primary'}`}
        >
          {isLoading ? "Connecting..." : isConnected ? "Connected" : "Connect Wallet"}
        </button>
        {isConnected && (
          <span className="address-text">
            Connected: {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
          </span>
        )}
      </div>
      
      {aaWalletAddress && (
        <div className="wallet-info">
          <p>
            <span className="label">AA Wallet Address:</span> {aaWalletAddress}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 