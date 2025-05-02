import React from 'react'
import { Button } from '@/components/ui/buttons'
import { ImportButtonProps } from '@/types'

const ImportButton: React.FC<ImportButtonProps> = ({
  onClick,
  isReady,
  isImporting,
  label = 'Import',
  importingLabel = 'Importing...',
  className = '',
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={!isReady || isImporting}
      variant='tertiary'
      className={`w-full font-bold py-2 px-4 rounded mb-4 ${className}`}
    >
      {isImporting ? importingLabel : label}
    </Button>
  )
}

export default ImportButton
