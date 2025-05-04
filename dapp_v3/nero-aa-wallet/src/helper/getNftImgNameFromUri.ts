import noImageIcon from '@/assets/noimage.svg'

export default async function getNftImgNameFromUri(uri: string, tokenId?: string) {
  const gateways = [
    'https://ipfs.io/ipfs/',
    'https://dweb.link/ipfs/',
    'https://trustless-gateway.link/ipfs/',
  ]
  const NO_IMAGE_PATH = noImageIcon

  function readableUri(uri: string, gateway: string) {
    return uri.startsWith('ipfs://') ? uri.replace('ipfs://', gateway) : uri
  }

  async function fetchWithTimeout(url: string, timeout = 5000) {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(id)
      return response
    } catch (error) {
      clearTimeout(id)
      throw error
    }
  }

  async function tryFetchUri(uri: string, gateway: string) {
    let attemptUri = readableUri(uri, gateway)
    if (tokenId) {
      attemptUri = `${attemptUri}/${tokenId}`
    }
    return await fetchWithTimeout(attemptUri)
  }

  async function getMetadata(uri: string) {
    for (const gateway of gateways) {
      try {
        const res = await tryFetchUri(uri, gateway)
        if (!res.ok) continue

        const contentType = res.headers.get('content-type')
        if (contentType?.includes('image')) {
          return {
            name: tokenId ? `Token #${tokenId}` : 'Unknown Token',
            imageUrl: res.url,
          }
        }

        const json = await res.json()
        if (!json) continue

        return {
          name: json.name || (tokenId ? `Token #${tokenId}` : 'Unknown Token'),
          imageUrl: json.image || json.image_url || '',
          gateway,
        }
      } catch {
        continue
      }
    }
    return null
  }

  async function validateImageUrl(imageUrl: string, gateway: string) {
    if (!imageUrl) return false

    const finalUrl = imageUrl.startsWith('ipfs://')
      ? readableUri(imageUrl, gateway)
      : !imageUrl.startsWith('http')
        ? `${gateway}${imageUrl}`
        : imageUrl

    try {
      const res = await fetchWithTimeout(finalUrl)
      return res.ok ? finalUrl : false
    } catch {
      return false
    }
  }

  try {
    const metadata = await getMetadata(uri)
    if (!metadata) {
      return { name: tokenId ? `Token #${tokenId}` : 'Unknown Token', imageUrl: NO_IMAGE_PATH }
    }

    const { name, imageUrl, gateway } = metadata
    if (!imageUrl) {
      return { name, imageUrl: NO_IMAGE_PATH }
    }

    const validatedImageUrl = await validateImageUrl(imageUrl, gateway!)
    return {
      name,
      imageUrl: validatedImageUrl || NO_IMAGE_PATH,
    }
  } catch {
    return {
      name: tokenId ? `Token #${tokenId}` : 'Unknown Token',
      imageUrl: NO_IMAGE_PATH,
    }
  }
}
