/**
 * Transaction API response interfaces
 */
import { TokenBase } from './Token';
import { StandardTransaction, TokenTransaction, InternalTransaction } from './Transaction';
export interface ApiResponse<T> {
    status: string;
    message: string;
    result: T;
}
export type TxInternalListResponse = ApiResponse<InternalTransaction[]>;
export type UserTokensResponse = ApiResponse<TokenBase[]>;
export type TransactionListResponse = ApiResponse<StandardTransaction[] | TokenTransaction[]>;
