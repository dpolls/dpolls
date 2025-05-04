import React, { useState } from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { TokenIcon, ImportToken, TokenAmount, TruncatedText } from '@/components/features/token'
import { NEROTokenContent } from '@/components/screens/home'
import { useClassifiedTokens, useTokenContext, useScreenManager } from '@/hooks'
import { ERC20Token, screens } from '@/types'
import { formatAndRoundBalance } from '@/utils'

const TokensContent: React.FC = () => {
  const { tokensWithLogos, isLoading } = useClassifiedTokens()
  const { navigateTo } = useScreenManager()
  const { selectToken } = useTokenContext()
  const [showImportModal, setShowImportModal] = useState(false)

  if (isLoading) {
    return (
      <div className='flex flex-col h-full'>
        <div className='flex-grow flex items-center justify-center'>
          <div className='text-center py-4'>Loading tokens...</div>
        </div>
      </div>
    )
  }

  const handleTokenSelect = (token: ERC20Token) => {
    selectToken({
      ...token,
      isNative: false,
    })
    navigateTo(screens.TOKENDETAIL)
  }

  const handleImportSuccess = () => {
    setShowImportModal(false)
  }

  const TokenListItem: React.FC<{ token: ERC20Token }> = ({ token }) => (
    <div
      className='flex items-center justify-between py-2 border-b border-gray-200 w-[85%] mx-auto cursor-pointer'
      onClick={() => handleTokenSelect(token)}
    >
      <div className='flex items-center space-x-2 flex-shrink-0 w-1/2'>
        <TokenIcon
          tokenAddress={token.contractAddress}
          symbol={token.symbol}
          size='sm'
          className='w-10 h-10'
        />
        <div className='flex flex-col'>
          <TruncatedText
            text={token.symbol}
            fontSize='base'
            className='font-bold'
            maxWidth='max-w-[100px]'
          />
        </div>
      </div>
      <div className='flex-shrink min-w-0'>
        <TokenAmount
          amount={formatAndRoundBalance(token.balance, token.decimals)}
          symbol={token.symbol}
          className='text-base'
          symbolClassName='text-base text-text-primary'
          containerClassName='justify-end'
        />
      </div>
    </div>
  )

  return (
    <div className='flex flex-col h-full'>
      {showImportModal ? (
        <div className='flex flex-col h-full w-full relative'>
          <div className='flex-grow flex items-center justify-center'>
            <div className='w-full max-w-md p-4 bg-white rounded'>
              <ImportToken onSuccess={handleImportSuccess} />
            </div>
          </div>
          <div className='absolute bottom-[-25px] left-[-20px] flex justify-between p-10'>
            <button
              onClick={() => setShowImportModal(false)}
              className='flex items-center text-sm text-text-primaryrounded-full'
            >
              <AiFillCaretLeft className='mr-2' />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className='flex-grow overflow-auto'>
            <NEROTokenContent />
            {tokensWithLogos.map((token, index) => (
              <TokenListItem key={index} token={token} />
            ))}
          </div>
          <div className='mx-auto w-[85%] mt-2 mb-2'>
            <button onClick={() => setShowImportModal(true)} className='text-blue-400'>
              + Import Token
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default TokensContent
