import { TransactionOptions, UseTransactionReturn } from '@/types';
/**
 * ブロックチェーントランザクションを実行するための汎用フック
 * @param transactionFn トランザクション関数
 * @param options 実行オプション
 * @returns トランザクション情報と実行関数
 */
export declare function useTransaction<P extends any[]>(transactionFn: (...args: P) => Promise<any>, options?: TransactionOptions): UseTransactionReturn<P>;
