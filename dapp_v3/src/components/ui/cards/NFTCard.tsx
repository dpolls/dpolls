import React from 'react'
import { Card } from '@/components/ui/cards'
import { NFTCardProps } from '@/types'

const NFTCard: React.FC<NFTCardProps> = ({ nft, onClick }) => {
  return (
    <Card
      className='max-w-[10rem] max-h-[11.5rem] p-0'
      onClick={() => onClick(nft)}
      padding={false}
    >
      <div className='mx-auto max-w-[8rem] '>
        <img
          src={nft.image}
          alt={`Title is ${nft.name}`}
          className='size-[8rem] object-cover rounded-md'
        />
        <p className='mt-1 text-sm font-roboto'>{nft.name}</p>
      </div>
    </Card>
  )
}

export default NFTCard
