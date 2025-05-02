import React, { createContext, useState, useEffect } from 'react'
import { Token, TokenContextType, ProviderProps } from '@/types'
import { isValidAddress } from '@/utils'

export const TokenContext = createContext<TokenContextType | undefined>(undefined)

export const TokenProvider: React.FC<ProviderProps> = ({ children }) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [paymaster, setPaymaster] = useState(false)
  const [isTransferEnabled, setIsTransferEnabled] = useState(false)

  const selectToken = (token: Token) => {
    setSelectedToken(token)
  }

  const clearToken = () => {
    setSelectedToken(null)
  }

  const clearRecipientAddress = () => {
    setRecipientAddress('')
  }

  useEffect(() => {
    setIsTransferEnabled(!!recipientAddress && isValidAddress(recipientAddress) && !!selectedToken)
  }, [recipientAddress, selectedToken])

  return (
    <TokenContext.Provider
      value={{
        selectedToken,
        selectToken,
        clearToken,
        clearRecipientAddress,
        recipientAddress,
        setRecipientAddress,
        paymaster,
        setPaymaster,
        isTransferEnabled,
        setIsTransferEnabled,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
