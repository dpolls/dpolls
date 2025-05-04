import { UserOperation, UserOperationResultInterface } from '@/types';
export declare const useSendUserOp: () => {
    execute: (operation: UserOperation) => Promise<void>;
    executeBatch: (operations: UserOperation[]) => Promise<void>;
    sendUserOp: (usePaymaster?: boolean, paymasterTokenAddress?: string, type?: number) => Promise<boolean | null>;
    estimateUserOpFee: (usePaymaster?: boolean, paymasterTokenAddress?: string, type?: number) => Promise<string>;
    latestUserOpResult: UserOperationResultInterface | null;
    waitForUserOpResult: () => Promise<UserOperationResultInterface>;
    checkUserOpStatus: (userOpHash: string) => Promise<boolean | null>;
};
