import React from 'react'
import { GoTriangleDown } from 'react-icons/go'
import { IoMdClose } from 'react-icons/io'
import { TokenIcon } from '@/components/features/token'
import { BaseInput } from '@/components/ui/inputs'
import { TokenSelectInputProps } from '@/types'

const TokenSelectInput: React.FC<
  TokenSelectInputProps & {
    onOpenModal: () => void
    variant: 'send' | 'multisend'
    onRemove?: () => void
    index?: number
  }
> = ({ selectedToken, onOpenModal, variant, onRemove, index }) => {
  const renderMultisendInput = () => (
    <button
      onClick={onOpenModal}
      className='w-[80px] p-2 rounded-md text-secondary border border-border-primary bg-bg-primary flex items-center justify-between overflow-hidden'
    >
      <span className='flex text-sm items-center gap-1 overflow-hidden'>
        <TokenIcon
          tokenAddress={selectedToken?.contractAddress || '0x'}
          symbol={selectedToken?.symbol || 'NERO'}
          size='xs'
          className='flex-shrink-0'
        />
        <span className='truncate'>{selectedToken?.symbol || 'select'}</span>
      </span>
      <GoTriangleDown className='flex-shrink-0' />
    </button>
  )

  const renderRemoveButton = () => {
    if (variant === 'multisend' && index! > 0 && onRemove) {
      return (
        <button onClick={onRemove} className='absolute -right-2 top-1/2 -translate-y-1/2 mr-2'>
          <IoMdClose size={20} />
        </button>
      )
    }
    return null
  }

  return variant === 'multisend' ? (
    <div className='w-full mb-3'>
      <label className='block text-text-secondary text-1sm'>Token</label>
      <div className='relative'>
        {renderMultisendInput()}
        {renderRemoveButton()}
      </div>
    </div>
  ) : (
    <BaseInput
      label='Token'
      value={selectedToken?.symbol || ''}
      placeholder='Select token'
      variant={variant}
      inputClassName='cursor-pointer'
      rightElement={<GoTriangleDown className='text-secondary' />}
      onClick={onOpenModal}
      readOnly
    />
  )
}

export default TokenSelectInput
