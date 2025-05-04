import { NftWithImages } from '@/types';
export declare function useNftList(): {
    nftWithImages: NftWithImages[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};
