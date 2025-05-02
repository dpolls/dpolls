import React from 'react';
import { Token, TokenSelectProps } from '@/types';
declare const TokenSelect: React.FC<Omit<TokenSelectProps, 'tokens' | 'onSelect' | 'selectedToken'> & {
    onSelectToken: (token: Token) => void;
}>;
export default TokenSelect;
