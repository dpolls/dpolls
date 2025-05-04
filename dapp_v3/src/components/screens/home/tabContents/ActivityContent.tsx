import React, { useMemo } from 'react'
import { TbExternalLink } from 'react-icons/tb'
import { useConfig, useTxInternalList } from '@/hooks'
import { Transaction } from '@/types'
import { truncateAddress } from '@/utils'

const ActivityContent: React.FC = () => {
  const { internalTxs } = useTxInternalList()
  const { explorerUrl } = useConfig()

  const groupedTransactions = useMemo(() => {
    const txMap = new Map<string, Transaction>()
    internalTxs.forEach((tx) => {
      if (!txMap.has(tx.hash)) {
        txMap.set(tx.hash, {
          hash: tx.hash,
          date: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
          explorerUrlTx: `${explorerUrl}/tx/${tx.hash}`,
          actions: [],
        })
      }
    })

    return Array.from(txMap.values()).sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
  }, [internalTxs, explorerUrl])

  return (
    <div className='mx-auto h-[98%] overflow-auto px-2'>
      {groupedTransactions.map((transaction) => (
        <div
          key={transaction.hash}
          className='bg-white p-4 flex items-center space-x-4 cursor-pointer border-b-[0.5px] w-[95%] mx-auto'
        >
          <div className='flex-grow'>
            <div className='flex justify-between items-center'>
              <div className='text-xs text-text-secondary mr-1'>{transaction.date}</div>
              <a
                href={transaction.explorerUrlTx}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center'
                onClick={(e) => e.stopPropagation()}
              >
                <TbExternalLink className='text-text-secondary' />
              </a>
            </div>
            <div className='text-md text-text-secondary mt-1 truncate'>
              {truncateAddress(transaction.hash)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityContent
