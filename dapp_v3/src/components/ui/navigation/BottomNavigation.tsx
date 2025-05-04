import React from 'react'
import { BiHomeCircle } from 'react-icons/bi'
import { IoWalletOutline } from 'react-icons/io5'
import { RiNftLine } from 'react-icons/ri'
import { NavigationItem } from '@/components/ui/navigation'
import { useScreenManager } from '@/hooks'
import { BottomNavigationProps, screens, Screen } from '@/types'

const BottomNavigation: React.FC<BottomNavigationProps> = ({ className = '', onNavigate }) => {
  const { navigateTo } = useScreenManager()

  const handleNavigate = (screen: Screen) => {
    if (onNavigate) {
      onNavigate(screen)
    } else {
      navigateTo(screen)
    }
  }

  return (
    <div
      className={`inline-flex items-center justify-center gap-10 w-[86%] h-[3.5rem] bg-primary rounded-md overflow-hidden mx-auto ${className}`}
    >
      <NavigationItem icon={BiHomeCircle} onClick={() => handleNavigate(screens.HOME)} />
      <NavigationItem icon={IoWalletOutline} onClick={() => handleNavigate(screens.TOKENINDEX)} />
      <NavigationItem icon={RiNftLine} onClick={() => handleNavigate(screens.NFT)} />
    </div>
  )
}

export default BottomNavigation
