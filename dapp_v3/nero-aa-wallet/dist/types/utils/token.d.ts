import { Token, ERC20Token, ERC721Token, PaymasterToken } from '@/types';
export declare function processTokenData(tokenData: any[], tokenAddresses: string[]): Promise<ERC20Token[]>;
export declare function processNFTData(tokenData: any[], tokenAddresses: string[]): Promise<ERC721Token[]>;
export interface NeroBalanceData {
    value?: bigint;
    decimals?: number;
}
export declare const createNeroToken: (neroBalance?: NeroBalanceData, includeLogoPath?: boolean) => Token;
export declare const getSelectedTokenSymbol: (paymaster: boolean, selectedToken: string | undefined | null, supportedTokens: PaymasterToken[]) => string;
