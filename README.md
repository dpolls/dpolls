# nero-polls

## System Architecture

![SMART dPolls System Architecture](https://github.com/user-attachments/assets/a40c31c7-fc07-4af2-9641-75cb2eb0f7f8)

## User Flow

```mermaid
graph TD
    A[User Wallet] --> B[Frontend]
    B --> C[Rewarded Polls Smart Contract]
    C --> D[ERC20 Token Contract]
    C --> E[Ethereum Blockchain]
    B --> F[IPFS]
```
