import { OperationData } from '@/types/hooks';
export declare const useEstimateUserOpFee: () => {
    estimateUserOpFee: (operations: OperationData[], usePaymaster?: boolean, paymasterTokenAddress?: string, type?: number) => Promise<string>;
    ensurePaymasterApproval: (paymasterTokenAddress: string) => Promise<boolean>;
};
