import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_KEY, setApiKey } from '../../config';
import './ApiKeyManager.css';

interface ApiKeyManagerProps {
  onApiKeyChange?: (apiKey: string) => void;
}

/**
 * Component for managing the API key
 */
const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeyChange }) => {
  const [apiKey, setUserApiKey] = useState(API_KEY);
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Update API key when it changes externally
  useEffect(() => {
    setUserApiKey(API_KEY);
  }, [API_KEY]);
  
  // Update API key in the system
  const updateApiKey = () => {
    if (!apiKey) {
      toast.error("Please enter an API Key");
      return;
    }
    
    setApiKey(apiKey);
    toast.success("API Key saved successfully!");
    
    if (onApiKeyChange) {
      onApiKeyChange(apiKey);
    }
  };
  
  // Clear API key
  const handleClearApiKey = () => {
    // Clear API key locally (since clearApiKey doesn't exist)
    setApiKey('');
    setUserApiKey('');
    toast.info("API Key cleared");
    
    if (onApiKeyChange) {
      onApiKeyChange('');
    }
  };
  
  // Toggle API key visibility
  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };
  
  return (
    <div className="api-key-manager">
      <div className="api-key-header">
        <h3>API Key Configuration</h3>
        {API_KEY && (
          <div className="api-key-status">
            <span className="api-key-status-badge success">
              Active
            </span>
          </div>
        )}
      </div>
      
      <div className="api-key-form">
        <div className="api-key-input-group">
          <input
            type={showApiKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setUserApiKey(e.target.value)}
            placeholder="Enter your API Key"
            className="input-field"
          />
          <button
            type="button"
            onClick={toggleApiKeyVisibility}
            className="btn btn-small"
            title={showApiKey ? "Hide API Key" : "Show API Key"}
          >
            {showApiKey ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        
        <div className="api-key-actions">
          <button
            onClick={updateApiKey}
            disabled={!apiKey}
            className="btn btn-primary"
          >
            Save API Key
          </button>
          
          {API_KEY && (
            <button
              onClick={handleClearApiKey}
              className="btn btn-small"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      <div className="api-key-help">
        <p>
          You can get an API Key from the&nbsp;
          <a href="https://aa-platform.nerochain.io/" target="_blank" rel="noreferrer">
            Nero AA Platform
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyManager; 