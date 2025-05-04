import React, { createContext, useState } from 'react'
import { Screen, screens, ScreenManagerContextType, ProviderProps } from '@/types'

export const ScreenManagerContext = createContext<ScreenManagerContextType | undefined>(undefined)

export const ScreenManagerProvider: React.FC<ProviderProps> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(screens.HOME)
  const [previousScreen, setPreviousScreen] = useState<Screen>(screens.HOME)

  const navigateTo = (screen: Screen) => {
    setPreviousScreen(currentScreen)
    setCurrentScreen(screen)
  }

  return (
    <ScreenManagerContext.Provider value={{ currentScreen, previousScreen, navigateTo }}>
      {children}
    </ScreenManagerContext.Provider>
  )
}
