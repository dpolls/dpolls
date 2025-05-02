import React from 'react'
import { ErrorDisplayProps } from '@/types/Paymaster'
import { getUserFriendlyErrorMessage } from '@/utils'

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className='w-full bg-white rounded-xl p-3'>
      <div className='text-red-500 font-medium mb-1'>Payment Service Error</div>
      <div className='text-sm text-gray-700'>{getUserFriendlyErrorMessage(error)}</div>
      <button onClick={onRetry} className='mt-2 text-sm text-blue-500 hover:text-blue-700'>
        Retry
      </button>
    </div>
  )
}

export default ErrorDisplay
