import React, { createContext, useCallback, useState } from 'react'
import { ConfigContextProps, ConfigProviderProps } from '@/types'

export const ConfigContext = createContext<ConfigContextProps | undefined>(undefined)

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children, config }) => {
  const [currentNetworkIndex, setCurrentNetworkIndex] = useState(0)

  const getChainConfig = useCallback(() => {
    if (config.chains.length <= currentNetworkIndex) {
      setCurrentNetworkIndex(0)
      return config.chains[0]
    }
    return config.chains[currentNetworkIndex]
  }, [currentNetworkIndex, config])

  const switchNetwork = useCallback(() => {
    setCurrentNetworkIndex((prev) => {
      const nextIndex = prev + 1
      return nextIndex >= config.chains.length ? 0 : nextIndex
    })
  }, [config.chains.length])

  const switchToNetwork = useCallback(
    (index: number) => {
      if (index >= 0 && index < config.chains.length) {
        setCurrentNetworkIndex(index)
      }
    },
    [config.chains.length],
  )

  const chainConfig = getChainConfig()
  const {
    rpc: rpcUrl,
    explorer: explorerUrl,
    explorerAPI,
    chainId,
    name: chainName,
    networkType,
  } = chainConfig.chain

  const {
    decimals: tokenDecimals,
    name: tokenName,
    symbol: tokenSymbol,
  } = chainConfig.chain.nativeToken

  const {
    paymaster: paymasterUrl,
    paymasterAPIKey: paymasterApi,
    bundler: bundlerUrl,
  } = chainConfig.aa

  const { entryPoint, accountFactory, tokenPaymaster } = chainConfig.aaContracts

  const { clientId, uiConfig, loginConfig } = chainConfig.web3auth

  const hasWeb3AuthConfig = Boolean(chainConfig.web3auth.clientId)

  return (
    <ConfigContext.Provider
      value={{
        projectId: config.rainbowKitProjectId,
        rpcUrl,
        networkType,
        paymasterUrl,
        paymasterApi,
        walletName: config.walletName,
        walletLogo: config.walletLogo,
        walletBackground: config.iconBackground,
        explorerUrl,
        explorerAPI,
        chainId,
        chainName,
        bundlerUrl,
        contactAs: config.contactAs,
        PrivacyPolicy: config.PrivacyPolicy,
        ServiceTerms: config.ServiceTerms,
        clientId,
        uiConfig,
        loginConfig,
        tokenDecimals,
        tokenName,
        tokenSymbol,
        entryPoint,
        accountFactory,
        tokenPaymaster,
        currentNetworkIndex,
        switchNetwork,
        chains: config.chains,
        switchToNetwork,
        hasWeb3AuthConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
