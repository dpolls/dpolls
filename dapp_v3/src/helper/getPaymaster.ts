import { ethers } from 'ethers'
import { Presets } from 'userop'
import type { UserOperationMiddlewareFn } from 'userop'
import { useConfig } from '@/hooks'

const tokenPaymaster = (): UserOperationMiddlewareFn => async (ctx) => {
  const { bundlerUrl, tokenPaymaster } = useConfig()
  const bundlerProvider = new ethers.providers.JsonRpcProvider(bundlerUrl)
  await Presets.Middleware.estimateUserOperationGas(bundlerProvider)(ctx)
  ctx.op.preVerificationGas = ethers.BigNumber.from(ctx.op.preVerificationGas).mul(2)
  ctx.op.verificationGasLimit = ethers.BigNumber.from(ctx.op.verificationGasLimit).mul(3)
  ctx.op.paymasterAndData = tokenPaymaster
}

export const getPaymaster = (paymaster: string) => {
  switch (paymaster) {
    // case "verifying":
    //   return verifyingPaymaster();
    // case "legacy-token":
    //   return legacyTokenPaymaster();
    case 'token':
      return tokenPaymaster()
    default:
      throw new Error('invalid paymaster')
  }
}
