import React from 'react'
import { ImportAsset } from '@/components/features/asset/containers'
import { ImportTokenProps } from '@/types'

const ImportToken: React.FC<ImportTokenProps> = ({ onSuccess }) => {
  return <ImportAsset assetType='token' onSuccess={onSuccess} />
}

export default ImportToken
