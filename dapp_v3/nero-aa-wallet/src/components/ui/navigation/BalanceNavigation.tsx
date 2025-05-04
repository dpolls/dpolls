import React, { useContext } from 'react'
import { IoArrowBackSharp } from 'react-icons/io5'
import { NavigationItem } from '@/components/ui/navigation'
import { SendContext, TokenContext } from '@/contexts'
import { useScreenManager } from '@/hooks'
import { BalanceNavigationProps, screens } from '@/types'

const BalanceNavigation: React.FC<BalanceNavigationProps> = ({
  className = '',
  activeScreen,
  onSend,
  onReceive,
}) => {
  const { navigateTo, currentScreen } = useScreenManager()
  const { setLastSentToken } = useContext(SendContext)!
  const { selectedToken } = useContext(TokenContext)!

  const current = activeScreen || currentScreen

  const handleSend = () => {
    if (onSend) {
      onSend()
    } else {
      setLastSentToken(selectedToken)
      navigateTo(screens.SEND)
    }
  }

  const handleReceive = () => {
    if (onReceive) {
      onReceive()
    } else {
      navigateTo(screens.RECEIVE)
    }
  }

  return (
    <div className={`flex space-x-4 mt-4 ${className}`}>
      <NavigationItem
        icon={IoArrowBackSharp}
        label='Send'
        isActive={current === screens.SEND}
        onClick={handleSend}
        variant='balance'
        iconRotation={135}
      />
      <NavigationItem
        icon={IoArrowBackSharp}
        label='Receive'
        isActive={current === screens.RECEIVE}
        onClick={handleReceive}
        variant='balance'
        iconRotation={-50}
      />
    </div>
  )
}

export default BalanceNavigation
