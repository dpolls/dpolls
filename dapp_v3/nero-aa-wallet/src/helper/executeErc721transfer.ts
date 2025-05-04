import { ERC721TransferParams } from '@/types'

export async function executeERC721Transfer({
  contractAddress,
  to,
  tokenId,
  client,
  simpleAccount,
  options = {},
}: ERC721TransferParams) {
  if (!client) {
    throw new Error('Client is not initialized')
  }

  const userOp = await simpleAccount.erc721transfer(contractAddress, to, tokenId)

  const res = await client.sendUserOperation(userOp, {
    dryRun: options.dryRun ?? false,
    onBuild: options.onBuild ?? ((op) => console.warn('Signed UserOperation:', op)),
  })

  return {
    transactionHash: await res.wait(),
    userOpHash: res.userOpHash,
  }
}
