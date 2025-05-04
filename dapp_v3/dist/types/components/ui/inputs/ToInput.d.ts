import React from 'react';
import { ToInputProps } from '@/types';
declare const ToInput: React.FC<ToInputProps & {
    recipientAddress: string;
    setRecipientAddress: (address: string) => void;
    variant: 'send' | 'multisend';
    index?: number;
}>;
export default ToInput;
