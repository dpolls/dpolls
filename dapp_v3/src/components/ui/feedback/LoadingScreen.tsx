import React, { useState, useEffect } from 'react'
import { CiCircleCheck, CiCircleAlert } from 'react-icons/ci'
import NEROLogoSquareIcon from '@/assets/NERO-Logo-square.svg'
import { LoadingScreenProps } from '@/types'

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading',
  isCompleted = false,
  userOpResult = false,
}) => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (!isCompleted) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots.length >= 4 ? '' : prevDots + '.'))
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isCompleted])

  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center bg-bg-secondary bg-opacity-80 z-50 rounded-md'>
      <div className='w-[100px] h-[100px] mb-4'>
        {isCompleted ? (
          userOpResult ? (
            <CiCircleCheck className='w-full h-full text-green-500' />
          ) : (
            <CiCircleAlert className='w-full h-full text-red-500' />
          )
        ) : (
          <img src={NEROLogoSquareIcon} alt='NERO Logo' className='w-full h-full object-contain' />
        )}
      </div>
      <p className='text-black text-base'>
        {isCompleted
          ? userOpResult
            ? 'Transaction completed'
            : 'Transaction failed'
          : `${message}${dots}`}
      </p>
    </div>
  )
}

export default LoadingScreen
