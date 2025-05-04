import React, { createContext, useState } from 'react'
import {
  UserOperation,
  UserOperationResultInterface,
  SendUserOpContextProps,
  ProviderProps,
} from '@/types'

export const SendUserOpContext = createContext<SendUserOpContextProps | undefined>(undefined)

export const SendUserOpProvider: React.FC<ProviderProps> = ({ children }) => {
  const [paymaster, setPaymaster] = useState(false)
  const [userOperations, setUserOperations] = useState<UserOperation[]>([])
  const [latestUserOpResult, setLatestUserOpResult] = useState<UserOperationResultInterface | null>(
    null,
  )
  const [isWalletPanel, setIsWalletPanel] = useState(false)

  const clearUserOperations = () => {
    setUserOperations([])
  }

  const forceOpenPanel = () => {
    setIsWalletPanel(true)
  }

  return (
    <SendUserOpContext.Provider
      value={{
        paymaster,
        setPaymaster,
        userOperations,
        setUserOperations,
        clearUserOperations,
        latestUserOpResult,
        setLatestUserOpResult,
        isWalletPanel,
        setIsWalletPanel,
        forceOpenPanel,
      }}
    >
      {children}
    </SendUserOpContext.Provider>
  )
}
