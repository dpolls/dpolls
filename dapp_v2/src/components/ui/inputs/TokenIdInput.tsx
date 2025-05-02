import React from 'react'
import { BaseInput } from '@/components/ui/inputs'
import { TokenIdInputProps } from '@/types'

const TokenIdInput: React.FC<TokenIdInputProps> = ({
  value,
  onChange,
  label = 'Token ID',
  placeholder = 'Enter token ID',
  error,
  className = '',
}) => {
  const handleChange = (newValue: string) => {
    // Only allow numeric values
    if (newValue === '' || /^\d+$/.test(newValue)) {
      const isValid = newValue !== ''
      onChange(newValue, isValid)
    }
  }

  return (
    <BaseInput
      label={label}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      error={error || undefined}
      className={className}
      type='text'
    />
  )
}

export default TokenIdInput
