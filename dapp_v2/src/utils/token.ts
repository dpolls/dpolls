import NEROIcon from '@/assets/NERO-icon.svg'
import { getTokenLogo, createTokenImg } from '@/helper/getTokenImage'
import { Token, ERC20Token, ERC721Token, PaymasterToken } from '@/types'
import { formatAndRoundBalance } from '@/utils'

export async function processTokenData(
  tokenData: any[],
  tokenAddresses: string[],
): Promise<ERC20Token[]> {
  return Promise.all(
    tokenAddresses.map(async (tokenAddress, index) => {
      const [balance, decimals, symbol, name] = tokenData
        .slice(index * 4, (index + 1) * 4)
        .map((data) => data.result)

      if (
        balance === undefined ||
        decimals === undefined ||
        symbol === undefined ||
        name === undefined
      ) {
        return null
      }

      const logo = await getTokenLogo(tokenAddress)

      return {
        contractAddress: tokenAddress,
        symbol: symbol as string,
        name: name as string,
        decimals: (decimals as number).toString(),
        balance: (balance as bigint).toString(),
        logo: logo || createTokenImg(symbol as string),
        type: 'ERC-20',
      } as ERC20Token
    }),
  ).then((tokens) => tokens.filter((token): token is ERC20Token => token !== null))
}

export async function processNFTData(
  tokenData: any[],
  tokenAddresses: string[],
): Promise<ERC721Token[]> {
  return Promise.all(
    tokenAddresses.map(async (tokenAddress, index) => {
      const [balance, symbol, name] = tokenData
        .slice(index * 3, (index + 1) * 3)
        .map((data) => data.result)

      if (balance === undefined || symbol === undefined || name === undefined) {
        return null
      }

      return {
        contractAddress: tokenAddress,
        symbol: symbol as string,
        name: name as string,
        type: 'ERC-721',
        balance: (balance as bigint).toString(),
        decimals: '',
        tokenData: [],
      } as ERC721Token
    }),
  ).then((nfts) => nfts.filter((nft): nft is ERC721Token => nft !== null))
}

export interface NeroBalanceData {
  value?: bigint
  decimals?: number
}

export const createNeroToken = (
  neroBalance?: NeroBalanceData,
  includeLogoPath: boolean = false,
): Token => {
  const balance = neroBalance?.value
    ? formatAndRoundBalance(neroBalance.value, neroBalance.decimals || 18)
    : '0'

  return {
    symbol: 'NERO',
    balance,
    contractAddress: '',
    type: 'native',
    decimals: '18',
    isNative: true,
    name: 'Nero',
    ...(includeLogoPath && { logo: NEROIcon }),
  }
}

export const getSelectedTokenSymbol = (
  paymaster: boolean,
  selectedToken: string | undefined | null,
  supportedTokens: PaymasterToken[],
): string => {
  if (paymaster && selectedToken) {
    const token = supportedTokens.find((t) => t.token === selectedToken)
    return token?.symbol || selectedToken
  }
  return 'NERO'
}
