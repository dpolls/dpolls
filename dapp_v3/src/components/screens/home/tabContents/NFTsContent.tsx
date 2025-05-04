import React, { useState } from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { ImportNFT } from '@/components/features/nft'
import { NFTCard } from '@/components/ui/cards'
import { useNFTContext, useNftList, useScreenManager } from '@/hooks'
import { NFTCardType, screens } from '@/types'

const NFTsContent: React.FC = () => {
  const { selectNFT } = useNFTContext()
  const { navigateTo } = useScreenManager()
  const { nftWithImages, isLoading } = useNftList()
  const [showImportModal, setShowImportModal] = useState(false)

  const handleClickNFT = (nft: NFTCardType) => {
    selectNFT(nft)
    navigateTo(screens.NFTDETAIL)
  }

  const handleImportSuccess = () => {
    setShowImportModal(false)
  }

  if (isLoading) {
    return <div className='text-center py-4'>Loading...</div>
  }

  if (!nftWithImages) {
    return <div className='text-center py-4'>no NFTs</div>
  }

  const transformedNFTs: NFTCardType[] = nftWithImages.flatMap(
    ({ tokenData, ...nftWithoutTokenData }) =>
      tokenData.map((tokenDatum) => ({
        ...nftWithoutTokenData,
        ...tokenDatum,
      })),
  )

  return (
    <div className='flex flex-col h-full'>
      {showImportModal ? (
        <div className='flex flex-col h-full w-full relative'>
          <div className='flex-grow flex items-center justify-center'>
            <div className='w-full max-w-md p-4 bg-white rounded'>
              <ImportNFT onSuccess={handleImportSuccess} />
            </div>
          </div>
          <div className='absolute bottom-[-25px] left-[-20px] flex justify-between p-10'>
            <button
              onClick={() => setShowImportModal(false)}
              className='flex items-center text-sm text-text-primaryrounded-full'
            >
              <AiFillCaretLeft className='mr-2' />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className='flex-grow overflow-auto'>
            <div className='grid grid-cols-2 gap-4 mt-5'>
              {transformedNFTs.map((nft, index) => (
                <NFTCard key={index} nft={nft} onClick={() => handleClickNFT(nft)} />
              ))}
            </div>
          </div>
          <div className='mx-auto w-[85%] mt-2 mb-2'>
            <button onClick={() => setShowImportModal(true)} className='text-blue-400'>
              + Import NFT
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default NFTsContent
