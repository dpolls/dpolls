import { parseUnits } from 'ethers/lib/utils'

export const validateAmount = (
  inputAmount: string,
  balance: string,
  decimals: number | string,
): boolean => {
  if (!inputAmount || !balance || decimals === undefined) {
    return false
  }

  const validNumberRegex = /^(?!0\d)\d*\.?\d+$/
  if (!validNumberRegex.test(inputAmount)) {
    return false
  }

  try {
    const amount = parseUnits(inputAmount, Number(decimals))
    const balanceInWei = parseUnits(balance, Number(decimals))

    return amount.gt(0) && amount.lte(balanceInWei)
  } catch (error) {
    return false
  }
}

export const isValidAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const truncateAddress = (address: string) => {
  return address.length > 10 ? `${address.slice(0, 7)}...${address.slice(-7)}` : address
}
