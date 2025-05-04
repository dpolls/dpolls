import NEROIcon from '@/assets/NERO-icon.svg'
import undefinedTokenIcon from '@/assets/undefined-token.png'

export const dummyTokens = [
  {
    symbol: 'NERO',
    amount: '0',
    value: '0.04',
    icon: NEROIcon,
    contractAddress: '0x123',
  },
  {
    symbol: 'JPYT',
    amount: '0',
    value: '0.001217',
    icon: undefinedTokenIcon,
    contractAddress: '0x456',
  },
  { symbol: 'RERERE', amount: '3.455K', value: '', contractAddress: '0x789' },
  { symbol: 'SNT', amount: '100.00K', value: '', contractAddress: '0xabc' },
  { symbol: 'HHH', amount: '300.00', value: '', contractAddress: '0xdef' },
  { symbol: 'CCCC', amount: '', value: '', contractAddress: '0xghi' },
]
