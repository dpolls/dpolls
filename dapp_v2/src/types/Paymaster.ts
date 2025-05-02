export interface PaymasterToken {
  token: string
  type?: string
  symbol: string
  price: string
}

export interface PaymasterData {
  paymasterAndData: string
  preVerificationGas: string
  verificationGasLimit: string
  callGasLimit: string
  userOpHash: string
  transactionHash: string | null
}

export type PaymasterModeValue = 0 | 1 | 2 | 4

export const PAYMASTER_MODE = {
  FREE_GAS: 0,
  PRE_FUND: 1,
  POST_FUND: 2,
  NATIVE: 4,
} as const

export type PaymasterMode = {
  value: PaymasterModeValue
}

// export const PAYMASTER_MODES: PaymasterMode[] = [
//   {
//     value: 0,
//     label: 'Free Gas',
//     description: 'Developer sponsors gas fees',
//   },
//   {
//     value: 1,
//     label: 'Pre-fund ERC20',
//     description: 'Pay gas fees upfront with tokens',
//   },
//   {
//     value: 2,
//     label: 'Post-fund ERC20',
//     description: 'Pay gas fees after transaction',
//   },
// ]

export interface SponsorshipInfo {
  balance: string
  freeGas: boolean
}

// Component interfaces
import { ReactNode } from 'react'
import { RefObject } from 'react'

export interface PaymentOptionProps {
  isSelected?: boolean
  isDisabled?: boolean
  onClick: () => void
  icon: ReactNode
  title: string
  subtitle: string
  rightIcon?: ReactNode
  isTokenOption?: boolean
  isNativeToken?: boolean
}

export interface TokenListProps {
  tokens: PaymasterToken[]
  selectedToken: string | null
  scrollContainerRef: RefObject<HTMLDivElement>
  onTokenClick: (token: PaymasterToken) => void
  onScrollLeft: () => void
  onScrollRight: () => void
  onBackClick: () => void
}

export interface ErrorDisplayProps {
  error: string | null
  onRetry: () => void
}
