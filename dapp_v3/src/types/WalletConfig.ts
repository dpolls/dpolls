import { WEB3AUTH_NETWORK_TYPE } from '@web3auth/base'
export interface WalletConfig {
  rainbowKitProjectId: string
  walletName: string
  walletLogo: string
  iconBackground: string
  contactAs: string
  PrivacyPolicy: string
  ServiceTerms: string
  chains: Array<{
    chain: {
      name: string
      logo: string
      networkType: WEB3AUTH_NETWORK_TYPE
      rpc: string
      chainId: number
      explorer: string
      explorerAPI: string
      nativeToken: {
        decimals: number
        name: string
        symbol: string
      }
    }
    aa: {
      bundler: string
      paymaster: string
      paymasterAPIKey: string
    }
    aaContracts: {
      entryPoint: string
      accountFactory: string
      tokenPaymaster: string
    }
    web3auth: {
      clientId: string
      network: string
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
  }>
}
