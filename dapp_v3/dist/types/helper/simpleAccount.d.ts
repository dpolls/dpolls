import { ethers } from 'ethers';
import { UserOperationBuilder } from 'userop';
import type { SimpleAccount as SimpleAccountImpl } from '@account-abstraction/contracts';
import type { BigNumberish, BytesLike } from 'ethers';
import type { IPresetBuilderOpts } from 'userop';
export declare class SimpleAccount extends UserOperationBuilder {
    private signer;
    private provider;
    private entryPoint;
    private factory;
    private initCode;
    proxy: SimpleAccountImpl;
    private constructor();
    private resolveAccount;
    static init(signer: ethers.Signer, rpcUrl: string, opts?: IPresetBuilderOpts): Promise<SimpleAccount>;
    checkUserOp(opHash: string): Promise<boolean>;
    execute(to: string, value: BigNumberish, data: BytesLike): this;
    executeBatch(to: Array<string>, data: Array<BytesLike>): this;
    erc20transfer(contractaddress: string, to: string, value: BigNumberish): this;
    erc721transfer(contractAddress: string, to: string, tokenId: BigNumberish): this;
}
