import { ExecuteTransactionParams, DAppTransactionData, WalletInfo } from '@/types';
export declare function executeTransaction({ to, value, data, client, simpleAccount, options, }: ExecuteTransactionParams): Promise<{
    transactionHash: any;
    userOpHash: any;
}>;
export declare function executeDAppTransaction(dappData: DAppTransactionData, walletInfo: WalletInfo, options?: ExecuteTransactionParams['options']): Promise<{
    transactionHash: any;
    userOpHash: any;
}>;
