import React from 'react'
import { PaymentOptionProps } from '@/types/Paymaster'

const PaymentOption: React.FC<PaymentOptionProps> = ({
  isSelected = false,
  isDisabled = false,
  onClick,
  icon,
  title,
  subtitle,
  rightIcon,
  isTokenOption = false,
  isNativeToken = false,
}) => {
  let className =
    'flex items-center p-2 rounded-lg cursor-pointer border transition-all duration-300 relative'

  if (isTokenOption) {
    if (isDisabled) {
      className += ' bg-gray-100 text-gray-400 cursor-not-allowed'
    } else {
      className +=
        ' bg-gradient-to-r from-blue-200 to-purple-200 border-blue-300 text-primary hover:from-blue-300 hover:to-purple-300 '
    }
  } else {
    //sponsored UI
    if (isDisabled) {
      className += ' bg-gray-100 text-white cursor-not-allowed'
    } else {
      className +=
        ' bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white hover:from-blue-600 hover:to-purple-600 hover:text-white'
    }
  }

  if (isSelected) {
    className +=
      ' bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg scale-[1.02]'
  }

  return (
    <div className={className} onClick={isDisabled ? undefined : onClick}>
      <div
        className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 ${
          isTokenOption ? 'bg-blue-100' : isSelected ? 'bg-white/30 rotate-12' : 'bg-white/20'
        }`}
      >
        {icon}
      </div>
      <div className='flex flex-col'>
        <span className={`text-sm font-medium`}>
          {isSelected && !isTokenOption ? `✓ ${title}` : title}
        </span>
        <span className={`text-xs opacity-80`}>
          {isNativeToken && isTokenOption ? 'Including Token' : subtitle}
        </span>
      </div>
      {rightIcon && <div className={`absolute right-4 flex items-center text-xs`}>{rightIcon}</div>}
    </div>
  )
}

export default PaymentOption
