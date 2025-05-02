import React from 'react'
import { CommonContainerPanelProps } from '@/types'

const CommonContainerPanel: React.FC<CommonContainerPanelProps> = ({ children, footer }) => {
  return (
    <div className='w-[353px] h-[680px] bg-bg-primary text-text-primary border border-border-primary font-roboto rounded-md relative'>
      {children}
      <div className='absolute bottom-0 left-0 right-0 mb-3 flex justify-center items-center'>
        {footer}
      </div>
    </div>
  )
}

export default CommonContainerPanel
