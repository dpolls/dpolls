import React from 'react';
import './RecipientInput.css';

interface RecipientInputProps {
  recipientAddress: string;
  onRecipientChange: (address: string) => void;
}

/**
 * Component for inputting the recipient address
 */
const RecipientInput: React.FC<RecipientInputProps> = ({
  recipientAddress,
  onRecipientChange
}) => {
  return (
    <div className="form-group">
      <label htmlFor="recipientAddress">Recipient Address:</label>
      <input
        type="text"
        id="recipientAddress"
        className="form-control"
        placeholder="0x..."
        value={recipientAddress}
        onChange={(e) => onRecipientChange(e.target.value)}
      />
      <p className="help-text">
        Enter the wallet address that should receive the NFT. If left empty, your connected wallet address will be used.
      </p>
    </div>
  );
};

export default RecipientInput; 