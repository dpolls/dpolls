import React, { createContext, useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { getPaymaster } from '@/helper/getPaymaster'
import { SimpleAccount } from '@/helper/simpleAccount'
import { useEthersSigner, useConfig } from '@/hooks'
import { SignatureContextProps, ProviderProps } from '@/types'

export const SignatureContext = createContext<SignatureContextProps | undefined>(undefined)

export const SignatureProvider: React.FC<ProviderProps> = ({ children }) => {
  const { rpcUrl, bundlerUrl, entryPoint, accountFactory } = useConfig()
  const [loading, setLoading] = useState(false)
  const [AAaddress, setAAaddress] = useState<`0x${string}`>('0x')
  const [simpleAccountInstance, setSimpleAccountInstance] = useState<SimpleAccount | undefined>(
    undefined,
  )
  const signer = useEthersSigner()
  const { isConnected: isWalletConnected } = useAccount()
  const isConnected = AAaddress !== '0x' && isWalletConnected

  const signMessage = useCallback(
    async (pm?: 'token' | 'verifying' | 'legacy-token') => {
      if (!signer) {
        console.error('Signer is not available')
        return
      }

      const paymaster = pm ? getPaymaster(pm) : undefined
      try {
        setLoading(true)
        const simpleAccount = await SimpleAccount.init(signer, rpcUrl, {
          entryPoint: entryPoint,
          overrideBundlerRpc: bundlerUrl,
          factory: accountFactory,
          paymasterMiddleware: paymaster,
        })
        setSimpleAccountInstance(simpleAccount)
        const address = await simpleAccount.getSender()
        setAAaddress(address as `0x${string}`)
      } catch (e) {
        console.error('Error initializing SimpleAccount')
      } finally {
        setLoading(false)
      }
    },
    [signer, rpcUrl, bundlerUrl, entryPoint, accountFactory],
  )

  const resetSignature = useCallback(() => {
    setLoading(false)
    setAAaddress('0x')
    setSimpleAccountInstance(undefined)
  }, [])

  const getPaymasterMiddleware = (pm?: 'token' | 'verifying' | 'legacy-token') => {
    return pm ? getPaymaster(pm) : undefined
  }

  useEffect(() => {
    if (!signer) return
    resetSignature()
  }, [signer, resetSignature])

  useEffect(() => {
    if (AAaddress === '0x' && signer) {
      signMessage()
    }
  }, [AAaddress, signMessage, signer])

  return (
    <SignatureContext.Provider
      value={{
        loading,
        AAaddress,
        isConnected,
        simpleAccountInstance,
        signMessage,
        resetSignature,
        getPaymasterMiddleware,
      }}
    >
      {children}
    </SignatureContext.Provider>
  )
}
