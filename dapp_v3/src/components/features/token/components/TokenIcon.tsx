import React from 'react'
import { useTokenIcon } from '@/hooks'
import { TokenIconProps } from '@/types'

const sizeMap = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
}

const TokenIcon: React.FC<TokenIconProps> = ({
  tokenAddress = '',
  symbol = '',
  isNative = false,
  size = 'md',
  className = '',
  token,
}) => {
  const { iconUrl, isLoading } = useTokenIcon(tokenAddress, symbol, isNative)
  const sizeClass =
    typeof size === 'string' && size in sizeMap ? sizeMap[size as keyof typeof sizeMap] : 'w-8 h-8'

  if (isLoading) {
    return <div className={`${sizeClass} animate-pulse rounded-full ${className}`} />
  }

  const imgSrc = token?.logo || iconUrl

  return (
    <img
      src={imgSrc}
      alt={symbol}
      className={`${sizeClass} rounded-full ${className}`}
      loading='lazy'
    />
  )
}

export default TokenIcon
