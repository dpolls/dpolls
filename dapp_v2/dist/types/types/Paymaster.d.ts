export interface PaymasterToken {
    token: string;
    type?: string;
    symbol: string;
    price: string;
}
export interface PaymasterData {
    paymasterAndData: string;
    preVerificationGas: string;
    verificationGasLimit: string;
    callGasLimit: string;
    userOpHash: string;
    transactionHash: string | null;
}
export type PaymasterModeValue = 0 | 1 | 2 | 4;
export declare const PAYMASTER_MODE: {
    readonly FREE_GAS: 0;
    readonly PRE_FUND: 1;
    readonly POST_FUND: 2;
    readonly NATIVE: 4;
};
export type PaymasterMode = {
    value: PaymasterModeValue;
};
export interface SponsorshipInfo {
    balance: string;
    freeGas: boolean;
}
import { ReactNode } from 'react';
import { RefObject } from 'react';
export interface PaymentOptionProps {
    isSelected?: boolean;
    isDisabled?: boolean;
    onClick: () => void;
    icon: ReactNode;
    title: string;
    subtitle: string;
    rightIcon?: ReactNode;
    isTokenOption?: boolean;
    isNativeToken?: boolean;
}
export interface TokenListProps {
    tokens: PaymasterToken[];
    selectedToken: string | null;
    scrollContainerRef: RefObject<HTMLDivElement>;
    onTokenClick: (token: PaymasterToken) => void;
    onScrollLeft: () => void;
    onScrollRight: () => void;
    onBackClick: () => void;
}
export interface ErrorDisplayProps {
    error: string | null;
    onRetry: () => void;
}
