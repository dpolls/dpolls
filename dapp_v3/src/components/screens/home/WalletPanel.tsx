import React, { useState, useEffect } from 'react'
import {
  BalancePanel,
  ActivityContent,
  NFTsContent,
  TokensContent,
} from '@/components/screens/home'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { WalletPanelProps } from '@/types'

const WalletPanel: React.FC<WalletPanelProps> = ({ initialTab = 'Tokens' }) => {
  const [cornerStyle, setCornerStyle] = useState('rounded-tr-md rounded-br-md rounded-bl-md')
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    handleTabClick(initialTab)
  }, [initialTab])

  const handleTabClick = (tabName: 'Tokens' | 'NFTs' | 'Activity') => {
    setActiveTab(tabName)
    if (tabName === 'Tokens') {
      setCornerStyle('rounded-tr-md rounded-br-md rounded-bl-md')
    } else {
      setCornerStyle('rounded-md')
    }
  }

  const getTabStyle = (tabName: string) =>
    `cursor-pointer px-4 py-2 ${
      activeTab === tabName
        ? 'bg-white text-text-primary border-t border-x border-border-primary rounded-t-md relative z-10'
        : ''
    }`

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto relative px-6'>
        <BalancePanel />
        <div className='flex pt-3 text-sm font-medium items-end'>
          <div className={getTabStyle('Tokens')} onClick={() => handleTabClick('Tokens')}>
            Tokens
          </div>
          <div className='self-stretch flex items-end pb-2'>
            <div className='h-4 w-px bg-border-primary'></div>
          </div>
          <div className={getTabStyle('NFTs')} onClick={() => handleTabClick('NFTs')}>
            NFTs
          </div>
          <div className='self-stretch flex items-end pb-2'>
            <div className='h-4 w-px bg-border-primary'></div>
          </div>
          <div className={getTabStyle('Activity')} onClick={() => handleTabClick('Activity')}>
            Activity
          </div>
        </div>
        <div className={`bg-white ${cornerStyle} border border-border-primary relative -mt-[1px]`}>
          <div className='h-[18rem] py-2'>
            {activeTab === 'Tokens' && <TokensContent />}
            {activeTab === 'NFTs' && <NFTsContent />}
            {activeTab === 'Activity' && <ActivityContent />}
          </div>
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default WalletPanel
