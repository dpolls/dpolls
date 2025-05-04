import { UserTokensResponse } from '@/types';
export declare const useUserTokens: () => {
    userTokens: UserTokensResponse | undefined;
    error: Error | undefined;
    isLoading: boolean;
    AAaddress: string;
};
