import { useContext } from 'react'
import { SendContext, SendContextProps } from '@/contexts'

export const useSendContext = (): SendContextProps => {
  const context = useContext(SendContext)
  if (!context) {
    throw new Error('useSendContext must be used within a SendProvider')
  }
  return context
}
