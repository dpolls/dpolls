import { ethers } from 'ethers'
import { SimpleAccount } from '@/helper/simpleAccount'

export interface ERC721TransferParams {
  contractAddress: string
  to: string
  tokenId: ethers.BigNumberish
  client: any
  simpleAccount: SimpleAccount
  options?: {
    dryRun?: boolean
    onBuild?: (op: any) => void
  }
}

export interface ExecuteTransactionParams {
  to: string
  value: ethers.BigNumberish
  data: ethers.BytesLike
  client: any
  simpleAccount: SimpleAccount
  options?: {
    dryRun?: boolean
    onBuild?: (op: any) => void
  }
}

export interface WalletInfo {
  client: any
  simpleAccount: SimpleAccount
}
