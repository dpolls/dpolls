import React, { useContext } from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { PaymasterPanel } from '@/components/features/paymaster'
import { TokenSelect } from '@/components/features/token'
import { Button } from '@/components/ui/buttons'
import { AmountInput, ToInput, TokenSelectInput } from '@/components/ui/inputs'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { MultiSendContext } from '@/contexts'
import { useScreenManager, usePaymasterContext } from '@/hooks'
import { Token, screens } from '@/types'

const MultiSendPanel: React.FC = () => {
  const { navigateTo } = useScreenManager()
  const { clearToken, selectedMode, isPaymentSelected } = usePaymasterContext()
  const {
    recipients,
    updateRecipient,
    addRecipient,
    removeRecipient,
    isTransferEnabled,
    activeTokenModalIndex,
    setActiveTokenModalIndex,
    clearAll,
  } = useContext(MultiSendContext)!

  const handleSelectToken = (token: Token, index: number) => {
    updateRecipient(index, 'token', {
      symbol: token.symbol,
      balance: token.balance,
      contractAddress: token.contractAddress,
      isNative: token.isNative,
      type: 'ERC-20',
      decimals: token.decimals,
      name: token.name,
    })
    setActiveTokenModalIndex(null)
  }

  const handleHomeClick = () => {
    clearToken()
    clearAll()
    navigateTo(screens.HOME)
  }

  const handleNext = () => {
    navigateTo(screens.MULTISENDDETAIL)
  }

  const isTransferReady =
    isTransferEnabled && selectedMode?.value !== undefined && isPaymentSelected

  if (activeTokenModalIndex !== null) {
    return (
      <TokenSelect
        onClose={() => setActiveTokenModalIndex(null)}
        onSelectToken={(token) => handleSelectToken(token, activeTokenModalIndex)}
      />
    )
  }

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto relative px-6'>
        <div className='flex flex-col flex-grow'>
          <div className='w-full h-[530px] bg-white rounded-md border border-border-primary items-center justify-center p-3 mt-2 relative'>
            <h2 className='text-xl text-center text-text-secondary mb-3'>Multi Send</h2>

            <div className='max-h-[290px] overflow-y-auto no-scrollbar mb-2'>
              {recipients.map((recipient, index) => (
                <div key={index} className='w-full mb-6'>
                  <ToInput
                    recipientAddress={recipient.address}
                    setRecipientAddress={(value) => updateRecipient(index, 'address', value)}
                    variant='multisend'
                    index={index}
                  />

                  <div className='flex gap-2'>
                    <AmountInput
                      inputAmount={recipient.amount}
                      setInputAmount={(value) => updateRecipient(index, 'amount', value)}
                      selectedToken={recipient.token}
                      variant='multisend'
                    />

                    <TokenSelectInput
                      selectedToken={recipient.token}
                      onOpenModal={() => setActiveTokenModalIndex(index)}
                      onRemove={() => removeRecipient(index)}
                      variant='multisend'
                      index={index}
                    />
                  </div>

                  <div className='mt-2 text-sm text-gray-500 flex justify-between'>
                    <span>
                      You have: {Number(recipient.token?.balance).toLocaleString()}
                      {recipient.token?.symbol}
                    </span>
                    <span>
                      Amount → {Number(recipient.amount).toLocaleString()}
                      {recipient.token?.symbol}
                    </span>
                  </div>
                </div>
              ))}

              <button onClick={addRecipient} className='w-full py-2 text-left text-sm'>
                + Add Address
              </button>
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
                onClick={handleNext}
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

export default MultiSendPanel
