import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import {
  getSigner,
  getAAWalletAddress,
  mintERC20Token,
  initAAClient,
  initAABuilder
} from '../utils/aaUtils';
import { setApiKey, initApiKey, API_KEY, API_OPTIMIZATION } from '../config';

const ERC20Minter: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [aaWalletAddress, setAAWalletAddress] = useState('');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [apiKey, setUserApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('100');
  const [txHash, setTxHash] = useState('');
  const [gasMultiplier, setGasMultiplier] = useState<number>(100);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Initialize API key from storage when component mounts
  useEffect(() => {
    const apiKeyInitialized = initApiKey();
    if (apiKeyInitialized) {
      setUserApiKey(API_KEY);
      if (API_OPTIMIZATION.debugLogs) console.log("ERC20Minter: API Key loaded from storage");
    }
  }, []);

  // Connect to wallet
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const walletSigner = await getSigner();
      const address = await walletSigner.getAddress();
      
      setSigner(walletSigner);
      setUserAddress(address);
      setRecipientAddress(address); // Default to user's address
      setIsConnected(true);
      
      // Get AA wallet address
      const aaAddress = await getAAWalletAddress(walletSigner, API_KEY);
      setAAWalletAddress(aaAddress);
      
      toast.success("Wallet connected successfully!");
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  // Update API key
  const updateApiKey = () => {
    if (apiKey) {
      setApiKey(apiKey);
      toast.success("API Key updated and saved!");
    } else {
      toast.error("Please enter an API Key");
    }
  };

  // Mint ERC20 Token
  const handleMintERC20 = async () => {
    if (!signer) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!API_KEY) {
      toast.error("Please enter an API Key");
      return;
    }
    
    if (!recipientAddress || !ethers.utils.isAddress(recipientAddress)) {
      toast.error("Please enter a valid recipient address");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Use gas multiplier if it's not the default 100%
      const options = gasMultiplier !== 100 ? 
        { apiKey: API_KEY, gasMultiplier } : 
        { apiKey: API_KEY };
      
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Updated function call with correct parameter order
      const result = await mintERC20Token(
        signer,
        recipientAddress,
        amountInWei,
        0, // Payment type: 0 = free/sponsored
        '', // No token for gas payment (using sponsored gas)
        options
      );
      
      console.log("ERC20 Token Minted!", result);
      setTxHash(result.userOpHash);
      toast.success(`${amount} Test Tokens minted successfully!`);
    } catch (error: any) {
      console.error("Error minting tokens:", error);
      toast.error(error.message || "Failed to mint tokens");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="minter-container">
      <div className="minter-card">
        <h2>Mint ERC20 Test Tokens</h2>
        
        {/* Wallet Connection */}
        <div className="section">
          <h3>Step 1: Connect Your Wallet</h3>
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
        
        {/* API Key Configuration - Only shown if no API key is stored */}
        {!API_KEY && (
          <div className="section">
            <h3>Step 2: Enter Your API Key</h3>
            <div className="flex-row">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
                placeholder="Enter your API Key"
                className="input-field"
              />
              <button
                onClick={updateApiKey}
                disabled={isLoading || !apiKey}
                className="btn btn-secondary"
              >
                Set API Key
              </button>
            </div>
            <p className="help-text">
              You can get an API Key from the <a href="https://aa-platform.nerochain.io/" target="_blank" rel="noreferrer">Nero AA Platform</a>
            </p>
          </div>
        )}
        
        {/* If API Key is already set, show a simple display instead */}
        {API_KEY && (
          <div className="section">
            <h3>Step 2: API Key</h3>
            <div className="api-key-status">
              <span className="api-key-status-badge success">✓ API Key Set</span>
              <button 
                className="btn btn-small" 
                onClick={() => {
                  setUserApiKey('');
                  setApiKey('');
                  localStorage.removeItem('nerochain_api_key');
                  toast.info("API Key cleared");
                }}
              >
                Clear
              </button>
            </div>
          </div>
        )}
        
        {/* Mint ERC20 Tokens */}
        <div className="section">
          <h3>Step 3: Mint ERC20 Test Tokens</h3>
          
          {/* Token Info */}
          <div className="token-info">
            <div className="token-card">
              <div className="token-icon">🪙</div>
              <div className="token-details">
                <h4>Test Token (TEST)</h4>
                <p>This is a test ERC20 token that can be minted freely on the Nerochain testnet.</p>
              </div>
            </div>
          </div>
          
          {/* Recipient Address */}
          <div className="form-group">
            <label>Recipient Address</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="input-field"
            />
          </div>
          
          {/* Token Amount */}
          <div className="form-group">
            <label>Amount to Mint</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              min="1"
              className="input-field"
            />
            <p className="help-text">
              Enter the amount of TEST tokens you want to mint
            </p>
          </div>
          
          {/* Advanced Options Toggle */}
          <div className="advanced-toggle">
            <button 
              className="btn-link" 
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '- Hide Advanced Options' : '+ Show Advanced Options'}
            </button>
          </div>
          
          {/* Advanced Options */}
          {showAdvanced && (
            <div className="advanced-options">
              <div className="form-group">
                <label>Gas Price Multiplier (%)</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={gasMultiplier}
                    onChange={(e) => setGasMultiplier(parseInt(e.target.value))}
                    className="slider"
                  />
                  <span className="slider-value">{gasMultiplier}%</span>
                </div>
                <p className="help-text">
                  Adjust gas price to speed up transaction (may cost more)
                </p>
              </div>
            </div>
          )}
          
          {/* Mint Button */}
          <button
            onClick={handleMintERC20}
            disabled={isLoading || !isConnected || !API_KEY}
            className="btn btn-mint"
          >
            {isLoading ? "Processing..." : "Mint TEST Tokens"}
          </button>
          
          {/* Transaction Result */}
          {txHash && (
            <div className="tx-result">
              <p className="success-text">Transaction Successful!</p>
              <p className="tx-hash">
                <span className="label">TX Hash:</span> {txHash}
              </p>
              <a
                href={`https://testnet.neroscan.io/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="explorer-link"
              >
                View on Explorer
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ERC20Minter; 