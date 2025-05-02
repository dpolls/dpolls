import { useState, useEffect } from 'react'
import { erc20Abi, erc721Abi } from 'viem'
import { useReadContracts } from 'wagmi'
import { ContractValidationResult, UseContractValidationProps } from '@/types/hooks'
import { isValidAddress } from '@/utils'

export const useContractValidation = ({
  contractAddress,
  tokenId,
  contractType,
}: UseContractValidationProps): ContractValidationResult => {
  const [isValidContract, setIsValidContract] = useState(false)

  const isERC20 = contractType === 'ERC20'
  const abi = isERC20 ? erc20Abi : erc721Abi

  const contracts = isERC20
    ? [
        {
          address: contractAddress as `0x${string}`,
          abi,
          functionName: 'name',
        },
        {
          address: contractAddress as `0x${string}`,
          abi,
          functionName: 'symbol',
        },
        {
          address: contractAddress as `0x${string}`,
          abi,
          functionName: 'decimals',
        },
      ]
    : [
        {
          address: contractAddress as `0x${string}`,
          abi,
          functionName: 'name',
        },
        {
          address: contractAddress as `0x${string}`,
          abi,
          functionName: 'symbol',
        },
        {
          address: contractAddress as `0x${string}`,
          abi,
          functionName: 'tokenURI',
          args: tokenId ? [BigInt(tokenId)] : undefined,
        },
        {
          address: contractAddress as `0x${string}`,
          abi,
          functionName: 'ownerOf',
          args: tokenId ? [BigInt(tokenId)] : undefined,
        },
      ]

  const isValidContractAddress = isValidAddress(contractAddress)
  const enabled = isValidContractAddress && (isERC20 || (tokenId !== undefined && tokenId !== ''))

  const { data, isError, isLoading } = useReadContracts({
    contracts,
    query: {
      enabled,
    },
  })

  useEffect(() => {
    if (data && !isError && !isLoading) {
      setIsValidContract(true)
    } else {
      setIsValidContract(false)
    }
  }, [data, isError, isLoading])

  return {
    isValidContract,
    contractInfo: data,
    isError,
    isLoading,
  }
}

export default useContractValidation
