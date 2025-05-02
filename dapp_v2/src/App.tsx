import { useContext } from 'react'
import { CustomConnectButton } from '@/components/features/connect'
import { SendUserOpContext } from '@/contexts'
import { useScreenManager } from '@/hooks'
import ScreenRenderer from '@/routes/ScreenRenderer'

interface AppProps {
  mode?: 'sidebar' | 'button'
}

function App({ mode }: AppProps) {
  const { isWalletPanel } = useContext(SendUserOpContext)!
  const { currentScreen } = useScreenManager()

  return (
    <div>
      {mode === 'sidebar' ? (
        <div
          className={`fixed transition-transform duration-300 ease-in-out transform ${
            isWalletPanel ? 'translate-x-0' : 'translate-x-[350px]'
          }`}
          style={{ right: 0, top: '50px' }}
        >
          <div className='absolute -left-12'>
            <CustomConnectButton mode={mode} />
          </div>

          <div className='bg-bg-primary rounded-md' style={{ width: '350px' }}>
            <div>{isWalletPanel && <ScreenRenderer currentScreen={currentScreen} />}</div>
          </div>
        </div>
      ) : (
        <div>
          <div className='flex justify-end'>
            <CustomConnectButton mode={mode} />
          </div>
          {isWalletPanel && (
            <div
              className='fixed'
              style={{
                right: 0,
                top: '100px',
                width: '350px',
              }}
            >
              <div className='bg-bg-primary rounded-md'>
                <ScreenRenderer currentScreen={currentScreen} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
