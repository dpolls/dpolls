import React from 'react'
import { Card, BaseCardItem } from '@/components/ui'
import { TransactionDetailCardProps } from '@/types'
import { truncateAddress } from '@/utils'

const TransactionDetailCard: React.FC<TransactionDetailCardProps> = ({
  from,
  to,
  networkFee,
  gasTokenSymbol,
  networkType,
  header,
  amount,
  children,
}) => {
  return (
    <Card className='w-full' headerContent={header} padding={false}>
      {children && <div className='border-b-[1px] pb-2 border-bg-secondary px-4'>{children}</div>}
      <div className='border-b-[1px] py-2 gap-2 px-4'>
        <BaseCardItem label='From(You)' value={from ? truncateAddress(from) : 'N/A'} />
        {to && (
          <BaseCardItem label='To' value={to ? truncateAddress(to) : 'N/A'} className='mt-3' />
        )}
      </div>
      {amount && <div className='border-b-[1px] py-2 px-4'>{amount}</div>}
      <div className='flex flex-col py-4 space-y-4 px-4'>
        <BaseCardItem
          label='Network'
          value={
            <div className='flex items-center gap-2'>
              <span className='text-text-primary text-1.5sm font-medium'>{networkType}</span>
            </div>
          }
        />
        <BaseCardItem
          label='Network Fee'
          value={
            <div className='flex items-center gap-1'>
              <span className='text-text-primary text-1.5sm font-medium'>
                {networkFee ? networkFee : 'Calculating...'}
              </span>
              <span className='text-text-primary'>{gasTokenSymbol}</span>
            </div>
          }
        />
      </div>
    </Card>
  )
}

export default TransactionDetailCard
