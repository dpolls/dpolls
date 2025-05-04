import React, { useEffect, useState } from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Button } from '@/components/ui/buttons'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { useNFTContext, useCustomERC721Tokens, useScreenManager } from '@/hooks'
import { screens } from '@/types'
import { truncateAddress } from '@/utils'

const NFTDetail: React.FC = () => {
  const { navigateTo } = useScreenManager()
  const { selectedNFT, clearNFT } = useNFTContext()
  const { removeERC721Token } = useCustomERC721Tokens()
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (!selectedNFT) {
      navigateTo(screens.NFT)
    }
  }, [selectedNFT, navigateTo])

  const handleClose = () => {
    clearNFT()
    navigateTo(screens.NFT)
  }

  const navigateToTransfer = () => {
    navigateTo(screens.NFTTRANSFER)
  }

  const handleHide = () => {
    if (selectedNFT) {
      removeERC721Token(selectedNFT.contractAddress, selectedNFT.tokenId)
      clearNFT()
      navigateTo(screens.NFT)
    }
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  if (!selectedNFT) {
    return <p>Loading...</p>
  }

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='h-[42rem] px-6 mt-2 relative'>
        <div className='absolute top-2 right-8 z-10'>
          <button onClick={toggleMenu} className='pt-1'>
            <BsThreeDotsVertical className='text-xl' />
          </button>
          {showMenu && (
            <div className='absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
              <div
                className='py-1'
                role='menu'
                aria-orientation='vertical'
                aria-labelledby='options-menu'
              >
                <button
                  onClick={handleHide}
                  className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  role='menuitem'
                >
                  Hide
                </button>
              </div>
            </div>
          )}
        </div>
        <div className='h-[33.1rem] bg-white rounded-md mx-auto border border-border-primary relative'>
          <div className='w-5/6 mx-auto my-5 pt-4'>
            <img
              src={selectedNFT.image}
              alt={selectedNFT.name}
              className='h-64 object-cover rounded-md mx-auto'
            />
            <p className='text-md pt-1'>{selectedNFT.name}</p>
            <label className='block text-text-secondary text-md mt-3'>Contract Address</label>
            <p className='text-md'>{truncateAddress(selectedNFT.contractAddress)}</p>

            <label className='block text-text-secondary text-md mt-3'>Token ID</label>
            <p className='text-md'>{selectedNFT.tokenId}</p>
          </div>
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
              onClick={() => navigateToTransfer()}
              variant='primary'
              className='px-6 py-2 rounded-full text-white bg-primary text-sm'
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default NFTDetail
