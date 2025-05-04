import { PaymasterToken, SponsorshipInfo } from '@/types';
export declare const useSupportedTokens: () => {
    getSupportedTokens: () => Promise<any>;
    supportedTokens: PaymasterToken[];
    sponsorshipInfo: SponsorshipInfo;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
};
