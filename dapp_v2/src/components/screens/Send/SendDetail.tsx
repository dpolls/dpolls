import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import { parseEther, parseUnits } from 'viem'
import ERC20 from '@/abis/ERC20/ERC20.json'
import { TokenIcon } from '@/components/features/token'
import { TransactionPreview } from '@/components/screens/transaction'
import { SendContext } from '@/contexts'
import {
  useSimpleAccount,
  useAAtransfer,
  useResetContexts,
  useScreenManager,
  usePaymasterContext,
  usePaymasterMode,
} from '@/hooks'
import { useEstimateUserOpFee } from '@/hooks/operation/useEstimateUserOpFee'
import { screens } from '@/types'
import { getSelectedTokenSymbol } from '@/utils'

const SendDetail: React.FC = () => {
  const { navigateTo } = useScreenManager()
  const { resetAllContexts } = useResetContexts()
  const {
    recipientAddress,
    selectedToken,
    balance,
    clearRecipientAddress,
    clearSelectedToken,
    clearBalance,
  } = useContext(SendContext)!
  const [estimatedGasCost, setEstimatedGasCost] = useState<string>('Calculating...')
  const { AAaddress, simpleAccountInstance } = useSimpleAccount()
  const { transfer } = useAAtransfer()
  const {
    paymaster,
    selectedToken: paymasterSelectedToken,
    supportedTokens,
  } = usePaymasterContext()
  const { paymasterModeValue, isFreeGasMode } = usePaymasterMode()
  const { estimateUserOpFee } = useEstimateUserOpFee()

  useEffect(() => {
    const estimateGasCost = async () => {
      if (!recipientAddress || !balance || !AAaddress || AAaddress === '0x') {
        setEstimatedGasCost('null')
        return
      }

      try {
        if (isFreeGasMode) {
          setEstimatedGasCost('0')
          return
        }

        const operations = []
        if (selectedToken.isNative) {
          operations.push({
            contractAddress: recipientAddress,
            abi: ['function receive() payable'],
            function: 'receive',
            params: [],
            value: parseEther(balance),
          })
        } else {
          operations.push({
            contractAddress: selectedToken.contractAddress,
            abi: ERC20,
            function: 'transfer',
            params: [recipientAddress, parseUnits(balance, Number(selectedToken.decimals))],
            value: ethers.constants.Zero,
          })
        }

        const fee = await estimateUserOpFee(
          operations,
          paymaster,
          paymasterSelectedToken || undefined,
          paymasterModeValue,
        )
        setEstimatedGasCost(fee)
      } catch (error) {
        console.error('Error setting estimated gas cost:', error)
        setEstimatedGasCost('0.0001')
      }
    }

    estimateGasCost()
  }, [
    recipientAddress,
    balance,
    AAaddress,
    selectedToken,
    paymaster,
    paymasterSelectedToken,
    paymasterModeValue,
    estimateUserOpFee,
    isFreeGasMode,
  ])

  const executeTransfer = async () => {
    if (!simpleAccountInstance) {
      return Promise.reject('SimpleAccount is not initialized')
    }

    const tokenAddress = selectedToken.isNative
      ? ethers.constants.AddressZero
      : selectedToken.contractAddress

    try {
      const result = await transfer(
        recipientAddress,
        balance,
        tokenAddress,
        paymaster,
        paymasterSelectedToken || undefined,
        paymasterModeValue,
      )
      return result
    } catch (error) {
      console.error('Transfer failed')
      throw error
    }
  }

  const handleClose = () => {
    clearRecipientAddress()
    clearSelectedToken()
    clearBalance()
    navigateTo(screens.HOME)
  }

  const amountContent = (
    <>
      <label className='block text-text-secondary text-1sm'>Amount</label>
      <div className='flex items-center mt-1 mb-2'>
        <TokenIcon
          tokenAddress={selectedToken.contractAddress}
          symbol={selectedToken.symbol}
          isNative={selectedToken.isNative}
          size='md'
          className='mr-2'
          token={selectedToken}
        />
        <div className='flex items-center w-full'>
          <div className='text-xl flex-1 pl-3 overflow-hidden whitespace-nowrap text-ellipsis'>
            {balance} {selectedToken.symbol}
          </div>
        </div>
      </div>
    </>
  )

  if (!selectedToken || !balance) {
    return null
  }

  return (
    <TransactionPreview
      from={AAaddress}
      to={recipientAddress}
      networkFee={estimatedGasCost}
      gasTokenSymbol={getSelectedTokenSymbol(paymaster, paymasterSelectedToken, supportedTokens)}
      onClose={handleClose}
      onConfirm={executeTransfer}
      onReset={resetAllContexts}
    >
      {amountContent}
    </TransactionPreview>
  )
}

export default SendDetail
