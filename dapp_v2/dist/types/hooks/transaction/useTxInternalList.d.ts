import { TxInternalListResponse } from '@/types';
export declare function useTxInternalList(): {
    internalTxs: import("@/types").InternalTransaction[];
    isLoading: boolean;
    isError: boolean;
    mutate: import("swr").KeyedMutator<TxInternalListResponse>;
};
