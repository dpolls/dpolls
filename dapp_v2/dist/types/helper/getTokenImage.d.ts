export declare function getTokenLogo(customAddress: string): Promise<string | null>;
export declare const getTokenIcon: (tokenAddress: string, symbol: string, isNative?: boolean) => Promise<string>;
export declare const createTokenImg: (tokenName: string) => string;
