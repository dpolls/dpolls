export declare const useAAtransfer: () => {
    transfer: (receiverAddress: string, amount: string, tokenAddress?: string | undefined, usePaymaster?: boolean | undefined, paymasterTokenAddress?: string | undefined, type?: number | undefined) => Promise<any>;
    estimateTransferFee: (receiverAddress: string, amount: string, tokenAddress?: string, usePaymaster?: boolean, paymasterTokenAddress?: string, type?: number) => Promise<string>;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
    reset: () => void;
};
