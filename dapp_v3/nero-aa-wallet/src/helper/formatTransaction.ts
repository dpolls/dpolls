import executeIcon from '@/assets/execute.png'
import tokenExchangeIcon from '@/assets/token-exchange.png'
import { CombinedTransaction, FormattedTransaction } from '@/types'
import { formatAndRoundBalance } from '@/utils'

export const formatTransaction = (
  tx: CombinedTransaction,
  userAddress: string,
  explorerUrl: string,
): FormattedTransaction => {
  const explorerBaseUrl = `${explorerUrl}/tx/`
  const date = new Date(Number(tx.timeStamp) * 1000).toLocaleString()
  const token = tx.isTokenTransaction ? tx.tokenSymbol : 'NERO'
  const decimals = tx.isTokenTransaction ? Number(tx.tokenDecimal) : 18

  let gasCost = ''
  let gasToken: FormattedTransaction['gasToken'] | undefined

  const isReceived = tx.isTokenTransaction && tx.from.toLowerCase() !== userAddress.toLowerCase()

  if (!isReceived) {
    if (tx.isTokenTransaction && 'gasToken' in tx && tx.gasToken) {
      gasCost = `${formatAndRoundBalance(tx.gasToken.value, tx.gasToken.tokenDecimal)} ${tx.gasToken.tokenSymbol}`
      gasToken = {
        value: formatAndRoundBalance(tx.gasToken.value, tx.gasToken.tokenDecimal),
        tokenSymbol: tx.gasToken.tokenSymbol,
      }
    } else if ('gasPrice' in tx && tx.gasPrice && tx.gasPrice !== '0' && tx.gasUsed) {
      gasCost = `${formatAndRoundBalance(BigInt(tx.gasUsed) * BigInt(tx.gasPrice), 18)} ${token}`
    } else if (tx.gasUsed) {
      gasCost = `${formatAndRoundBalance(BigInt(tx.gasUsed), 18)} ${token}`
    } else {
      gasCost = `0 ${token}`
    }
  }

  const value = tx.value === undefined ? '0' : formatAndRoundBalance(BigInt(tx.value), decimals)

  const action = (() => {
    if (tx.isTokenTransaction && tx.from.toLowerCase() === userAddress.toLowerCase()) {
      return 'Sent'
    } else if (tx.isTokenTransaction && tx.from.toLowerCase() !== userAddress.toLowerCase()) {
      return 'Received'
    } else {
      return 'Executed'
    }
  })()

  const iconSrc = (() => {
    if (tx.isTokenTransaction) {
      return tokenExchangeIcon
    } else {
      return executeIcon
    }
  })()

  const explorerUrlTx = `${explorerBaseUrl}${tx.transactionHash}`
  const contractAddress = tx.contractAddress

  return {
    date,
    gasCost,
    action,
    iconSrc,
    token,
    value,
    explorerUrlTx,
    contractAddress,
    gasToken,
  }
}
