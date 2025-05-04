import { SendData } from '@/types/hooks';
export declare const useMultiSender: () => {
    multiTransfer: (sendDataList: SendData[], usePaymaster?: boolean | undefined, paymasterTokenAddress?: string | undefined, type?: number | undefined) => Promise<any>;
    estimateMultiSendFee: (sendDataList: SendData[], usePaymaster?: boolean, paymasterTokenAddress?: string, type?: number) => Promise<string>;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
    reset: () => void;
};
