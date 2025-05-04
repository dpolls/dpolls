import React from 'react'
import { BaseInput } from '@/components/ui/inputs'
import { Token, AmountInputProps } from '@/types'

const AmountInput: React.FC<
  AmountInputProps & {
    inputAmount: string
    setInputAmount: (amount: string) => void
    setBalance?: (balance: string) => void
    selectedToken: Token | null
    variant: 'send' | 'multisend'
  }
> = ({ inputAmount, setInputAmount, setBalance, selectedToken, variant }) => {
  const handleChange = (value: string) => {
    setInputAmount(value)
    setBalance?.(value)
  }

  return (
    <BaseInput
      label='Amount'
      value={inputAmount}
      onChange={handleChange}
      placeholder='0'
      type='number'
      variant={variant}
      rightElement={<span className='text-gray-500'>{selectedToken?.symbol || ''}</span>}
      inputClassName={`${variant === 'send' ? 'w-full' : 'w-[160px]'} pr-20 [appearance:textfield][appearance:textfield][-moz-appearance:textfield] [-webkit-appearance:none] [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:[-webkit-appearance:none] [&::-webkit-inner-spin-button]:[margin:0] [&::-webkit-outer-spin-button]:[margin:0] [&::-webkit-inner-spin-button]:[display:none] [&::-webkit-outer-spin-button]:[display:none]`}
      helpText={`Balance: ${selectedToken?.balance || '0'}`}
    />
  )
}

export default AmountInput
