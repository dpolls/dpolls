import ReactDOM from 'react-dom/client'
import Sample from './Sample'
import neroConfig from '../nerowallet.config'
import { SocialWallet } from './index'
import '@rainbow-me/rainbowkit/styles.css'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SocialWallet config={neroConfig} mode='sidebar'>
    <Sample />
  </SocialWallet>,
)
