import { ReactNode } from 'react'
import React from 'react'
import { BaseComponentProps } from './components'
import { Token } from './Token'

export interface BaseInputProps extends BaseComponentProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  variant?: 'send' | 'multisend'
}

export interface BaseInputComponentProps extends BaseInputProps {
  label?: string
  rightElement?: ReactNode
  leftElement?: ReactNode
  inputClassName?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  helpText?: string
  helpTextClassName?: string
  type?: string
  inputRef?: React.RefObject<HTMLInputElement>
  onClick?: () => void
  readOnly?: boolean
}

export interface ContractAddressInputProps {
  value: string
  onChange: (value: string, isValid: boolean) => void
  label?: string
  placeholder?: string
  error?: string | null
  className?: string
}

export interface TokenIdInputProps {
  value: string
  onChange: (value: string, isValid: boolean) => void
  label?: string
  placeholder?: string
  error?: string | null
  className?: string
}

export interface AmountInputProps extends BaseInputProps {
  maxValue?: string
  onMaxClick?: () => void
  inputAmount?: string
  setInputAmount?: (amount: string) => void
  setBalance?: (balance: string) => void
  selectedToken?: any
}

export interface TokenSelectInputProps extends BaseComponentProps {
  selectedToken: Token | null
  onTokenSelect?: (token: Token) => void
  disabled?: boolean
  onOpenModal?: () => void
  variant?: 'send' | 'multisend'
  onRemove?: () => void
  index?: number
}

export interface ToInputProps extends BaseInputProps {
  recipientAddress?: string
  setRecipientAddress?: (address: string) => void
  index?: number
}

export interface TokenSearchInputProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
}
