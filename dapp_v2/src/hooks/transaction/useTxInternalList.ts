import useSWR from 'swr'
import { useSignature, useConfig } from '@/hooks'
import { TxInternalListResponse } from '@/types'

export function useTxInternalList() {
  const { AAaddress } = useSignature()
  const { explorerAPI } = useConfig()
  const apiUrl = `${explorerAPI}/api`
  const getUrl = () => `${apiUrl}?module=account&action=txlistinternal&address=${AAaddress}`

  const fetcher = async (url: string): Promise<TxInternalListResponse> => {
    const response = await fetch(url)
    return response.json()
  }

  const { data, error, mutate } = useSWR<TxInternalListResponse, Error>(getUrl(), fetcher)

  return {
    internalTxs: data?.result || [],
    isLoading: !error && !data,
    isError: !!error,
    mutate,
  }
}
