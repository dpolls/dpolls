import React from 'react';
import { Token, AmountInputProps } from '@/types';
declare const AmountInput: React.FC<AmountInputProps & {
    inputAmount: string;
    setInputAmount: (amount: string) => void;
    setBalance?: (balance: string) => void;
    selectedToken: Token | null;
    variant: 'send' | 'multisend';
}>;
export default AmountInput;
