import React from 'react'
import { useBalance } from 'wagmi'
import { TokenIcon, TokenAmount, TruncatedText } from '@/components/features/token'
import { BalanceBottomNavigation } from '@/components/ui/navigation'
import { useSignature } from '@/hooks'
import { BalancePanelProps } from '@/types'
import { formatAndRoundBalance } from '@/utils'

const BalancePanel: React.FC<BalancePanelProps> = ({
  showIcon = false,
  showBalanceLabel = true,
}) => {
  const { AAaddress } = useSignature()
  const { data, isLoading } = useBalance({ address: AAaddress })

  const accountBalance = data?.value ? formatAndRoundBalance(data.value.toString()) : '0'

  return (
    <>
      <div className='bg-white h-31 rounded-md mx-auto border border-border-primary mt-3'>
        <div className='p-6 mb-2'>
          {showIcon && (
            <div className='flex items-center pb-3'>
              <TokenIcon
                tokenAddress='0x'
                symbol='NERO'
                isNative={true}
                size='sm'
                className='mr-2'
              />
              <TruncatedText text={'NERO'} fontSize='sm' maxWidth='max-w-[200px]' />
            </div>
          )}
          {showBalanceLabel && <p className='text-sm pb-3'>Balance</p>}
          <div className='flex justify-center'>
            {isLoading ? (
              <p className='text-2xl'>Loading balance...</p>
            ) : (
              <TokenAmount
                amount={accountBalance}
                symbol='NERO'
                amountFontSize='text-4xl'
                symbolClassName='text-2xl text-text-primary'
                containerClassName='break-all'
              />
            )}
          </div>
        </div>
      </div>

      <div className='mx-auto mt-4'>
        <BalanceBottomNavigation />
      </div>
    </>
  )
}

export default BalancePanel
