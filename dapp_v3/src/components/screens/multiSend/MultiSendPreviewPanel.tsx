import React, { useContext } from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { Button } from '@/components/ui/buttons'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { MultiSendContext } from '@/contexts'
import { useScreenManager } from '@/hooks'
import { screens } from '@/types'

const MultiSendPreviewPanel: React.FC = () => {
  const { recipients } = useContext(MultiSendContext)!
  const { navigateTo } = useScreenManager()

  const handleNext = () => {
    navigateTo(screens.MULTISENDCONFIRM)
  }

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto relative px-6'>
        <div className='flex flex-col flex-grow'>
          <div className='w-full h-[530px] bg-white rounded-md border border-border-primary p-4 mt-2 relative'>
            <h2 className='text-md text-center font-bold mb-4'>Preview</h2>

            <div className='max-h-[410px] overflow-y-auto no-scrollbar mb-4'>
              {recipients.map((recipient, index) => (
                <div key={index} className='mb-6 border-b border-gray-100 pb-4 last:border-b-0'>
                  <div className='mb-2'>
                    <h3 className='text-sm mb-1'>{index + 1}. Address</h3>
                    <p className='text-sm text-primary break-all'>{recipient.address}</p>
                  </div>

                  <div className='flex justify-between items-center mb-2'>
                    <div>
                      <h3 className='text-sm mb-1 mt-2'>Token</h3>
                      <p className='text-sm text-primary'>{recipient.token?.symbol}</p>
                    </div>
                    <div>
                      <h3 className='text-sm mb-1'>Amount</h3>
                      <p className='text-sm text-text-primary'>
                        {Number(recipient.amount).toLocaleString()} {recipient.token?.symbol}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='absolute bottom-[-30px] left-[-30px] right-[-20px] flex justify-between p-10'>
              <Button
                onClick={() => navigateTo(screens.MULTISEND)}
                variant='text'
                icon={AiFillCaretLeft}
                iconPosition='left'
                className='flex items-center text-sm text-text-primary px-2 mt-2 rounded-full'
              >
                Back
              </Button>
              <Button onClick={handleNext} variant='primary' className='px-6 py-2'>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default MultiSendPreviewPanel
