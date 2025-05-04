import React from 'react'
import { ImportAsset } from '@/components/features/asset/containers'
import { ImportNFTProps } from '@/types'

const ImportNFT: React.FC<ImportNFTProps> = ({ onSuccess }) => {
  return <ImportAsset assetType='nft' onSuccess={onSuccess} />
}

export default ImportNFT
