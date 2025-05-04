import { useSignature } from '@/hooks'

export const useSimpleAccount = () => {
  const { loading, AAaddress, simpleAccountInstance } = useSignature()

  return {
    loading,
    AAaddress,
    simpleAccountInstance,
  }
}
