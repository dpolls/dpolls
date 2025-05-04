import React, { useState, useEffect } from 'react';
import { setApiKey, API_KEY } from '../../config';
import './ApiKeyInput.css';

/**
 * Component for viewing and updating the Nero AA Platform API Key
 */
const ApiKeyInput: React.FC = () => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  // Initialize the API key from config
  useEffect(() => {
    setApiKeyState(API_KEY);
  }, []);
  
  // Update API key
  const handleUpdateApiKey = () => {
    if (!apiKey.trim()) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      setApiKey(apiKey);
      setIsUpdating(false);
    } catch (error) {
      console.error('Error updating API key:', error);
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="api-key-container">
      <h3 className="section-title">Nero API Key</h3>
      
      <div className="api-key-form">
        <div className="api-key-input-group">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
            placeholder="Enter your Nero AA Platform API Key"
            className="api-key-input"
          />
          <button
            onClick={handleUpdateApiKey}
            disabled={isUpdating || !apiKey.trim()}
            className="api-key-btn"
          >
            {isUpdating ? 'Updating...' : API_KEY ? 'Update Key' : 'Set Key'}
          </button>
        </div>
        
        {API_KEY ? (
          <div className="api-key-status">
            <span className="api-key-status-badge success">API Key Configured</span>
            <span className="api-key-preview">
              {API_KEY.substring(0, 6)}...{API_KEY.substring(API_KEY.length - 4)}
            </span>
          </div>
        ) : (
          <p className="api-key-help">
            You need an API Key from the <a href="https://aa-platform.nerochain.io/" target="_blank" rel="noreferrer">Nero AA Platform</a> to use this application.
          </p>
        )}
      </div>
    </div>
  );
};

export default ApiKeyInput; 