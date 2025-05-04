import { NEROTokenDetail, TokenDetail } from '@/components/features'
import { NFTDetail, NFTTransferPreview, NFTTransferPanel } from '@/components/screens'
import { WalletPanel, ExpandedTabContent } from '@/components/screens/home'
import {
  MultiSendPanel,
  MultiSendConfirmPanel,
  MultiSendPreviewPanel,
} from '@/components/screens/multiSend'
import { ReceivePanel } from '@/components/screens/receive'
import { SendPanel } from '@/components/screens/Send'
import { SendUserOpPanel } from '@/components/screens/Send'
import { SettingPanel } from '@/components/screens/setting'
import { TokenIndex } from '@/components/screens/Token'
import { screens, Screen } from '@/types'

interface ScreenRendererProps {
  currentScreen: Screen
}

function ScreenRenderer({ currentScreen }: ScreenRendererProps) {
  switch (currentScreen) {
    case screens.HOME:
      return <WalletPanel />
    case screens.SEND:
      return <SendPanel />
    case screens.MULTISEND:
      return <MultiSendPanel />
    case screens.MULTISENDDETAIL:
      return <MultiSendPreviewPanel />
    case screens.MULTISENDCONFIRM:
      return <MultiSendConfirmPanel />
    case screens.RECEIVE:
      return <ReceivePanel />
    case screens.SETTING:
      return <SettingPanel />
    case screens.NFT:
      return <ExpandedTabContent tab='NFTs' />
    case screens.NFTDETAIL:
      return <NFTDetail />
    case screens.NFTTRANSFER:
      return <NFTTransferPanel />
    case screens.NFTTRANSFERPREVIEW:
      return <NFTTransferPreview />
    case screens.TOKEN:
      return <ExpandedTabContent tab='Tokens' />
    case screens.ACTIVITY:
      return <WalletPanel initialTab='Activity' />
    case screens.TOKENINDEX:
      return <TokenIndex />
    case screens.TOKENDETAIL:
      return <TokenDetail />
    case screens.NEROTOKENDETAIL:
      return <NEROTokenDetail />
    case screens.SENDUSEROP:
      return <SendUserOpPanel />
    default:
      return <WalletPanel />
  }
}

export default ScreenRenderer
