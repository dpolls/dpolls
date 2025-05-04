import { IconType } from 'react-icons'
import { BaseComponentProps, ClickableComponentProps } from './components'

export interface ButtonProps extends ClickableComponentProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'icon' | 'text' | 'balance'
  icon?: IconType
  iconPosition?: 'left' | 'right'
  isActive?: boolean
  iconRotation?: number
}

export interface ImportButtonProps {
  onClick: () => void
  isReady: boolean
  isImporting: boolean
  label?: string
  importingLabel?: string
  className?: string
}

export interface ActionButtonsProps {
  onCancel?: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  confirmDisabled?: boolean
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  isNextDisabled?: boolean
  nextVariant?: 'primary' | 'secondary'
}

export interface CopyButtonProps extends BaseComponentProps {
  textToCopy: string
  size?: number
}
