import React from 'react'
import { BaseInput } from '@/components/ui/inputs'
import { ContractAddressInputProps } from '@/types'
import { isValidAddress } from '@/utils'

const ContractAddressInput: React.FC<ContractAddressInputProps> = ({
  value,
  onChange,
  label = 'Contract Address',
  placeholder = 'Enter contract address',
  error,
  className = '',
}) => {
  const handleChange = (newValue: string) => {
    const isValid = isValidAddress(newValue)
    onChange(newValue, isValid)
  }

  return (
    <BaseInput
      label={label}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      error={error || undefined}
      className={className}
    />
  )
}

export default ContractAddressInput
