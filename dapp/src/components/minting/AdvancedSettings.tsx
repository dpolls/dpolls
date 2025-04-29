import React, { useState } from 'react';
import { useGasPrice } from '../../context/GasPriceContext';
import './AdvancedSettings.css';

interface AdvancedSettingsProps {
  gasMultiplier: number;
  onGasMultiplierChange: (multiplier: number) => void;
}

/**
 * Component for advanced settings like gas multiplier
 */
const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  gasMultiplier,
  onGasMultiplierChange
}) => {
  const { gasPrice } = useGasPrice();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="advanced-settings">
      <div 
        className="advanced-toggle" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="toggle-label">Advanced Settings</span>
        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>
      
      {isExpanded && (
        <div className="settings-panel">
          <div className="form-group">
            <label htmlFor="gasMultiplier">Gas Price Multiplier:</label>
            <div className="multiplier-control">
              <input
                type="range"
                id="gasMultiplier"
                min="0.7"
                max="2"
                step="0.1"
                value={gasMultiplier}
                onChange={(e) => onGasMultiplierChange(parseFloat(e.target.value))}
                className="range-input"
              />
              <span className="multiplier-value">{gasMultiplier}x</span>
            </div>
            <div className="gas-info">
              <p className="gas-price-info">
                Current gas price: {gasPrice ? `${gasPrice} Gwei` : 'Loading...'}
              </p>
              <p className="help-text">
                Adjust this multiplier to increase or decrease the gas price for faster or cheaper transactions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings; 