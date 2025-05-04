import { formatUnits } from 'viem'

export const formatAndRoundBalance = (
  balance: bigint | string,
  decimals: number | string = 18,
  precision: number = 4,
) => {
  if (!balance) return '0'

  const formattedBalance = formatUnits(BigInt(balance), Number(decimals))
  const roundedBalance = Number(formattedBalance).toFixed(precision)
  return roundedBalance
}

export const formatNumber = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) return '0'

  const absNum = Math.abs(num)

  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B'
  }
  if (absNum >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M'
  }

  if (absNum < 1) {
    return num.toPrecision(4)
  }

  return num.toLocaleString('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  })
}
