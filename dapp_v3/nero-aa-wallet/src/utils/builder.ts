import { useContext, useCallback } from 'react'
import { ethers } from 'ethers'
import { Presets } from 'userop'
import { ConfigContext } from '@/contexts'

export const useBuilderWithPaymaster = (signer: ethers.Signer | undefined) => {
  const config = useContext(ConfigContext)

  const initBuilder = useCallback(
    async (usePaymaster: boolean, paymasterTokenAddress?: string, type: number = 0) => {
      if (!signer || !config) return undefined

      const builder = await Presets.Builder.SimpleAccount.init(signer, config.rpcUrl, {
        overrideBundlerRpc: config.bundlerUrl,
      })

      if (usePaymaster) {
        const paymasterOptions = {
          apikey: config.paymasterApi,
          rpc: config.paymasterUrl,
          type,
          ...(type !== 0 && paymasterTokenAddress ? { token: paymasterTokenAddress } : {}),
        }
        builder.setPaymasterOptions(paymasterOptions)
      } else {
        builder.setPaymasterOptions(undefined)
      }

      return builder
    },
    [signer, config],
  )

  return { initBuilder }
}
