import React from 'react';
import { TokenSelectInputProps } from '@/types';
declare const TokenSelectInput: React.FC<TokenSelectInputProps & {
    onOpenModal: () => void;
    variant: 'send' | 'multisend';
    onRemove?: () => void;
    index?: number;
}>;
export default TokenSelectInput;
