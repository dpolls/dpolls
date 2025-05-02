export const dummyEcosystemTabs: Tab[] = [
  { id: 'all', label: 'ALL' },
  { id: 'defi', label: 'DeFi' },
  { id: 'nft', label: 'NFT' },
  { id: 'bridge', label: 'Bridge' },
  { id: 'infra', label: 'Infra' },
  { id: 'wall', label: 'Wall' },
]

type Tab = {
  id: string
  label: string
}
