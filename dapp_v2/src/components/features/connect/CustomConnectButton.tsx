import React, { useEffect, useContext, useState } from 'react'
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import {
  WalletConnectSidebar,
  ToggleWalletVisibilityButton,
  WalletConnectRoundedButton,
} from '@/components/features/connect'
import { SendUserOpContext } from '@/contexts'
import { useSignature } from '@/hooks'
import { CustomConnectButtonProps } from '@/types'

const CustomConnectButton: React.FC<CustomConnectButtonProps> = ({ mode }) => {
  const { isWalletPanel, setIsWalletPanel } = useContext(SendUserOpContext)!
  const { AAaddress } = useSignature()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      setIsWalletPanel(false)
    }
  }, [isConnected, setIsWalletPanel])

  const renderButton = (openConnectModal: () => void) => (
    <WalletConnectSidebar onClick={openConnectModal} variant='Connect' />
  )

  return (
    <div>
      <RainbowConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
          const ready = mounted && authenticationStatus !== 'loading'
          const connected = Boolean(
            ready &&
              account &&
              chain &&
              (!authenticationStatus || authenticationStatus === 'authenticated'),
          )

          if (isConnected !== connected) {
            setIsConnected(connected)
          }

          if (!ready) return null
          if (chain?.unsupported) {
            return <WalletConnectSidebar variant='Connect' onClick={openChainModal} />
          }

          if (mode === 'button') {
            if (connected) {
              return (
                <WalletConnectRoundedButton
                  onClick={() => setIsWalletPanel(!isWalletPanel)}
                  AAaddress={AAaddress}
                  isConnected={connected}
                />
              )
            }
            if (!connected) {
              return (
                <WalletConnectRoundedButton
                  onClick={openConnectModal}
                  AAaddress={AAaddress}
                  isConnected={connected}
                />
              )
            }
          }

          if (mode === 'sidebar') {
            if (connected) {
              return (
                <ToggleWalletVisibilityButton
                  onClick={() => setIsWalletPanel(!isWalletPanel)}
                  size={'sm'}
                  isWalletPanel={isWalletPanel}
                />
              )
            }
            if (!connected) {
              return renderButton(openConnectModal)
            }
          } else {
            return null
          }
        }}
      </RainbowConnectButton.Custom>
    </div>
  )
}

export default CustomConnectButton
