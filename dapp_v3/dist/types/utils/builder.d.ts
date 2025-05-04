import { ethers } from 'ethers';
import { Presets } from 'userop';
export declare const useBuilderWithPaymaster: (signer: ethers.Signer | undefined) => {
    initBuilder: (usePaymaster: boolean, paymasterTokenAddress?: string, type?: number) => Promise<Presets.Builder.SimpleAccount | undefined>;
};
