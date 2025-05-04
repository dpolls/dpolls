import React from 'react'
import { TokensContent } from '@/components/screens/home'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'

const TokenIndex: React.FC = () => {
  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto relative px-6 mt-2'>
        <div className={`bg-white h-[33.1rem] rounded-md  border border-border-primary`}>
          <TokensContent />
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default TokenIndex
