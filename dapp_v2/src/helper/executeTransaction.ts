import { ethers } from 'ethers'
import { ExecuteTransactionParams, DAppTransactionData, WalletInfo } from '@/types'

export async function executeTransaction({
  to,
  value,
  data,
  client,
  simpleAccount,
  options = {},
}: ExecuteTransactionParams) {
  if (!client) {
    throw new Error('Client is not initialized')
  }

  const userOp = simpleAccount.execute(to, value, data)

  const res = await client.sendUserOperation(userOp, {
    dryRun: options.dryRun ?? false,
    onBuild: options.onBuild ?? ((op) => console.warn('Signed UserOperation:', op)),
  })

  return {
    transactionHash: await res.wait(),
    userOpHash: res.userOpHash,
  }
}

export async function executeDAppTransaction(
  dappData: DAppTransactionData,
  walletInfo: WalletInfo,
  options?: ExecuteTransactionParams['options'],
) {
  const contract = new ethers.Contract(
    dappData.contractAddress,
    dappData.abi,
    ethers.providers.getDefaultProvider(),
  )
  const callData = contract.interface.encodeFunctionData(
    dappData.functionName,
    dappData.functionParams,
  )

  return executeTransaction({
    to: dappData.contractAddress,
    value: dappData.value ?? 0,
    data: callData,
    client: walletInfo.client,
    simpleAccount: walletInfo.simpleAccount,
    options,
  })
}
