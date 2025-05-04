import React from 'react'
import { CiPower } from 'react-icons/ci'
import NEROIcon from '@/assets/NERO-icon.png'
import { WalletConnectSidebarProps } from '@/types'

const WalletConnectButton: React.FC<WalletConnectSidebarProps> = ({ onClick }) => {
  return (
    <div
      className={`w-12 'h-[100px]' bg-black/30 backdrop-blur-sm rounded-lg flex flex-col items-center transition-all duration-300`}
    >
      <div className='flex-1 flex flex-col items-center gap-6 pt-4'>
        <div className='w-8 h-8'>
          <img src={NEROIcon} alt='neo' className='w-full h-full' />
        </div>
      </div>

      <div className='pb-4 flex flex-col gap-4 pt-3'>
        <button
          onClick={onClick}
          className='w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-text-tertiary transition-colors'
        >
          <CiPower size={24} />
        </button>
      </div>
    </div>
  )
}

export default WalletConnectButton
