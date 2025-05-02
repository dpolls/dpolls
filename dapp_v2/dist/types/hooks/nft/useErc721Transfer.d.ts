declare const useErc721Transfer: () => {
    nftTransfer: (contractAddress: string, receiverAddress: string, tokenId: string, usePaymaster?: boolean, paymasterTokenAddress?: string, type?: number) => Promise<{
        userOpHash: string;
        wait: () => Promise<import("userop/dist/typechain/EntryPoint").UserOperationEventEvent | null>;
    } | null | undefined>;
    estimateNftTransferFee: (contractAddress: string, receiverAddress: string, tokenId: string, usePaymaster?: boolean, paymasterTokenAddress?: string, type?: number) => Promise<string>;
    isLoading: boolean;
    isSuccess: boolean;
};
export default useErc721Transfer;
