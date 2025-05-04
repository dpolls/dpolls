import React, { useContext, useState } from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { PaymasterPanel } from '@/components/features/paymaster'
import { SendUserOpDetail } from '@/components/screens/Send'
import { Button } from '@/components/ui/buttons'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { SendUserOpContext } from '@/contexts'
import { useScreenManager, usePaymasterContext } from '@/hooks'
import { screens } from '@/types'

const SendUserOpPanel: React.FC = () => {
  const [isSendDetailOpen, setIsSendDetailOpen] = useState(false)

  const { navigateTo } = useScreenManager()
  const { clearToken, selectedMode, isPaymentSelected } = usePaymasterContext()
  const { userOperations, clearUserOperations } = useContext(SendUserOpContext)!

  const handleHomeClick = () => {
    clearToken()
    clearUserOperations()
    navigateTo(screens.HOME)
  }

  const isUserOperationSet = (): boolean => {
    return userOperations && userOperations.length > 0
  }
  const replacer = (_: string, value: any) => (typeof value === 'bigint' ? value.toString() : value)

  const isTransferReady =
    isUserOperationSet() && selectedMode?.value !== undefined && isPaymentSelected

  if (isSendDetailOpen) {
    return <SendUserOpDetail />
  }

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto relative px-6'>
        <div className='flex flex-col flex-grow'>
          <div className='w-full h-[530px] bg-white rounded-md border border-border-primary items-center justify-center p-3 mt-2 relative'>
            <h2 className='text-xl text-center text-text-secondary mb-3'>Send userOperation</h2>
            <div className='w-full mb-3'>
              <div className='flex justify-between items-center'>
                <label className='block text-text-secondary text-1sm'>userOp</label>
              </div>
            </div>
            <div className='w-full bg-gray-100 p-3 rounded-md overflow-y-auto max-h-[230px] mb-4'>
              <pre className='whitespace-pre-wrap text-sm text-gray-800'>
                <code>{JSON.stringify(userOperations, replacer, 2)}</code>
              </pre>
            </div>
            <PaymasterPanel />
            <div className='absolute bottom-[-30px] left-[-30px] right-[-20px] flex justify-between p-10'>
              <Button
                onClick={handleHomeClick}
                variant='text'
                icon={AiFillCaretLeft}
                iconPosition='left'
                className='flex items-center text-sm text-text-primary px-2 mt-2 rounded-full'
              >
                Back
              </Button>
              <Button
                onClick={() => setIsSendDetailOpen(true)}
                disabled={!isTransferReady}
                variant={isTransferReady ? 'primary' : 'secondary'}
                className={`px-6 py-2 ${isTransferReady ? '' : 'opacity-50 cursor-not-allowed'}`}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default SendUserOpPanel
