import React from 'react'
import { BaseCardItemProps } from '@/types'

const BaseCardItem: React.FC<BaseCardItemProps> = ({
  label,
  value,
  className = '',
  labelClassName = '',
  valueClassName = '',
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`text-text-secondary text-1.5sm ${labelClassName}`}>{label}</div>
      <div className={`text-text-primary text-1.5sm ${valueClassName}`}>{value}</div>
    </div>
  )
}

export default BaseCardItem
