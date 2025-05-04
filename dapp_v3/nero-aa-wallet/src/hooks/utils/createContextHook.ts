import { Context, useContext } from 'react'

export function createContextHook<T>(context: Context<T | undefined>, hookName: string) {
  return () => {
    const contextValue = useContext(context)
    if (contextValue === undefined) {
      throw new Error(`${hookName} must be used within its corresponding Provider`)
    }
    return contextValue
  }
}
