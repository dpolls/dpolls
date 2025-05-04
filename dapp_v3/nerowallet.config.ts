import NEROLogoSquareIcon from './src/assets/NERO-Logo-square.svg'
import { WEB3AUTH_NETWORK_TYPE } from '@web3auth/base'

const config = {
  rainbowKitProjectId: '04309ed1007e77d1f119b85205bb779d',
  walletName: 'NERO wallet',
  walletLogo: NEROLogoSquareIcon,
  iconBackground: '#fff',
  contactAs: 'https://discord.com/invite/nerochainofficial',
  PrivacyPolicy: 'https://www.app.testnet.nerochain.io/privacy',
  ServiceTerms: 'https://docs.nerochain.io/',
  chains: [
    {
      chain: {
        name: 'NERO Testnet',
        logo: NEROLogoSquareIcon,
        networkType: 'testnet' as WEB3AUTH_NETWORK_TYPE,
        rpc: 'https://rpc-testnet.nerochain.io',
        chainId: 689,
        explorer: 'https://testnet.neroscan.io',
        explorerAPI: 'https://api-testnet.neroscan.io',
        nativeToken: {
          decimals: 18,
          name: 'NERO',
          symbol: 'NERO',
        },
      },
      aa: {
        bundler: 'https://bundler.service.nerochain.io',
        paymaster: 'https://paymaster-testnet.nerochain.io',
        paymasterAPIKey: '',
      },
      aaContracts: {
        entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
        accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
        tokenPaymaster: '0x5a6680dFd4a77FEea0A7be291147768EaA2414ad',
      },
      web3auth: {
        clientId: import.meta.env.VITE_TESTNET_WEB3AUTH_ID ?? '',
        network: 'testnet',
        uiConfig: {
          appName: 'NERO',
          mode: 'light',
          useLogoLoader: true,
          defaultLanguage: 'en',
          theme: {
            primary: '#768729',
          },
          loginMethodsOrder: ['google', 'facebook', 'discord'],
          uxMode: 'redirect',
          modalZIndex: '2147483647',
        },
        loginConfig: {
          google: {
            name: 'google',
            verifier: 'NeroTest-Google-Maintest',
            typeOfLogin: 'google',
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          },
          facebook: {
            name: 'facebook',
            verifier: 'NeroTest-Facebook-Maintest',
            typeOfLogin: 'facebook',
            clientId: import.meta.env.VITE_FACEBOOK_CLIENT_ID,
          },
        },
      },
    },
    {
      chain: {
        name: 'NERO Mainnet',
        logo: NEROLogoSquareIcon,
        networkType: 'mainnet' as WEB3AUTH_NETWORK_TYPE,
        rpc: 'https://rpc.nerochain.io',
        chainId: 1689,
        explorer: 'https://neroscan.io',
        explorerAPI: 'https://api.neroscan.io',
        nativeToken: {
          decimals: 18,
          name: 'NERO',
          symbol: 'NERO',
        },
      },
      aa: {
        bundler: 'https://bundler-mainnet.nerochain.io',
        paymaster: 'https://paymaster-mainnet.nerochain.io',
        paymasterAPIKey: "",
      },
      aaContracts: {
        entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
        accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
        tokenPaymaster: '0xC42E90D29D478ccFeCC28d3B838824E57e51F284',
      },
      web3auth: {
        clientId: import.meta.env.VITE_MAINNET_WEB3AUTH_ID ?? '',
        network: 'mainnet',
        uiConfig: {
          appName: 'NERO',
          mode: 'light',
          useLogoLoader: true,
          defaultLanguage: 'en',
          theme: {
            primary: '#768729',
          },
          loginMethodsOrder: ['google', 'facebook', 'discord'],
          uxMode: 'redirect',
          modalZIndex: '2147483647',
        },
        loginConfig: {
          google: {
            name: 'google',
            verifier: 'NeroTest-Google-Maintest',
            typeOfLogin: 'google',
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          },
          facebook: {
            name: 'facebook',
            verifier: 'NeroTest-Facebook-Maintest',
            typeOfLogin: 'facebook',
            clientId: import.meta.env.VITE_FACEBOOK_CLIENT_ID,
          },
        },
      },
    },
  ],
}

export default config
