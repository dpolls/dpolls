import { Abi } from 'viem';
export declare const useTokenContracts: (AAaddress: string, tokenAddresses: string[]) => import("wagmi").UseReadContractsReturnType<({
    readonly address: `0x${string}`;
    readonly abi: Abi;
    readonly functionName: "balanceOf";
    readonly args: readonly [`0x${string}`];
} | {
    readonly address: `0x${string}`;
    readonly abi: Abi;
    readonly functionName: "decimals";
} | {
    readonly address: `0x${string}`;
    readonly abi: Abi;
    readonly functionName: "symbol";
} | {
    readonly address: `0x${string}`;
    readonly abi: Abi;
    readonly functionName: "name";
})[], true, ({
    error?: undefined;
    result: unknown;
    status: "success";
} | {
    error: Error;
    result?: undefined;
    status: "failure";
})[]>;
