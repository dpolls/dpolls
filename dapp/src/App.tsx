import React, { useEffect, useState } from 'react';
import './App.css';
import MintOperationContainer from './components/minting/MintOperationContainer';
import TestTokenMinting from './components/minting/TestTokenMinting';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initApiKey } from './config';
import TourGuide from './components/TourGuide';
import { WalletProvider, useWallet } from './context/WalletContext';
import { TokenProvider } from './context/TokenContext';
import { GasPriceProvider } from './context/GasPriceContext';

// Wallet connector component
const WalletConnector = () => {
  const { walletState, connectWallet, disconnectWallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="wallet-connector">
      {walletState.isConnected ? (
        <div className="wallet-connected-info">
          <div className="wallet-info">
            <span className="wallet-address">
              {walletState.userAddress.substring(0, 6)}...{walletState.userAddress.substring(walletState.userAddress.length - 4)}
            </span>
            <button onClick={disconnectWallet} className="btn btn-secondary disconnect-btn">
              Disconnect
            </button>
          </div>
          {walletState.aaWalletAddress && (
            <div className="aa-wallet-info">
              <span className="aa-wallet-label">AA Wallet:</span>
              <span className="aa-wallet-address">
                {walletState.aaWalletAddress.substring(0, 6)}...{walletState.aaWalletAddress.substring(walletState.aaWalletAddress.length - 4)}
              </span>
              <button 
                onClick={() => navigator.clipboard.writeText(walletState.aaWalletAddress)}
                className="btn-copy"
                title="Copy address"
              >
                📋
              </button>
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={handleConnect} 
          disabled={isConnecting} 
          className="btn btn-primary connect-btn"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
};

// Main App component
function App() {
  // Initialize API key from storage when app loads
  useEffect(() => {
    initApiKey();
  }, []);

  // State for active tab
  const [activeTab, setActiveTab] = useState<'nft' | 'token'>('nft');

  return (
    <WalletProvider>
      <TokenProvider>
        <GasPriceProvider>
          <div className="App" data-tour="app-container">
            <TourGuide autoStart={false} />
            <header className="App-header">
              <div className="nero-brand">
                <h1 className="pixelated">NEROCHAIN</h1>
                <div className="brand-accent">ACCOUNT ABSTRACTION</div>
              </div>
              <p className="subtitle">Build gasless transactions with Paymaster support</p>
              <WalletConnector />
            </header>
            
            <main className="App-main">
              <div className="tab-navigation">
                <button 
                  className={`tab-button ${activeTab === 'nft' ? 'active' : ''}`}
                  onClick={() => setActiveTab('nft')}
                >
                  Poll Creation
                </button>
              </div>

              {activeTab === 'nft' ? (
                <MintOperationContainer />
              ) : (
                <TestTokenMinting />
              )}
            </main>
            
            <footer className="App-footer">
              <div className="footer-content">
                <p>© 2023 Nerochain - <a href="https://nerochain.io" target="_blank" rel="noreferrer">nerochain.io</a></p>
                <div className="footer-links">
                  <a href="https://docs.nerochain.io" target="_blank" rel="noreferrer">Docs</a>
                  <a href="https://discord.gg/nerochain" target="_blank" rel="noreferrer">Discord</a>
                  <a href="https://github.com/nerochain" target="_blank" rel="noreferrer">GitHub</a>
                </div>
              </div>
            </footer>
            
            <ToastContainer position="bottom-right" theme="dark" />
          </div>
        </GasPriceProvider>
      </TokenProvider>
    </WalletProvider>
  );
}

export default App; 