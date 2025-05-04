import { ERC20Token, ERC721Token } from '@/types';
export declare const useClassifiedTokens: () => {
    tokensWithLogos: ERC20Token[];
    nfts: ERC721Token[];
    isLoading: boolean;
    AAaddress: `0x${string}`;
};
