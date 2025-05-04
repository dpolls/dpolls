import React from 'react';
import { useGasPrice } from '../../context/GasPriceContext';
import './GasPrice.css';

interface GasPriceProps {
  showRefreshButton?: boolean;
}

/**
 * Component to display current gas prices
 */
const GasPrice: React.FC<GasPriceProps> = ({ showRefreshButton = true }) => {
  const { gasPriceInfo, fetchGasPrice, formatLastUpdated } = useGasPrice();
  
  return (
    <div className="gas-price-section">
      <div className="gas-price-header">
        <h3>Network Gas Price</h3>
        {showRefreshButton && (
          <button 
            onClick={fetchGasPrice} 
            className="btn btn-small"
            disabled={gasPriceInfo.isLoading}
          >
            {gasPriceInfo.isLoading ? "Updating..." : "Refresh"}
          </button>
        )}
      </div>
      
      <div className="gas-price-info">
        <div className="gas-price-value">
          <span className="gas-price-label">Current Gas Price:</span>
          {gasPriceInfo.gasPrice === '0' ? (
            <span className="gas-price-unavailable">
              Not available 
              <button 
                onClick={fetchGasPrice} 
                className="btn btn-small btn-inline"
                disabled={gasPriceInfo.isLoading}
              >
                Try again
              </button>
            </span>
          ) : (
            <span className="gas-price">{gasPriceInfo.gasPriceGwei} Gwei</span>
          )}
        </div>
        <div className="gas-price-updated">
          {gasPriceInfo.gasPrice !== '0' ? 
            `Last updated: ${formatLastUpdated(gasPriceInfo.lastUpdated)}` : 
            'Gas price information not available. Try refreshing after connecting your wallet.'
          }
        </div>
        <div className="gas-price-note">
          <p>Note: Actual gas costs may vary based on transaction complexity and network conditions.</p>
        </div>
      </div>
    </div>
  );
};

export default GasPrice; 