import React, { useState } from 'react'
import { NFTsContent } from '@/components/screens/home'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { ExpandedTabContentProps } from '@/types'

const ExpandedTabContent: React.FC<ExpandedTabContentProps> = ({ tab }) => {
  const [activeTab] = useState(tab)

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto relative px-6 mt-2'>
        <div className={`bg-white h-[33.1rem] rounded-md  border border-border-primary`}>
          {activeTab === 'NFTs' && <NFTsContent />}
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default ExpandedTabContent
