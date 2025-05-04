import {
  EntryPoint__factory,
  SimpleAccountFactory__factory,
  SimpleAccount__factory,
} from '@account-abstraction/contracts'
import { ethers } from 'ethers'
import { BundlerJsonRpcProvider, Presets, UserOperationBuilder } from 'userop'
import { ERC4337 } from 'userop/dist/constants'
import type {
  EntryPoint,
  SimpleAccountFactory,
  SimpleAccount as SimpleAccountImpl,
} from '@account-abstraction/contracts'
import type { BigNumberish, BytesLike } from 'ethers'
import type { IPresetBuilderOpts, UserOperationMiddlewareFn } from 'userop'
import { ERC20_ABI, ERC721_ABI } from '@/constants/abi'

const { getGasPrice, estimateUserOperationGas, EOASignature } = Presets.Middleware

export class SimpleAccount extends UserOperationBuilder {
  private signer: ethers.Signer
  private provider: ethers.providers.JsonRpcProvider
  private entryPoint: EntryPoint
  private factory: SimpleAccountFactory
  private initCode: string
  proxy: SimpleAccountImpl

  private constructor(signer: ethers.Signer, rpcUrl: string, opts?: IPresetBuilderOpts) {
    super()
    this.signer = signer
    this.provider = new BundlerJsonRpcProvider(rpcUrl).setBundlerRpc(opts?.overrideBundlerRpc)
    this.entryPoint = EntryPoint__factory.connect(
      opts?.entryPoint || ERC4337.EntryPoint,
      this.provider,
    )
    this.factory = SimpleAccountFactory__factory.connect(
      opts?.factory || ERC4337.SimpleAccount.Factory,
      this.provider,
    )
    this.initCode = '0x'
    this.proxy = SimpleAccount__factory.connect(ethers.constants.AddressZero, this.provider)
  }

  private resolveAccount: UserOperationMiddlewareFn = async (ctx) => {
    ctx.op.nonce = await this.entryPoint.getNonce(ctx.op.sender, 0)
    ctx.op.initCode = ctx.op.nonce.eq(0) ? this.initCode : '0x'
  }

  public static async init(
    signer: ethers.Signer,
    rpcUrl: string,
    opts?: IPresetBuilderOpts,
  ): Promise<SimpleAccount> {
    const instance = new SimpleAccount(signer, rpcUrl, opts)

    const address = await instance.signer.getAddress()

    try {
      instance.initCode = await ethers.utils.hexConcat([
        instance.factory.address,
        instance.factory.interface.encodeFunctionData('createAccount', [
          address,
          ethers.BigNumber.from(opts?.salt ?? 0),
        ]),
      ])

      await instance.entryPoint.callStatic.getSenderAddress(instance.initCode)
      throw new Error('getSenderAddress: unexpected result')
    } catch (error: any) {
      const addr = error?.errorArgs?.sender
      if (!addr) {
        throw error
      }

      instance.proxy = SimpleAccount__factory.connect(addr, instance.provider)
    }

    const base = instance
      .useDefaults({
        sender: instance.proxy.address,
        signature: await instance.signer.signMessage(
          ethers.utils.arrayify(ethers.utils.keccak256('0xdead')),
        ),
      })
      .useMiddleware(instance.resolveAccount)
      .useMiddleware(getGasPrice(instance.provider))

    const withPM = opts?.paymasterMiddleware
      ? base.useMiddleware(opts.paymasterMiddleware)
      : base.useMiddleware(estimateUserOperationGas(instance.provider))

    return withPM.useMiddleware(EOASignature(instance.signer))
  }

  async checkUserOp(opHash: string) {
    let recipe = await this.provider.send('eth_getUserOperationReceipt', [opHash])
    if (recipe.success) {
      return true
    }
    return false
  }

  execute(to: string, value: BigNumberish, data: BytesLike) {
    return this.setCallData(this.proxy.interface.encodeFunctionData('execute', [to, value, data]))
  }

  executeBatch(to: Array<string>, data: Array<BytesLike>) {
    return this.setCallData(this.proxy.interface.encodeFunctionData('executeBatch', [to, data]))
  }

  erc20transfer(contractaddress: string, to: string, value: BigNumberish) {
    const erc20 = new ethers.Contract(contractaddress, ERC20_ABI, this.provider)
    const approve = {
      to: contractaddress,
      value: ethers.constants.Zero,
      data: erc20.interface.encodeFunctionData('approve', [to, value]),
    }
    const send = {
      to: contractaddress,
      value: ethers.constants.Zero,
      data: erc20.interface.encodeFunctionData('transfer', [to, value]),
    }
    return this.executeBatch([approve.to, send.to], [approve.data, send.data])
  }

  erc721transfer(contractAddress: string, to: string, tokenId: BigNumberish) {
    const erc721 = new ethers.Contract(contractAddress, ERC721_ABI, this.provider)
    const transfer = {
      to: contractAddress,
      value: ethers.constants.Zero,
      data: erc721.interface.encodeFunctionData('transferFrom', [this.proxy.address, to, tokenId]),
    }
    return this.executeBatch([transfer.to], [transfer.data])
  }
}
