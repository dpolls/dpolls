/**
 * Interface for supported token information
 */
export interface SupportedToken {
  address: string;
  decimal: number;
  decimals?: number;
  symbol: string;
  type: number;
  price?: number;
}

/**
 * Interface for token balances object
 */
export interface TokenBalances {
  [key: string]: string;
}

/**
 * Interface for token approval status
 */
export interface TokenApprovals {
  [key: string]: boolean;
}

/**
 * Interface for token gas prices
 */
export interface TokenGasPrices {
  [tokenAddress: string]: {
    priceInToken: string;
    lastUpdated: Date;
  };
} 