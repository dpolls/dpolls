import { ERC721TransferParams } from '@/types';
export declare function executeERC721Transfer({ contractAddress, to, tokenId, client, simpleAccount, options, }: ERC721TransferParams): Promise<{
    transactionHash: any;
    userOpHash: any;
}>;
