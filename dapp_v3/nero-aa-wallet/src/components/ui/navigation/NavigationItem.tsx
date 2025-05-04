import React from 'react'
import { NavigationItemProps } from '@/types'

const NavigationItem: React.FC<NavigationItemProps> = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  className = '',
  variant = 'bottom',
  iconRotation = 0,
}) => {
  const getIconColor = () => {
    if (variant === 'balance') return isActive ? 'text-black' : 'text-white'
    return isActive ? 'text-primary' : 'text-white'
  }

  const getIconSize = () => {
    if (variant === 'balance') return 'size-5'
    return 'size-7'
  }

  const getContainerClasses = () => {
    if (variant === 'balance') {
      return 'w-14 h-11 flex flex-col items-center justify-center relative'
    }
    return 'flex flex-col items-center justify-center'
  }

  const getIconStyles = () => {
    return {
      transform: iconRotation ? `rotate(${iconRotation}deg)` : 'none',
    }
  }

  const getIconContainerClasses = () => {
    if (variant === 'balance') {
      return `flex items-center justify-center w-14 h-8 rounded-full ${
        isActive ? 'bg-white' : 'bg-primary'
      }`
    }
    return `${isActive ? 'text-primary' : ''} cursor-pointer`
  }

  return (
    <div className={`${getContainerClasses()} ${className}`} onClick={onClick}>
      <div className={getIconContainerClasses()}>
        <Icon className={`${getIconSize()} ${getIconColor()}`} style={getIconStyles()} />
      </div>
      {label && (
        <div className={`text-sm mt-0.5 ${variant === 'balance' ? 'text-primary' : 'text-white'}`}>
          {label}
        </div>
      )}
    </div>
  )
}

export default NavigationItem
