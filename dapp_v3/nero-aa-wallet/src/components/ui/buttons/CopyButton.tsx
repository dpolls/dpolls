import React, { useState } from 'react'
import { AiOutlineCopy } from 'react-icons/ai'
import { FaCheck } from 'react-icons/fa'
import { CopyButtonProps } from '@/types'

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className = '', children }) => {
  const [showCopiedIcon, setShowCopiedIcon] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
    setShowCopiedIcon(true)
    setTimeout(() => setShowCopiedIcon(false), 2000)
  }

  return (
    <div className={`flex items-center ${className}`}>
      <span onClick={handleCopy} className='cursor-pointer'>
        {children}
      </span>
      <button onClick={handleCopy} className='ml-1 text-text-secondary'>
        {showCopiedIcon ? <FaCheck className='text-green-500' /> : <AiOutlineCopy />}
      </button>
    </div>
  )
}

export default CopyButton
