import React, { createContext, useState } from 'react'
import { TransactionContextProps, ProviderProps } from '@/types'

export const TransactionContext = createContext<TransactionContextProps | undefined>(undefined)

export const TransactionProvider: React.FC<ProviderProps> = ({ children }) => {
  const [transactionAddress, setTransactionAddress] = useState<string>('')
  const [balance, setBalance] = useState<string>('')

  return (
    <TransactionContext.Provider
      value={{ transactionAddress, setTransactionAddress, balance, setBalance }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
