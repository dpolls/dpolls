import NEROIcon from '@/assets/NERO-icon.svg'
import { NeroToEthAddressMap } from '@/config/NeroToEthAddressMap'

const TRUST_WALLET_ASSETS_BASE_URL =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains'

export async function getTokenLogo(customAddress: string): Promise<string | null> {
  const logoUrl = `${TRUST_WALLET_ASSETS_BASE_URL}/${customAddress}/logo.png`
  try {
    const response = await fetch(logoUrl, { method: 'HEAD' })
    if (response.ok) {
      return logoUrl
    }
  } catch (error) {
    console.error(`Failed to fetch logo for customAddress`)
  }
  return null
}

export const getTokenIcon = async (
  tokenAddress: string,
  symbol: string,
  isNative: boolean = false,
): Promise<string> => {
  if (isNative || symbol === 'NERO') {
    return NEROIcon
  }

  const matchingToken = Object.values(NeroToEthAddressMap).find(
    (t) => t.address.toLowerCase() === tokenAddress.toLowerCase(),
  )
  if (matchingToken?.icon) {
    return matchingToken.icon
  }

  const trustWalletLogo = await getTokenLogo(tokenAddress)
  if (trustWalletLogo) {
    return trustWalletLogo
  }

  return createTokenImg(symbol)
}

export const createTokenImg = (tokenName: string) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = 100
  canvas.height = 100
  context!.beginPath()
  context!.arc(50, 50, 50, 0, Math.PI * 2)
  context!.fillStyle = '#323232'
  context!.fill()
  const fontSize = 50
  context!.font = `${fontSize}px DMSans`
  context!.textBaseline = 'middle'
  context!.textAlign = 'center'
  context!.fillStyle = '#fff'
  context!.fillText(tokenName.charAt(0), 50, 50)

  return canvas.toDataURL('image/png', 1)
}
