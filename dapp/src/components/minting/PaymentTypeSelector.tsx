import React from 'react';
import { ContextualHelp } from '../common/ContextualHelp';
import { CodeBlock } from '../common/CodeBlock';
import './PaymentTypeSelector.css';

interface PaymentTypeSelectorProps {
  selectedPaymentType: string;
  onPaymentTypeChange: (paymentType: string) => void;
}

/**
 * Component for selecting payment type options
 */
const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({
  selectedPaymentType,
  onPaymentTypeChange
}) => {
  return (
    <div className="payment-type-selector">
      <div className="label-with-help">
        <label htmlFor="paymentType">Payment Type:</label>
        <ContextualHelp
          title="Payment Types"
          placement="inline"
          content={
            <>
              <p>Choose how gas fees are paid for your transaction:</p>
              <ul>
                <li><strong>Sponsored (Free):</strong> Gas costs covered by the application.</li>
                <li><strong>Prepay:</strong> Pay upfront with ERC20 tokens.</li>
                <li><strong>Postpay:</strong> Pay exact costs after the transaction with ERC20 tokens.</li>
              </ul>
              <p>In your code, you can set the payment type with:</p>
              <CodeBlock
                code={`
// Set the payment type
builder.setPaymasterOptions({
  type: "SPONSORED" // or "PREPAY" or "POSTPAY"
});`}
                language="javascript"
              />
            </>
          }
        />
      </div>
      <select
        id="paymentType"
        className="select-field"
        value={selectedPaymentType}
        onChange={(e) => onPaymentTypeChange(e.target.value)}
      >
        <option value="SPONSORED">Sponsored (Free)</option>
        <option value="PREPAY">Prepay - Pay upfront</option>
        <option value="POSTPAY">Postpay - Pay after transaction</option>
      </select>
    </div>
  );
};

export default PaymentTypeSelector; 