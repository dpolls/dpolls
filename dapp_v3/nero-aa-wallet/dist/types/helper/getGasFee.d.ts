import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumberish } from 'ethers';
interface Gas {
    maxFeePerGas: BigNumberish;
    maxPriorityFeePerGas: BigNumberish;
}
export declare function getGasFee(provider: JsonRpcProvider): Promise<Gas>;
export {};
