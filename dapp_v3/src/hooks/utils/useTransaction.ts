import { useState, useCallback } from 'react'
import { useAsyncState } from './useAsyncState'
import { TransactionOptions, UseTransactionReturn } from '@/types'

/**
 * ブロックチェーントランザクションを実行するための汎用フック
 * @param transactionFn トランザクション関数
 * @param options 実行オプション
 * @returns トランザクション情報と実行関数
 */
export function useTransaction<P extends any[]>(
  transactionFn: (...args: P) => Promise<any>,
  options: TransactionOptions = {},
): UseTransactionReturn<P> {
  const [txHash, setTxHash] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<any | null>(null)

  const { isLoading, isError, error, isSuccess, execute } = useAsyncState(async (...args: P) => {
    try {
      // トランザクション実行
      const result = await transactionFn(...args)

      // トランザクションハッシュが返ってきたと想定
      if (result?.hash) {
        setTxHash(result.hash)
      }

      // レシートがあればセット
      if (result?.receipt) {
        setReceipt(result.receipt)
      }

      if (options.onSuccess) {
        options.onSuccess(result)
      }

      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      if (options.onError) {
        options.onError(error)
      }
      throw error
    }
  })

  const reset = useCallback(() => {
    setTxHash(null)
    setReceipt(null)
  }, [])

  return {
    txHash,
    receipt,
    isLoading,
    isError,
    error,
    isSuccess,
    execute,
    reset,
  }
}
