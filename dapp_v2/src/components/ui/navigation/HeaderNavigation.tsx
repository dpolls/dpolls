import React, { useEffect, useState, useRef, useContext } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { IoArrowBackSharp, IoEarthOutline } from 'react-icons/io5'
import { useAccount, useDisconnect } from 'wagmi'
import NEROLogoSquareIcon from '@/assets/NERO-Logo-square-beta.svg'
import { CopyButton } from '@/components/ui/buttons'
import { ConfigContext } from '@/contexts'
import { useSignature, useScreenManager } from '@/hooks'
import { HeaderNavigationProps, screens } from '@/types'
import { truncateAddress } from '@/utils'

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  className = '',
  title,
  onBack,
  showBackButton = false,
  rightElement,
  isClose = false,
  navigate,
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [favicon, setFavicon] = useState('')
  const { navigateTo, currentScreen, previousScreen } = useScreenManager()
  const [showFallback, setShowFallback] = useState(false)
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { AAaddress } = useSignature()
  const menuRef = useRef<HTMLDivElement>(null)
  const config = useContext(ConfigContext)
  const [showNetworkMenu, setShowNetworkMenu] = useState(false)
  const networkMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isConnected) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']")
      if (link) {
        setFavicon(link.href)
      }
    }
  }, [isConnected])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (networkMenuRef.current && !networkMenuRef.current.contains(event.target as Node)) {
        setShowNetworkMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleIconClick = () => {
    if (isClose && navigate) {
      navigate()
    } else {
      if (currentScreen === screens.SETTING) {
        navigateTo(previousScreen)
      } else {
        navigateTo(screens.SETTING)
      }
    }
  }

  const handleDisconnect = async () => {
    disconnect()
    setShowMenu(false)
  }

  const handleBackClick = () => {
    if (onBack) {
      onBack()
    } else {
      navigateTo(previousScreen)
    }
  }

  const handleNetworkSelect = (index: number) => {
    config?.switchToNetwork(index)
    setShowNetworkMenu(false)
  }

  return (
    <div
      className={`flex items-center justify-between border-b border-border-primary rounded-tr rounded-tl text-text-primary bg-white px-2 py-2 ${className}`}
    >
      <div className='flex items-center gap-2'>
        {showBackButton && (
          <button onClick={handleBackClick} className='p-1 rounded-full hover:bg-gray-100'>
            <IoArrowBackSharp className='size-5' />
          </button>
        )}
        {title ? (
          <h2 className='text-lg font-medium'>{title}</h2>
        ) : (
          <img src={NEROLogoSquareIcon} alt='NERO Logo' width={30} height={30} />
        )}
      </div>
      <div className='flex items-center gap-2'>
        <div className='flex flex-col items-center '>
          <div>
            {AAaddress && (
              <CopyButton textToCopy={AAaddress} className='flex items-center'>
                <span className='font-bold text-sm'>{truncateAddress(AAaddress)}</span>
              </CopyButton>
            )}
            {!AAaddress && <span className='font-bold text-sm'>AAWallet</span>}
          </div>

          <div className='relative' ref={networkMenuRef}>
            <button
              onClick={() => setShowNetworkMenu(!showNetworkMenu)}
              className='flex items-center gap-1 text-xs rounded hover:bg-gray-100'
            >
              <IoEarthOutline className='size-4' />
              <span>{config?.networkType}</span>
            </button>

            {showNetworkMenu && (
              <div className='absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10'>
                <div className='py-1' role='menu'>
                  {config?.chains.map((chain, index) => (
                    <button
                      key={chain.chain.networkType}
                      onClick={() => handleNetworkSelect(index)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                        ${index === config.currentNetworkIndex ? 'text-primary bg-gray-50' : 'text-gray-700'}`}
                    >
                      {chain.chain.networkType}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center space-x-2'>
        {rightElement}
        {isConnected && (
          <div className='relative border rounded-full border-border-primary' ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className='flex items-center space-x-2 hover:bg-gray-200 rounded-full'
            >
              {favicon && !showFallback ? (
                <img
                  src={favicon}
                  alt='Site favicon'
                  width={24}
                  height={24}
                  className='rounded-full object-cover'
                  onError={() => setShowFallback(true)}
                />
              ) : (
                <div className='w-6 h-6 flex items-center justify-center'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                </div>
              )}
            </button>
            {showMenu && (
              <div className='absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10'>
                <div
                  className='py-1'
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='options-menu'
                >
                  <button
                    onClick={handleDisconnect}
                    className='block w-full text-left px-4 py-2 text-sm text-text-tertiary hover:bg-gray-100'
                    role='menuitem'
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <BsThreeDotsVertical className='size-5 cursor-pointer' onClick={handleIconClick} />
      </div>
    </div>
  )
}

export default HeaderNavigation
