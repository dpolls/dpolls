export const extractErrorMessage = (error: any, defaultMessage = 'An error occurred'): string => {
  if (!error) return defaultMessage

  if (typeof error === 'string') {
    if (error.includes('body=')) {
      try {
        const bodyMatch = error.match(/body="(.+?)"/) || error.match(/body=(.+?),/)
        if (bodyMatch && bodyMatch[1]) {
          const parsedBody = JSON.parse(bodyMatch[1].replace(/\\"/g, '"'))
          if (parsedBody?.error?.data?.Reason) {
            return parsedBody.error.data.Reason
          }
          if (parsedBody?.error?.message) {
            return parsedBody.error.message
          }
        }
      } catch (e) {
        // If parsing fails, return the original string
      }
    }
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  if (error?.data?.Reason) {
    return error.data.Reason
  }

  if (error?.message) {
    return error.message
  }

  return defaultMessage
}

export const getUserFriendlyErrorMessage = (errorMsg: string | null): string => {
  if (!errorMsg) return 'Unknown error occurred'

  if (
    errorMsg.includes('NeroPaymaster: insufficient balance') ||
    errorMsg.includes('insufficient balance')
  ) {
    return 'Paymaster service has insufficient balance.'
  }

  if (errorMsg.includes('AA33 reverted')) {
    return 'Transaction was rejected by the paymaster. Please try again later.'
  }

  if (errorMsg.includes('gas required exceeds allowance')) {
    return 'Transaction requires more gas than allowed. Try increasing gas limit.'
  }

  if (
    errorMsg.includes('network error') ||
    errorMsg.includes('connection error') ||
    errorMsg.includes('timeout')
  ) {
    return 'Network connection error. Please check your internet connection and try again.'
  }

  if (errorMsg.includes('user rejected') || errorMsg.includes('User denied')) {
    return 'Transaction was rejected by the user.'
  }

  if (errorMsg.includes('missing response') || errorMsg.includes('code=SERVER_ERROR')) {
    return 'Paymaster service unavailable. Please try again later.'
  }

  if (errorMsg.includes('requestBody') && errorMsg.includes('requestMethod')) {
    return 'Paymaster request failed. Please try again.'
  }

  if (errorMsg.includes('nonce too low') || errorMsg.includes('nonce mismatch')) {
    return 'Transaction nonce error. Please try again.'
  }

  if (errorMsg.includes('execution reverted')) {
    return 'Transaction execution failed. Please try again.'
  }

  if (errorMsg.includes('rate limit') || errorMsg.includes('too many requests')) {
    return 'Rate limit exceeded. Please wait and try again.'
  }

  if (errorMsg.length > 100) {
    return errorMsg.substring(0, 97) + '...'
  }

  return errorMsg
}
