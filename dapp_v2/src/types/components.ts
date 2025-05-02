import { ReactNode } from 'react'
import { IconType } from 'react-icons'
import { ERC20Token, NftWithImages, Token, TokenData } from './Token'

// ===== Base Components =====
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

export interface ClickableComponentProps extends BaseComponentProps {
  onClick?: () => void
  disabled?: boolean
}

// ===== Connect =====

export interface CustomConnectButtonProps extends ClickableComponentProps {
  onConnect?: () => void
  mode?: 'sidebar' | 'button'
}

export interface WalletConnectButtonProps extends ClickableComponentProps {
  onConnect: () => void
}

export interface WalletConnectRoundedButtonProps extends ClickableComponentProps {
  onConnect?: () => void
  AAaddress: string
  isConnected: boolean
}

export interface ToggleWalletVisibilityButtonProps {
  onClick: () => void
  size: 'sm' | 'md' | 'lg'
  isWalletPanel: boolean
  isVisible?: boolean
  toggleVisibility?: () => void
}

export interface WalletConnectSidebarProps {
  variant: 'Connect' | 'Contact'
  onClick?: () => void
}

// ===== CommonUI =====

export interface LoadingScreenProps {
  message?: string
  isCompleted?: boolean
  userOpResult?: boolean
}

// ===== Navigation =====

export interface NavigationProps extends BaseComponentProps {
  variant?: 'header' | 'bottom' | 'balance'
}

export interface HeaderNavigationProps extends NavigationProps {
  title?: string
  onBack?: () => void
  showBackButton?: boolean
  rightElement?: ReactNode
  isClose?: boolean
  navigate?: () => void
}

export interface BottomNavigationProps extends NavigationProps {
  activeScreen?: string
  onNavigate?: (screen: string) => void
}

export interface BalanceNavigationProps extends NavigationProps {
  activeScreen?: string
  onSend?: () => void
  onReceive?: () => void
}

export interface NavigationItemProps extends BaseComponentProps {
  icon: IconType
  label?: string
  isActive?: boolean
  onClick?: () => void
  variant?: 'header' | 'bottom' | 'balance'
  iconRotation?: number
}

// ===== Layout =====

export interface CommonContainerPanelProps extends BaseComponentProps {
  footer?: ReactNode
}

export interface CardProps extends ClickableComponentProps {
  headerContent?: ReactNode
  footerContent?: ReactNode
  bordered?: boolean
  shadow?: boolean
  hoverable?: boolean
  padding?: boolean
  rounded?: boolean
}

export interface BaseCardItemProps extends BaseComponentProps {
  label: ReactNode
  value: ReactNode
  labelClassName?: string
  valueClassName?: string
}

export interface CardItem {
  label: ReactNode
  value: ReactNode
  labelClassName?: string
  valueClassName?: string
}

// ===== Home =====

export interface WalletPanelProps extends BaseComponentProps {
  initialTab?: 'Tokens' | 'NFTs' | 'Activity'
}

export interface BalancePanelProps extends BaseComponentProps {
  showIcon?: boolean
  showBalanceLabel?: boolean
}

// ===== TabContents =====

export interface ExpandedTabContentProps {
  activeTab?: string
  tab: string
}

export type NFTCardType = Omit<NftWithImages, 'tokenData'> & TokenData

// ===== Token =====

export interface TokenSelectProps {
  tokens: Token[]
  onSelect: (token: Token) => void
  selectedToken?: Token
  onClose: () => void
  onSelectToken?: (token: Token) => void
}

export interface TruncatedTextProps extends BaseComponentProps {
  text: string
  startChars?: number
  endChars?: number
  maxLength?: number
  maxWidth?: string
  withTooltip?: boolean
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  as?: 'span' | 'p' | 'div'
}

export interface ImportTokenProps {
  onImport?: (token: ERC20Token) => void
  onClose?: () => void
  onSuccess?: () => void
}

export interface ImportNFTProps {
  onImport?: (nft: NftWithImages) => void
  onClose?: () => void
  onSuccess?: () => void
}

export interface ImportAssetProps {
  assetType: 'token' | 'nft'
  onImport?: (asset: ERC20Token | NftWithImages) => void
  onClose?: () => void
  onSuccess?: () => void
}

export interface TokenAmountProps {
  amount: string
  symbol: string
  className?: string
  showSymbol?: boolean
  symbolClassName?: string
  containerClassName?: string
  showFullAmount?: boolean
  amountFontSize?: string
}

export interface TokenIconProps {
  token?: Token
  size?: number | 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  tokenAddress?: string
  symbol?: string
  isNative?: boolean
}

export interface NFTCardProps {
  nft: NFTCardType
  onClick: (nft: NFTCardType) => void
}

// ===== Transaction =====

export interface TransactionDetailCardProps extends BaseComponentProps {
  title?: string
  value?: string | ReactNode
  from?: string
  to?: string
  networkFee?: string
  gasTokenSymbol?: string
  networkType?: string
  header?: ReactNode
  amount?: ReactNode
}

export interface TransactionPreviewProps {
  from: string
  to: string
  amount?: string
  token?: Token
  fee?: string
  isLoading?: boolean
  error?: string
  onConfirm?: () => Promise<any>
  onCancel?: () => void
  fromAddress?: string
  toAddress?: string
  networkFee?: string
  gasTokenSymbol?: string
  onClose?: () => void
  onReset?: () => void
  children?: ReactNode
  title?: string
}

// ===== Settings =====

export interface SettingItemProps {
  title?: string
  description?: string
  icon?: ReactNode
  onClick?: () => void
  label?: string
}
