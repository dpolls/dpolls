/**
 * Transaction API response interfaces
 */
import { TokenBase } from './Token'
import { StandardTransaction, TokenTransaction, InternalTransaction } from './Transaction'

// Common response structure for API responses
export interface ApiResponse<T> {
  status: string
  message: string
  result: T
}

// Response for internal transactions list
export type TxInternalListResponse = ApiResponse<InternalTransaction[]>

// Response for user tokens list
export type UserTokensResponse = ApiResponse<TokenBase[]>

// Response for transaction list
export type TransactionListResponse = ApiResponse<StandardTransaction[] | TokenTransaction[]>
