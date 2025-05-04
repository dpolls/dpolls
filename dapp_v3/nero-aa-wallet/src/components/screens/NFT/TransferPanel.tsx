import React, { useState } from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { PaymasterPanel } from '@/components/features/paymaster'
import { NFTTransferPreview } from '@/components/screens'
import { Button } from '@/components/ui/buttons'
import { ToInput } from '@/components/ui/inputs'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { useNFTContext, useScreenManager, usePaymasterContext } from '@/hooks'
import { screens } from '@/types'
import { truncateAddress } from '@/utils'

const NFTTransferPanel: React.FC = () => {
  const { navigateTo } = useScreenManager()
  const {
    selectedNFT,
    recipientAddress,
    clearRecipientAddress,
    setRecipientAddress,
    isTransferEnabled,
  } = useNFTContext()
  const [isTransferPreviewOpen, setIsTransferPreviewOpen] = useState(false)
  const { isPaymentSelected, selectedMode } = usePaymasterContext()

  const handleSend = () => {
    setIsTransferPreviewOpen(true)
  }

  const handleClose = () => {
    clearRecipientAddress()
    navigateTo(screens.NFTDETAIL)
  }

  if (!selectedNFT) {
    return <p>Loading...</p>
  }

  if (isTransferPreviewOpen) {
    return <NFTTransferPreview />
  }

  const isTransferReady =
    isTransferEnabled && selectedMode?.value !== undefined && isPaymentSelected

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='flex flex-col items-center flex-grow p-6 bg-bg-primary'>
        <div className='w-full bg-white rounded-lg flex flex-col items-center justify-center p-3 border border-border-primary'>
          <div className='w-full'>
            <h2 className='text-xl text-center text-text-secondary'>Send Detail</h2>
            <ToInput
              recipientAddress={recipientAddress}
              setRecipientAddress={setRecipientAddress}
              variant='send'
            />
          </div>
        </div>
        <div className='w-full h-[24rem] my-2 p-4 bg-white rounded-md border border-border-primary relative'>
          <div className='flex'>
            <img src={selectedNFT.image} className='size-20 rounded-md'></img>
            <div className='text-text-primary ml-2'>
              <p>{selectedNFT.name}</p>
            </div>
          </div>
          <label className='block text-text-secondary text-md mt-2'>Contract Address</label>
          <p className='text-sm'>{truncateAddress(selectedNFT.contractAddress)}</p>
          <div className='flex justify-between mt-2 mb-3'>
            <div>
              <label className='block text-text-secondary text-md'>Token ID</label>
              <p className='text-sm'>{selectedNFT.tokenId}</p>
            </div>
          </div>
          <PaymasterPanel />
          <div className='absolute bottom-[-30px] left-[-30px] right-[-20px] flex justify-between p-10'>
            <Button
              onClick={handleClose}
              variant='text'
              icon={AiFillCaretLeft}
              iconPosition='left'
              className='flex items-center text-sm text-text-primary px-2 mt-1 rounded-full'
            >
              Back
            </Button>
            <Button
              onClick={handleSend}
              disabled={!isTransferReady}
              variant={isTransferReady ? 'primary' : 'secondary'}
              className={`px-6 py-2 rounded-full text-sm ${
                isTransferReady ? '' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default NFTTransferPanel
