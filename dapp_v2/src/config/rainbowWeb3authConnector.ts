import { Wallet, WalletDetailsParams } from '@rainbow-me/rainbowkit'
import { AuthAdapter } from '@web3auth/auth-adapter'
import { CHAIN_NAMESPACES, CustomChainConfig, UX_MODE, WEB3AUTH_NETWORK_TYPE } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3Auth } from '@web3auth/modal'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { Chain } from 'viem'
import { createConnector as createWagmiConnector } from 'wagmi'

interface Web3AuthConfig {
  chain: Chain
  walletConfig: {
    name: string
    logo: string
    walletBackground: string
    clientId: string
    networkType: WEB3AUTH_NETWORK_TYPE
    uiConfig: {
      appName: string
      mode: string
      useLogoLoader: boolean
      defaultLanguage: string
      theme: {
        primary: string
      }
      loginMethodsOrder: string[]
      uxMode: string
      modalZIndex: string
    }
    loginConfig: {
      google: {
        name: string
        verifier: string
        typeOfLogin: string
        clientId: string
      }
      facebook: {
        name: string
        verifier: string
        typeOfLogin: string
        clientId: string
      }
    }
  }
}

type WalletFunction = () => Wallet

export const rainbowWeb3AuthConnector = ({
  chain,
  walletConfig,
}: Web3AuthConfig): WalletFunction => {
  return () => ({
    id: walletConfig.name,
    name: walletConfig.name,
    rdns: 'web3auth',
    iconUrl: walletConfig.logo,
    iconBackground: walletConfig.walletBackground,
    installed: true,
    downloadUrls: {},
    createConnector: (walletDetails: WalletDetailsParams) => {
      const chainConfig: CustomChainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: `0x${chain.id.toString(16)}`,
        rpcTarget: chain.rpcUrls.default.http[0],
        displayName: chain.name,
        blockExplorerUrl: chain.blockExplorers?.default.url,
        ticker: chain.nativeCurrency.symbol,
        tickerName: chain.nativeCurrency.name,
      }

      const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } })

      const web3AuthInstance = new Web3Auth({
        clientId: walletConfig.clientId,
        web3AuthNetwork: walletConfig.networkType,
        privateKeyProvider: privateKeyProvider,
        uiConfig: {
          appName: walletConfig.uiConfig.appName,
          mode: 'light',
          useLogoLoader: walletConfig.uiConfig.useLogoLoader,
          defaultLanguage: 'en',
          theme: {
            primary: walletConfig.uiConfig.theme.primary,
          },
          uxMode: UX_MODE.REDIRECT,
          modalZIndex: walletConfig.uiConfig.modalZIndex,
          loginMethodsOrder: walletConfig.uiConfig.loginMethodsOrder,
        },
      })

      const web3AuthAdapterInstance = new AuthAdapter({
        privateKeyProvider: privateKeyProvider,
        adapterSettings: {
          clientId: walletConfig.clientId,
          network: walletConfig.networkType,
          uxMode: 'redirect',
          loginConfig: {
            google: {
              name: walletConfig.loginConfig.google.name,
              verifier: walletConfig.loginConfig.google.verifier,
              typeOfLogin: 'google', // Pass on the login provider of the verifier you've created
              clientId: walletConfig.loginConfig.google.clientId, // Pass on the Google `Client ID` here'
            },
            facebook: {
              name: walletConfig.loginConfig.facebook.name,
              verifier: walletConfig.loginConfig.facebook.verifier, // Pass the Verifier name here
              typeOfLogin: 'facebook', // Pass on the login provider of the verifier you've created
              clientId: walletConfig.loginConfig.facebook.clientId, // Pass on the Google `Client ID` here
            },
          },
        },
      })

      web3AuthInstance.configureAdapter(web3AuthAdapterInstance)

      return createWagmiConnector((config) => ({
        ...Web3AuthConnector({
          web3AuthInstance,
        })(config),
        ...walletDetails,
      }))
    },
  })
}
