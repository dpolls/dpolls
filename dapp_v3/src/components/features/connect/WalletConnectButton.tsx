import React from 'react'
import { WalletConnectRoundedButtonProps } from '@/types'

const WalletConnectRoundedButton: React.FC<WalletConnectRoundedButtonProps> = ({
  onClick,
  AAaddress,
  isConnected,
}) => {
  const getButtonText = () => {
    if (!isConnected) return 'CONNECT'
    return AAaddress !== '0x' ? `${AAaddress.slice(0, 6)}...${AAaddress.slice(-2)}` : 'CONNECT'
  }

  return (
    <button
      onClick={onClick}
      className='px-8 py-3 bg-black text-white rounded-full 
                 font-medium hover:bg-black/40 
                 transition-all duration-300 flex items-center justify-center
                 fixed top-[50px] right-0'
    >
      {getButtonText()}
    </button>
  )
}

export default WalletConnectRoundedButton
