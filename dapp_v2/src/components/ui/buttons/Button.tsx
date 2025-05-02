import React from 'react'
import { ButtonProps } from '@/types'

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  icon: Icon,
  iconPosition = 'left',
  children,
  isActive = false,
  iconRotation = 0,
}) => {
  const baseStyle = 'text-sm font-medium transition-colors duration-200'

  const variantStyles = {
    primary: 'bg-primary text-white rounded-full hover:bg-primary-dark px-4 py-2',
    secondary:
      'bg-white text-text-primary border border-border-primary rounded-full hover:bg-gray-100 px-4 py-2',
    tertiary: 'bg-black text-white rounded-full hover:bg-bg-tertiary-dark px-4 py-2',
    icon: 'bg-transparent text-text-primary hover:bg-gray-100 p-2 rounded-full',
    text: 'bg-transparent text-text-primary hover:underline',
    balance: `flex items-center justify-center w-14 h-8 rounded-full ${
      isActive ? 'bg-white' : 'bg-primary'
    }`,
  }

  const disabledStyle = 'opacity-50 cursor-not-allowed'

  const buttonStyle = `${baseStyle} ${variantStyles[variant]} ${disabled ? disabledStyle : ''} ${className}`

  const iconStyle = {
    transform: iconRotation ? `rotate(${iconRotation}deg)` : 'none',
  }

  const iconColorClass =
    variant === 'balance'
      ? isActive
        ? 'text-black'
        : 'text-white'
      : variant === 'icon'
        ? 'text-text-primary'
        : ''

  const iconSizeClass = variant === 'balance' ? 'size-5' : variant === 'icon' ? 'size-5' : 'size-4'

  return (
    <button onClick={onClick} disabled={disabled} className={buttonStyle}>
      {variant === 'balance' ? (
        Icon && <Icon className={`${iconSizeClass} ${iconColorClass}`} style={iconStyle} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon
              className={`${iconSizeClass} ${iconColorClass} ${children ? 'mr-2' : ''}`}
              style={iconStyle}
            />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon
              className={`${iconSizeClass} ${iconColorClass} ${children ? 'ml-2' : ''}`}
              style={iconStyle}
            />
          )}
        </>
      )}
    </button>
  )
}

export default Button
