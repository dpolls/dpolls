export interface TokenBase {
  balance: string
  contractAddress: string
  decimals: string
  name: string
  symbol: string
  type: string
}

export type TokenListResponse = TokenBase

export interface ERC20Token extends TokenBase {
  logo?: string
  type: 'ERC-20'
  decimals: string
}

export interface NativeToken extends TokenBase {
  logo?: string
  type: 'native'
  decimals: string
}

export interface ERC721Token extends TokenBase {
  type: 'ERC-721'
  decimals: ''
}

export type Token = (ERC20Token | NativeToken) & { isNative: boolean }

export interface TokenBasic {
  symbol: string
  amount: string
  contractAddress?: string
  value: string
}

export interface TokenData {
  tokenId: number
  tokenURI: string
  hidden?: boolean
  name?: string
  description?: string
  image?: string
  attributes?: Array<{ trait_type: string; value: string }>
}

export interface NftWithImages extends ERC721Token {
  tokenData: TokenData[]
}

export interface CloudflareNftMetadata {
  name: string
  image: string
}
