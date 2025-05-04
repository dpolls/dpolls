import React, { useState } from 'react';
import Modal from './Modal';
import '../styles/ContextualHelp.css';

interface ContextualHelpProps {
  title: string;
  content: React.ReactNode;
  placement?: 'top-right' | 'top-left' | 'inline';
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({ 
  title, 
  content,
  placement = 'top-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button 
        className={`help-button ${placement}`}
        onClick={() => setIsOpen(true)}
        aria-label="Help"
        title={`Learn about: ${title}`}
      >
        ?
      </button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
      >
        {content}
      </Modal>
    </>
  );
};

export default ContextualHelp; 