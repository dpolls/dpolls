import React from 'react'
import QRCode from 'qrcode.react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { CopyButton } from '@/components/ui/buttons'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { useSignature, useScreenManager } from '@/hooks'
import { screens } from '@/types'
import { truncateAddress } from '@/utils'

const ReceivePanel: React.FC = () => {
  const { AAaddress } = useSignature()
  const { navigateTo } = useScreenManager()

  const handleHomeClick = () => {
    navigateTo(screens.HOME)
  }

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto px-6'>
        <div className='flex flex-col'>
          <div className='w-full h-[400px] bg-white rounded-md border border-border-primary p-3 mt-2'>
            <h2 className='text-xl text-center text-text-secondary mb-3'>Receive</h2>
            <div className='mb-3'>
              <label className='block text-text-secondary text-md mb-1'>Wallet Address</label>
              {AAaddress && (
                <CopyButton textToCopy={AAaddress} className='flex items-center'>
                  <div className='text-md mr-2'>{truncateAddress(AAaddress)}</div>
                </CopyButton>
              )}
            </div>
            <label className='block text-text-secondary text-md mt-5 mb-2'>QR Code</label>
            <div className='flex justify-center mb-3'>
              <div className='w-48 h-48 flex items-center justify-center border border-border-primary'>
                {AAaddress && <QRCode value={AAaddress} size={180} />}
              </div>
            </div>

            <div className='flex items-left mt-7'>
              <button
                onClick={handleHomeClick}
                className='flex items-center text-sm text-text-primary px-2 rounded-full'
              >
                <AiFillCaretLeft className='mr-2' />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default ReceivePanel
