import React, { createContext, useState, useEffect, useCallback } from 'react'
import { RecipientData, MultiSendContextProps, ProviderProps } from '@/types'
import { validateAmount, isValidAddress } from '@/utils'

export const MultiSendContext = createContext<MultiSendContextProps | undefined>(undefined)

export const MultiSendProvider: React.FC<ProviderProps> = ({ children }) => {
  const [recipients, setRecipients] = useState<RecipientData[]>([
    { address: '', amount: '', token: null },
  ])
  const [isTransferEnabled, setIsTransferEnabled] = useState(false)
  const [activeTokenModalIndex, setActiveTokenModalIndex] = useState<number | null>(null)
  const [totalAmountByToken, setTotalAmountByToken] = useState<Record<string, number>>({})

  const validateForm = useCallback(() => {
    return recipients.every((recipient) => {
      const isAddressValid = recipient.address.length > 0 && isValidAddress(recipient.address)
      const isAmountValid =
        recipient.amount.length > 0 &&
        validateAmount(
          recipient.amount,
          recipient.token?.balance || '0',
          recipient.token?.decimals || 18,
        )
      const isTokenSelected = recipient.token !== null
      return isAddressValid && isAmountValid && isTokenSelected
    })
  }, [recipients])

  const calculateTotalAmountByToken = useCallback(() => {
    return recipients.reduce(
      (acc, recipient) => {
        if (recipient.token?.symbol) {
          acc[recipient.token.symbol] =
            (acc[recipient.token.symbol] || 0) + Number(recipient.amount)
        }
        return acc
      },
      {} as Record<string, number>,
    )
  }, [recipients])

  const addRecipient = useCallback(() => {
    setRecipients((prev) => [...prev, { address: '', amount: '', token: null }])
  }, [])

  const removeRecipient = useCallback(
    (index: number) => {
      if (recipients.length > 1) {
        setRecipients((prev) => prev.filter((_, i) => i !== index))
      }
    },
    [recipients.length],
  )

  const updateRecipient = useCallback(
    (index: number, field: 'address' | 'amount' | 'token', value: any) => {
      setRecipients((prev) => {
        const newRecipients = [...prev]
        newRecipients[index] = { ...newRecipients[index], [field]: value }
        return newRecipients
      })
    },
    [],
  )

  const clearAll = useCallback(() => {
    setRecipients([{ address: '', amount: '', token: null }])
    setActiveTokenModalIndex(null)
  }, [])

  useEffect(() => {
    setIsTransferEnabled(validateForm())
  }, [validateForm])

  useEffect(() => {
    setTotalAmountByToken(calculateTotalAmountByToken())
  }, [calculateTotalAmountByToken])

  return (
    <MultiSendContext.Provider
      value={{
        recipients,
        setRecipients,
        addRecipient,
        removeRecipient,
        updateRecipient,
        isTransferEnabled,
        activeTokenModalIndex,
        setActiveTokenModalIndex,
        clearAll,
        totalAmountByToken,
      }}
    >
      {children}
    </MultiSendContext.Provider>
  )
}
