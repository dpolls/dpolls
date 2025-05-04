import { NFTCardType } from '@/types';
export declare const dummyNFTs: {
    id: string;
    name: string;
    image: string;
    description: string;
    collectionName: string;
    tokenId: string;
    contractAddress: string;
    tokenStandard: string;
    blockchain: string;
    owner: string;
    creator: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
    lastSalePrice: string;
    lastSaleDate: string;
}[];
export declare function dummyNFTCards(): NFTCardType[];
