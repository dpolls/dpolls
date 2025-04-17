# nero-polls

```mermaid
graph TD
    A[User Wallet] --> B[Frontend (React App)]
    B --> C[RewardedPolls Smart Contract]
    C --> D[ERC20 Token Contract]
    C --> E[Ethereum Blockchain]
    B --> F[IPFS (optional for metadata)]
```