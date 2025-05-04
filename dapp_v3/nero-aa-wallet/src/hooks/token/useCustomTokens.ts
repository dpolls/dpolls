import { useState, useEffect, useCallback } from 'react'
import { ERC20Token, NftWithImages } from '@/types'
import {
  tokenEventEmitter,
  saveCustomERC20Token,
  getCustomERC20Tokens,
  removeCustomERC20Token,
  saveCustomERC721Token,
  getCustomERC721Tokens,
  removeCustomERC721Token,
  updateCustomERC721Token,
} from '@/utils'

export const useCustomERC20Tokens = () => {
  const [erc20Tokens, setERC20Tokens] = useState<ERC20Token[]>(() => {
    try {
      return getCustomERC20Tokens()
    } catch (error) {
      console.error('Failed to load initial tokens')
      return []
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = tokenEventEmitter.subscribe(() => {
      const tokens = getCustomERC20Tokens()
      setERC20Tokens(tokens)
      setIsLoading(false)
    })

    setIsLoading(false)
    return () => unsubscribe()
  }, [])

  const addERC20Token = useCallback(async (token: ERC20Token) => {
    try {
      await saveCustomERC20Token(token)
      setERC20Tokens((prev) => [...prev, token])
      tokenEventEmitter.emit()
    } catch (error) {
      console.error('Failed to add token')
      throw error
    }
  }, [])

  const removeERC20Token = useCallback(async (contractAddress: string) => {
    try {
      await removeCustomERC20Token(contractAddress)
      setERC20Tokens((prev) =>
        prev.filter(
          (token) => token.contractAddress.toLowerCase() !== contractAddress.toLowerCase(),
        ),
      )
      tokenEventEmitter.emit()
    } catch (error) {
      console.error('Failed to remove token')
      throw error
    }
  }, [])

  return {
    erc20Tokens,
    addERC20Token,
    removeERC20Token,
    isLoading,
  }
}

export const useCustomERC721Tokens = () => {
  const [erc721Tokens, setERC721Tokens] = useState<NftWithImages[]>(() => {
    try {
      return getCustomERC721Tokens()
    } catch (error) {
      console.error('Failed to load initial NFT tokens')
      return []
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    try {
      const tokens = getCustomERC721Tokens()
      setERC721Tokens(tokens)
    } catch (error) {
      console.error('Failed to load NFT tokens', error)
    } finally {
      setIsLoading(false)
    }

    const unsubscribe = tokenEventEmitter.subscribe(() => {
      setIsLoading(true)
      try {
        const tokens = getCustomERC721Tokens()
        setERC721Tokens(tokens)
      } catch (error) {
        console.error('Failed to update NFT tokens', error)
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const addERC721Token = useCallback((token: NftWithImages) => {
    saveCustomERC721Token(token)
    setERC721Tokens((prev) => [...prev, token])
    tokenEventEmitter.emit()
  }, [])

  const removeERC721Token = useCallback(
    (contractAddress: string, tokenId?: number) => {
      if (tokenId !== undefined) {
        const updatedTokens = erc721Tokens
          .map((token) => {
            if (token.contractAddress.toLowerCase() === contractAddress.toLowerCase()) {
              return {
                ...token,
                tokenData: token.tokenData.filter((data) => data.tokenId !== tokenId),
              }
            }
            return token
          })
          .filter((token) => token.tokenData.length > 0)

        setERC721Tokens(updatedTokens)
        // localstorage更新
        if (updatedTokens.length > 0) {
          const targetToken = updatedTokens.find(
            (t) => t.contractAddress.toLowerCase() === contractAddress.toLowerCase(),
          )
          if (targetToken) {
            updateCustomERC721Token(targetToken)
          }
        } else {
          removeCustomERC721Token(contractAddress)
        }
      } else {
        removeCustomERC721Token(contractAddress)
        setERC721Tokens((prev) =>
          prev.filter(
            (token) => token.contractAddress.toLowerCase() !== contractAddress.toLowerCase(),
          ),
        )
      }
      tokenEventEmitter.emit()
    },
    [erc721Tokens],
  )

  return { erc721Tokens, addERC721Token, removeERC721Token, isLoading }
}
