import React, { useState, useEffect, useContext } from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { Button } from '@/components/ui/buttons'
import { LoadingScreen } from '@/components/ui/feedback'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { MultiSendContext } from '@/contexts'
import {
  useSimpleAccount,
  useMultiSender,
  useResetContexts,
  useScreenManager,
  usePaymasterContext,
  usePaymasterMode,
} from '@/hooks'
import { screens } from '@/types'

const MultiSendConfirmPanel: React.FC = () => {
  const { navigateTo } = useScreenManager()
  const { recipients, clearAll } = useContext(MultiSendContext)!
  const {
    paymaster,
    selectedToken,
    supportedTokens: paymasterSelectedToken,
  } = usePaymasterContext()
  const { AAaddress } = useSimpleAccount()
  const { multiTransfer, estimateMultiSendFee } = useMultiSender()
  const { paymasterModeValue } = usePaymasterMode()
  const { resetAllContexts } = useResetContexts()
  const [estimatedGasCost, setEstimatedGasCost] = useState<string>('Calculating...')

  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [userOpResult, setUserOpResult] = useState(false)

  const selectedPaymasterToken = paymasterSelectedToken.find(
    (token) => token.token === selectedToken,
  )

  const tokenTotals = recipients.reduce(
    (acc, recipient) => {
      const symbol = recipient.token?.symbol || 'Unknown'
      acc[symbol] = (acc[symbol] || 0) + Number(recipient.amount)
      return acc
    },
    {} as Record<string, number>,
  )

  useEffect(() => {
    const estimateGasCost = async () => {
      if (!AAaddress || AAaddress === '0x') {
        return
      }

      try {
        if (paymasterModeValue === 0) {
          setEstimatedGasCost('0')
          return
        }

        if (recipients.length === 0) {
          setEstimatedGasCost('0.0001')
          return
        }

        const validRecipients = recipients.every((r) => r.token !== null)
        if (!validRecipients) {
          setEstimatedGasCost('0.0001')
          return
        }

        // 送信データを準備
        const sendDataList = recipients.map((recipient) => ({
          receiverAddress: recipient.address,
          amount: recipient.amount,
          token: recipient.token,
        }))

        try {
          // ガス見積もりを実行
          const fee = await estimateMultiSendFee(
            sendDataList,
            paymaster,
            selectedToken || undefined,
            paymasterModeValue,
          )
          setEstimatedGasCost(fee)
        } catch (estimateError) {
          setEstimatedGasCost('0.0001')
        }
      } catch (error) {
        setEstimatedGasCost('0.0001')
      }
    }

    estimateGasCost()
  }, [AAaddress, recipients, selectedToken, paymasterModeValue, paymaster, estimateMultiSendFee])

  useEffect(() => {
    if (completed) {
      const timer = setTimeout(() => {
        setCompleted(false)
        clearAll()
        resetAllContexts()
        navigateTo(screens.ACTIVITY)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [completed, navigateTo, clearAll, resetAllContexts])

  const handleConfirm = async () => {
    try {
      setLoading(true)

      if (!recipients.length) {
        throw new Error('No recipients specified')
      }

      // 各受信者のトークン情報を確認
      const validRecipients = recipients.every((r) => r.token !== null)
      if (!validRecipients) {
        throw new Error('Some recipients have missing token information')
      }

      const sendDataList = recipients.map((recipient) => ({
        receiverAddress: recipient.address,
        amount: recipient.amount,
        token: recipient.token,
      }))

      try {
        const result = await multiTransfer(
          sendDataList,
          paymaster,
          selectedToken || undefined,
          paymasterModeValue,
        )

        if (result) {
          setUserOpResult(true)
          setLoading(false)
          setCompleted(true)
        } else {
          throw new Error('Transaction failed')
        }
      } catch (transferError) {
        setUserOpResult(false)
        setLoading(false)
        setCompleted(true)
      }
    } catch (err) {
      setUserOpResult(false)
      setLoading(false)
      setCompleted(true)
    }
  }

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto relative px-6'>
        <div className='flex flex-col flex-grow'>
          <div className='w-full h-auto min-h-[530px] bg-white rounded-md border border-border-primary p-4 mt-2'>
            <h2 className='text-md text-center font-bold mb-4'>Total</h2>

            <div className='max-h-[95px] overflow-y-auto no-scrollbar mb-4'>
              {recipients.map((recipient, index) => (
                <div key={index} className='flexed items-center mb-2'>
                  <div className=' min-w-0 mr-4'>
                    <p className='text-sm mb-1'>{index + 1}. Address</p>
                    <p className='text-sm text-primary truncate'>{recipient.address}</p>
                  </div>
                  <div className='text-sm flex justify-between mt-2'>
                    <span className='text-sm'>Amount</span>
                    <span className='text-sm text-primary'>
                      {Number(recipient.amount).toLocaleString()} {recipient.token?.symbol}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <h2 className='text-sm text-white bg-primary text-left mb-4 p-0.5 px-2'>Total</h2>
            <div className='mt-4 text-black text-md p-2 overflow-y-auto no-scrollbar'>
              <div className='max-h-[130px]'>
                {Object.entries(tokenTotals).map(([symbol, total]) => {
                  const recipient = recipients.find((r) => r.token?.symbol === symbol)
                  return (
                    <div key={symbol} className='mb-4'>
                      <div className='flex justify-between items-center mb-1'>
                        <span>{symbol}</span>
                        <span>{total.toLocaleString()}</span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span>You have:</span>
                        <span>
                          {Number(recipient?.token?.balance).toLocaleString()} {symbol}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className='fixed bottom-36 left-0 right-0 px-12 '>
              <p className='text-sm font-medium mb-1'>Gas fee</p>
              {paymaster && selectedPaymasterToken ? (
                <div className='text-sm text-primary'>
                  <p>token: {selectedPaymasterToken.symbol}</p>
                  <p>Estimated fee: {estimatedGasCost}</p>
                </div>
              ) : (
                <div className='text-sm text-gray-500'>
                  <p>NERO Token</p>
                  <p>Estimated fee: {estimatedGasCost}</p>
                </div>
              )}
            </div>

            <div className='fixed bottom-14 left-0 right-0 flex justify-between p-10'>
              <Button
                onClick={() => navigateTo(screens.MULTISENDDETAIL)}
                variant='text'
                icon={AiFillCaretLeft}
                iconPosition='left'
                disabled={loading || completed}
                className='flex items-center text-sm text-text-primary px-2 mt-2 rounded-full'
              >
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={loading || completed}
                variant='primary'
                className='px-6 py-2'
              >
                {loading ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {(loading || completed) && (
        <LoadingScreen message='Processing' isCompleted={completed} userOpResult={userOpResult} />
      )}
    </CommonContainerPanel>
  )
}

export default MultiSendConfirmPanel
