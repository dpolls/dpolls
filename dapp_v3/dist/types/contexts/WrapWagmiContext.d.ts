import React from 'react';
interface WrapWagmiContextProps {
    entryPoint?: string;
    projectId?: string;
    zIndex?: number;
    children?: React.ReactNode;
}
declare const WrapWagmiContext: React.Context<WrapWagmiContextProps | undefined>;
export declare const WrapWagmiProvider: React.FC<WrapWagmiContextProps>;
export { WrapWagmiContext };
export type { WrapWagmiContextProps };
