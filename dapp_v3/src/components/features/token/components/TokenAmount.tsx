import React from 'react'
import { TruncatedText } from '@/components/features/token'
import { TokenAmountProps } from '@/types'
import { formatNumber } from '@/utils'

const TokenAmount: React.FC<TokenAmountProps> = ({
  amount,
  symbol,
  className = '',
  symbolClassName = '',
  containerClassName = '',
  showFullAmount = false,
  amountFontSize = '',
}) => {
  const formattedAmount = showFullAmount ? amount : formatNumber(amount)

  return (
    <span className={`flex items-baseline flex-wrap ${containerClassName}`}>
      <TruncatedText
        text={formattedAmount}
        className={`mr-1 ${amountFontSize} ${className}`}
        maxWidth='max-w-[200px]'
        fontSize='2xl'
        withTooltip={true}
      />
      <span className={`text-2xl shrink-0 ${symbolClassName}`}>{symbol}</span>
    </span>
  )
}

export default TokenAmount
