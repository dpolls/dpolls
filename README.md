---
description: Official Documentation for NERO Decentralized Polls
icon: hand-wave
---

# Nero dPolls

Link to official documentation: [https://blurtopian.gitbook.io/dpolls](https://blurtopian.gitbook.io/dpolls)



* [Roadmap](./#roadmap)
* [System Architecture](./#system-architecture)
* [User Journey](./#user-journey)
* [Prototype](./#prototype)

## Roadmap

Moved to https://github.com/eastmaels/nero-polls-dapp/tree/main

## Live Demo

https://dpolls.vercel.app/

## System Architecture

![SMART dPolls System Architecture](https://github.com/user-attachments/assets/a40c31c7-fc07-4af2-9641-75cb2eb0f7f8)

## User Journey

```mermaid
flowchart TD
    A[Start] --> B[Create Poll]
    B --> B1[Add Title/Options]
    B1 --> B2[Configure Settings]
    B2 --> B3{Publish?}
    B3 -->|Yes| C[AA Payment]
    B3 -->|No| D[Save Draft]

    C --> E[User Submits Response]
    E --> E1[AA Payment]
    E1 --> F[View Results]
    F --> G[Share Results]

    C --> H[Modify Poll]
    H --> H1[Edit Title/Options]
    H1 --> H2[Update Poll]

    C --> I[Deactivate Poll]
    I --> I1[Confirm Closure]
    I1 --> J[Poll Archived]
```


