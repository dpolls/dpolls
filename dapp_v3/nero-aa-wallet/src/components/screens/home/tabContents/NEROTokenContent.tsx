import React, { useEffect, useState } from 'react'
import { useBalance } from 'wagmi'
import { TokenIcon, TruncatedText, TokenAmount } from '@/components/features/token'
import { useSignature, useScreenManager } from '@/hooks'
import { screens, Token } from '@/types'
import { formatAndRoundBalance, createNeroToken } from '@/utils'

const NEROTokenContent: React.FC = () => {
  const [accountBalance, setAccountBalance] = useState('0')
  const [neroToken, setNeroToken] = useState<Token | null>(null)
  const { AAaddress } = useSignature()
  const { navigateTo } = useScreenManager()
  const { data, isLoading } = useBalance({ address: AAaddress })

  const handleNEROTokenSelect = () => {
    navigateTo(screens.NEROTOKENDETAIL)
  }

  useEffect(() => {
    if (data?.value) {
      const balance = formatAndRoundBalance(data.value, data.decimals)
      setAccountBalance(balance)

      const token = createNeroToken({ value: data.value, decimals: data.decimals }, true)
      setNeroToken(token)
    }
  }, [data])

  if (isLoading) {
    return <div className='text-center py-4'>Loading...</div>
  }

  return (
    <div
      className='flex items-center justify-between py-2 border-b border-gray-200 w-[85%] mx-auto cursor-pointer hover:bg-gray-50'
      onClick={handleNEROTokenSelect}
    >
      <div className='flex items-center space-x-2 flex-shrink-0 w-1/2'>
        <TokenIcon
          tokenAddress='0x'
          symbol='NERO'
          isNative={true}
          size='sm'
          className='w-10 h-10'
          token={neroToken || undefined}
        />
        <div className='flex flex-col'>
          <TruncatedText
            text='NERO'
            fontSize='base'
            className='font-bold'
            maxWidth='max-w-[120px]'
          />
        </div>
      </div>
      <div className='flex-shrink min-w-0'>
        <TokenAmount
          amount={accountBalance}
          symbol='NERO'
          className='text-base'
          symbolClassName='text-base text-text-primary'
          containerClassName='justify-end'
        />
      </div>
    </div>
  )
}

export default NEROTokenContent
