import React from 'react'
import { CardProps } from '@/types'

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  headerContent,
  footerContent,
  bordered = false,
  shadow = false,
  hoverable = false,
  padding = true,
  rounded = true,
}) => {
  const baseClasses = 'bg-white'
  const borderClasses = bordered ? 'border border-border-primary' : ''
  const shadowClasses = shadow ? 'shadow-md' : ''
  const roundedClasses = rounded ? 'rounded-md' : ''
  const paddingClasses = padding ? 'p-4' : ''
  const hoverClasses = hoverable
    ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer'
    : ''

  return (
    <div
      className={`${baseClasses} ${borderClasses} ${shadowClasses} ${roundedClasses} ${paddingClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {headerContent && (
        <div className='mb-3 pb-2 border-b border-border-primary'>{headerContent}</div>
      )}
      <div className='flex flex-col'>{children}</div>
      {footerContent && (
        <div className='mt-3 pt-2 border-t border-border-primary'>{footerContent}</div>
      )}
    </div>
  )
}

export default Card
