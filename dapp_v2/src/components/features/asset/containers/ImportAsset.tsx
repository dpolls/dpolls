import React, { useState } from 'react'
import noImageIcon from '@/assets/noimage.svg'
import undefinedTokenIcon from '@/assets/undefined-token.png'
import { ImportButton } from '@/components/ui/buttons'
import { ContractAddressInput, TokenIdInput } from '@/components/ui/inputs'
import getNftImgNameFromUri from '@/helper/getNftImgNameFromUri'
import {
  useContractValidation,
  useCustomERC20Tokens,
  useCustomERC721Tokens,
  useSimpleAccount,
} from '@/hooks'
import { ERC20Token, NftWithImages, TokenData, ImportAssetProps } from '@/types'

const ImportAsset: React.FC<ImportAssetProps> = ({ assetType, onSuccess, onImport, onClose }) => {
  const [contractAddress, setContractAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isValidContractAddress, setIsValidContractAddress] = useState(false)
  const [isValidTokenId, setIsValidTokenId] = useState(false)

  const { addERC20Token, erc20Tokens } = useCustomERC20Tokens()
  const { addERC721Token, erc721Tokens } = useCustomERC721Tokens()
  const { AAaddress } = useSimpleAccount()

  const isToken = assetType === 'token'

  const { isValidContract, contractInfo, isError } = useContractValidation({
    contractAddress,
    tokenId: !isToken ? tokenId : undefined,
    contractType: isToken ? 'ERC20' : 'ERC721',
  })

  const fetchNFTMetadata = async (tokenURI: string, tokenId: string) => {
    try {
      const metadata = await getNftImgNameFromUri(tokenURI, tokenId)
      return {
        name: metadata?.name || `Token #${tokenId}`,
        image: metadata?.imageUrl || noImageIcon,
      }
    } catch (error) {
      console.warn('Failed to fetch NFT metadata:', error)
      return {
        name: `Token #${tokenId}`,
        image: noImageIcon,
      }
    }
  }

  const handleContractAddressChange = (value: string, isValid: boolean) => {
    setContractAddress(value)
    setIsValidContractAddress(isValid)
    if (value && !isValid) {
      setError('Invalid contract address format')
    } else {
      setError(null)
    }
  }

  const handleTokenIdChange = (value: string, isValid: boolean) => {
    setTokenId(value)
    setIsValidTokenId(isValid)
    if (value && !isValid) {
      setError('Invalid token ID format')
    } else {
      setError(null)
    }
  }

  const handleImportToken = async () => {
    if (isImporting) return
    setIsImporting(true)

    try {
      if (isError || !contractInfo) {
        setError('Invalid token address')
        return
      }

      if (
        erc20Tokens.some(
          (token) => token.contractAddress.toLowerCase() === contractAddress.toLowerCase(),
        )
      ) {
        setError('This token has already been added')
        return
      }

      const [name, symbol, decimals] = contractInfo.map((data) => data.result)

      const newToken: ERC20Token = {
        contractAddress,
        symbol: symbol as string,
        name: name as string,
        decimals: (decimals as number).toString(),
        balance: '0',
        logo: undefinedTokenIcon,
        type: 'ERC-20',
      }

      addERC20Token(newToken)
      if (onImport) {
        onImport(newToken)
      }
      resetForm()
      if (onSuccess) {
        onSuccess()
      }
      if (onClose) {
        onClose()
      }
    } catch (err) {
      setError('Failed to import token')
    } finally {
      setIsImporting(false)
    }
  }

  const handleImportNFT = async () => {
    if (isImporting) return
    setIsImporting(true)

    try {
      if (isError || !contractInfo || !AAaddress) {
        setError('Invalid NFT address, token ID, or AA address not available')
        return
      }

      const [name, symbol, tokenURI, owner] = contractInfo.map((data) => data.result)

      if (owner?.toLowerCase() !== AAaddress.toLowerCase()) {
        setError('You are not the owner of this NFT')
        return
      }

      const existingNFT = erc721Tokens.find(
        (token) => token.contractAddress.toLowerCase() === contractAddress.toLowerCase(),
      )

      const metadata = await fetchNFTMetadata(tokenURI as string, tokenId)

      const newTokenData: TokenData = {
        tokenId: parseInt(tokenId),
        tokenURI: tokenURI as string,
        name: metadata.name,
        image: metadata.image,
      }

      let resultNFT: NftWithImages

      if (existingNFT) {
        if (existingNFT.tokenData.some((token) => token.tokenId === parseInt(tokenId))) {
          setError('This token ID has already been added for this contract')
          return
        }

        resultNFT = {
          ...existingNFT,
          tokenData: [...existingNFT.tokenData, newTokenData],
          balance: (parseInt(existingNFT.balance) + 1).toString(),
        }
        addERC721Token(resultNFT)
      } else {
        resultNFT = {
          contractAddress,
          name: name as string,
          symbol: symbol as string,
          type: 'ERC-721',
          decimals: '',
          balance: '1',
          tokenData: [newTokenData],
        }
        addERC721Token(resultNFT)
      }

      if (onImport) {
        onImport(resultNFT)
      }
      resetForm()
      if (onSuccess) {
        onSuccess()
      }
      if (onClose) {
        onClose()
      }
    } catch (err) {
      setError('Failed to import NFT. Please try again.')
    } finally {
      setIsImporting(false)
    }
  }

  const resetForm = () => {
    setContractAddress('')
    setTokenId('')
    setError(null)
    setIsValidContractAddress(false)
    setIsValidTokenId(false)
  }

  const handleImport = isToken ? handleImportToken : handleImportNFT

  const isImportReady =
    isValidContractAddress &&
    (isToken || isValidTokenId) &&
    !isImporting &&
    !error &&
    isValidContract

  return (
    <div className='flex flex-col w-full max-w-md mx-auto'>
      <ContractAddressInput
        value={contractAddress}
        onChange={handleContractAddressChange}
        label={`${isToken ? 'Token' : 'NFT'} Contract Address`}
        placeholder={`Enter ${isToken ? 'token' : 'NFT'} contract address`}
        error={error}
      />

      {!isToken && (
        <TokenIdInput
          value={tokenId}
          onChange={handleTokenIdChange}
          label='Token ID'
          placeholder='Enter token ID'
          error={error}
        />
      )}

      <div className='flex justify-center w-full'>
        <ImportButton
          onClick={handleImport}
          isReady={isImportReady}
          isImporting={isImporting}
          label={`Import ${isToken ? 'Token' : 'NFT'}`}
        />
      </div>

      {error && <p className='text-red-500 text-center'>{error}</p>}
    </div>
  )
}

export default ImportAsset
