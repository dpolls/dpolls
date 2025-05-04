import React from 'react';
import { useSignature, useAAtransfer, useSendUserOp, useConfig } from '@/hooks';
import '@rainbow-me/rainbowkit/styles.css';
import '@/index.css';
import { WalletConfig } from '@/types';
interface SocialWalletProps {
    config: WalletConfig;
    zIndex?: number;
    children?: React.ReactNode;
    mode?: 'sidebar' | 'button';
}
export declare const SocialWallet: React.FC<SocialWalletProps>;
export { useAAtransfer, useSignature, useSendUserOp, useConfig };
