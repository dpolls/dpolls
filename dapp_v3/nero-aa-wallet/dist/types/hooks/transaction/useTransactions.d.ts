import { TransactionListResponse } from '@/types';
export declare function useTransactions(): {
    formattedTransactions: import("@/types").FormattedTransaction[];
    isLoading: boolean;
    isError: boolean;
    mutate: import("swr").KeyedMutator<TransactionListResponse[]>;
};
