import { PaymasterModeValue } from '@/types/Paymaster';
export declare const usePaymasterMode: () => {
    paymasterModeValue: PaymasterModeValue;
    isFreeGasMode: boolean;
    isPreFundMode: boolean;
    isPostFundMode: boolean;
};
