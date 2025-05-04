import React, { useState } from 'react'
import { BalancePanel, ActivityContent } from '@/components/screens/home'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'

const NEROTokenDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All')
  const [cornerStyle, setCornerStyle] = useState('rounded-tr-md rounded-br-md rounded-bl-md')

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName)
    switch (tabName) {
      case 'All':
        setCornerStyle('rounded-tr-md rounded-br-md rounded-bl-md')
        break
      default:
        setCornerStyle('rounded-md')
    }
  }

  const getTabStyle = (tabName: string) =>
    `cursor-pointer px-4 py-2 ${activeTab === tabName ? 'bg-white text-text-primary border-t border-x border-border-primary rounded-t-md relative z-10' : ''}`

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto relative px-6'>
        <BalancePanel showIcon={true} showBalanceLabel={false} />
        <div className='flex pt-3 text-sm font-medium items-end'>
          <div className={getTabStyle('All')} onClick={() => handleTabClick('All')}>
            All
          </div>
        </div>
        <div className={`bg-white ${cornerStyle} border border-border-primary relative -mt-[1px]`}>
          <div className='h-[17.5rem] py-1'>
            <ActivityContent />
          </div>
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default NEROTokenDetail
