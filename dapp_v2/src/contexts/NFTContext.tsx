import React, { createContext, useState, useEffect } from 'react'
import { NFTCardType, NFTContextType, ProviderProps } from '@/types'
import { isValidAddress } from '@/utils'

export const NFTContext = createContext<NFTContextType | undefined>(undefined)

export const NFTProvider: React.FC<ProviderProps> = ({ children }) => {
  const [selectedNFT, setSelectedNFT] = useState<NFTCardType | null>(null)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [paymaster, setPaymaster] = useState(false)
  const [isTransferEnabled, setIsTransferEnabled] = useState(false)

  const selectNFT = (nft: NFTCardType) => {
    setSelectedNFT(nft)
  }

  const clearNFT = () => {
    setSelectedNFT(null)
  }

  const clearRecipientAddress = () => {
    setRecipientAddress('')
  }

  useEffect(() => {
    setIsTransferEnabled(!!recipientAddress && isValidAddress(recipientAddress) && !!selectedNFT)
  }, [recipientAddress, selectedNFT])

  return (
    <NFTContext.Provider
      value={{
        selectedNFT,
        selectNFT,
        clearNFT,
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
    </NFTContext.Provider>
  )
}
