import { useState, useEffect } from 'react'
import { getTokenIcon } from '@/helper/getTokenImage'

const iconCache: Record<string, string> = {}

export const useTokenIcon = (tokenAddress: string, symbol: string, isNative: boolean = false) => {
  const [iconUrl, setIconUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadIcon = async () => {
      try {
        if (iconCache[tokenAddress]) {
          setIconUrl(iconCache[tokenAddress])
          setIsLoading(false)
          return
        }

        const icon = await getTokenIcon(tokenAddress, symbol, isNative)
        iconCache[tokenAddress] = icon
        setIconUrl(icon)
      } catch (error) {
        console.warn('Failed to load token icon:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadIcon()
  }, [tokenAddress, symbol, isNative])

  return { iconUrl, isLoading }
}
