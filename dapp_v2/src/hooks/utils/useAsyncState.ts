import { useState, useCallback } from 'react'
import { AsyncState, UseAsyncStateReturn } from '@/types'

/**
 * 非同期処理を管理するフック
 * @param asyncFunction 実行する非同期関数
 * @param initialData 初期データ（オプション）
 * @returns 非同期ステートとそれを操作する関数
 */
export function useAsyncState<T, P extends any[]>(
  asyncFunction: (...params: P) => Promise<T>,
  initialData: T | null = null,
): UseAsyncStateReturn<T, P> {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  })

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: false,
    })
  }, [initialData])

  const execute = useCallback(
    async (...params: P) => {
      setState((prevState) => ({
        ...prevState,
        isLoading: true,
        isError: false,
        error: null,
      }))

      try {
        const result = await asyncFunction(...params)
        setState({
          data: result,
          isLoading: false,
          isError: false,
          error: null,
          isSuccess: true,
        })
        return result
      } catch (error) {
        setState({
          data: null,
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error : new Error(String(error)),
          isSuccess: false,
        })
        return null
      }
    },
    [asyncFunction],
  )

  return { ...state, execute, reset }
}
