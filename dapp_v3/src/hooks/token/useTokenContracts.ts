import { Abi, erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

export const useTokenContracts = (AAaddress: string, tokenAddresses: string[]) => {
  return useReadContracts({
    contracts: tokenAddresses.flatMap(
      (tokenAddress) =>
        [
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi as Abi,
            functionName: 'balanceOf',
            args: [AAaddress as `0x${string}`],
          },
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi as Abi,
            functionName: 'decimals',
          },
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi as Abi,
            functionName: 'symbol',
          },
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi as Abi,
            functionName: 'name',
          },
        ] as const,
    ),
  })
}
