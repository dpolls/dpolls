import React, { useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import CodeBlock from './CodeBlock';
import '../styles/TourGuide.css';

// Define tour steps with proper content
const tourSteps: Step[] = [
  {
    target: '.section:first-child .flex-row button',
    content: (
      <div>
        <h3>Connect Wallet Button</h3>
        <p>This button initiates connection to your browser wallet (like MetaMask) and generates an Account Abstraction wallet address.</p>
        <CodeBlock code={`
const connectWallet = async () => {
  // Get signer from browser wallet
  const signer = await getSigner();
  
  // Get your regular wallet address
  const address = await signer.getAddress();
  
  // Generate your AA wallet address
  const aaWalletAddress = await getAAWalletAddress(signer);
}
        `} language="typescript" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.aa-wallet-info',
    content: (
      <div>
        <h3>ACCOUNT ABSTRACTION WALLET</h3>
        <p>This is your AA wallet address - a smart contract wallet that enables gasless transactions.</p>
      </div>
    ),
  },
  {
    target: '.form-group:first-of-type input[type="text"]',
    content: (
      <div>
        <h3>Recipient Address</h3>
        <p>This is the wallet address that will receive the minted NFT.</p>
      </div>
    ),
  },
  {
    target: '.label-with-help',
    content: (
      <div>
        <h3>Payment Types</h3>
        <p>Nerochain Paymaster supports three payment types: Sponsored, Prepay, and Postpay.</p>
      </div>
    ),
  },
  {
    target: 'button.btn.btn-primary:not(.btn-connected)',
    content: (
      <div>
        <h3>Mint Operation Button</h3>
        <p>This button triggers a mint operation using Account Abstraction.</p>
      </div>
    ),
  },
];

interface TourGuideProps {
  autoStart?: boolean;
}

const TourGuide: React.FC<TourGuideProps> = ({ autoStart = false }) => {
  const [runTour, setRunTour] = useState(autoStart);

  const handleJoyrideCallback = (data: CallBackProps) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      setRunTour(false);
    }
  };

  return (
    <>
      <div className="tour-button-container">
        <button 
          onClick={() => setRunTour(true)} 
          className="tour-button-fixed"
          style={{ display: runTour ? 'none' : 'flex' }}
        >
          <span role="img" aria-label="rocket">🚀</span> START INTERACTIVE TOUR
        </button>
      </div>
      
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#000000',
            zIndex: 10000,
            arrowColor: '#fff',
            backgroundColor: '#fff',
            textColor: '#000',
          }
        }}
      />
    </>
  );
};

export default TourGuide; 