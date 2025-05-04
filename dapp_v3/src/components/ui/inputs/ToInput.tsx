import React from 'react'
import { BaseInput } from '@/components/ui/inputs'
import { ToInputProps } from '@/types'

const ToInput: React.FC<
  ToInputProps & {
    recipientAddress: string
    setRecipientAddress: (address: string) => void
    variant: 'send' | 'multisend'
    index?: number
  }
> = ({ recipientAddress, setRecipientAddress, variant, index }) => {
  const handleChange = (value: string) => {
    setRecipientAddress(value)
  }

  return (
    <BaseInput
      label={variant === 'send' ? 'To' : `${index! + 1}. To`}
      value={recipientAddress}
      onChange={handleChange}
      placeholder='0x...'
      variant={variant}
      containerClassName={variant === 'multisend' ? 'w-full mb-3' : ''}
      inputClassName={variant === 'multisend' ? 'w-full' : ''}
    />
  )
}

export default ToInput
