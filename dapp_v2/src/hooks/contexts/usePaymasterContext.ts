import { useContext } from 'react'
import { PaymasterContext } from '@/contexts/PaymasterContext'
import { PaymasterContextType } from '@/types'

export const usePaymasterContext = (): PaymasterContextType => {
  const context = useContext(PaymasterContext)
  if (context === undefined) {
    throw new Error('usePaymasterContext must be used within a PaymasterProvider')
  }
  return context
}
