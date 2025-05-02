import { ethers } from 'ethers'
import { Token } from './Token'

// 非同期状態管理のインターフェース
export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isSuccess: boolean
}

export interface UseAsyncStateReturn<T, P extends any[]> extends AsyncState<T> {
  execute: (...params: P) => Promise<T | null>
  reset: () => void
}

// トランザクション実行のインターフェース
export interface TransactionOptions {
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
}

export interface TransactionState {
  txHash: string | null
  receipt: any | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isSuccess: boolean
}

export interface UseTransactionReturn<P extends any[]> extends TransactionState {
  execute: (...args: P) => Promise<any>
  reset: () => void
}

// LocalStorage関連のインターフェース
export interface UseLocalStorageReturn<T> {
  storedValue: T
  setValue: (value: T | ((val: T) => T)) => void
  removeValue: () => void
}

//contract validation

export type ContractType = 'ERC20' | 'ERC721'
export interface UseContractValidationProps {
  contractAddress: string
  tokenId?: string
  contractType: ContractType
}

export interface ContractValidationResult {
  isValidContract: boolean
  contractInfo: any[] | undefined
  isError: boolean
  isLoading: boolean
}

export interface OperationData {
  contractAddress: string
  abi: any
  function: string
  params: any[]
  value?: ethers.BigNumberish
}

export interface SendData {
  receiverAddress: string
  amount: string
  token: Token | null
}
