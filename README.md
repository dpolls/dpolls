# nero-polls

* [Roadmap](#roadmap)
* [System Architecture](#system-architecture)
* [User Journey](#user-journey)
* [Prototype](#prototype)

## Roadmap

```mermaid
%% Roadmap Timeline (Gantt Chart)
gantt
    title SMART dPolls Roadmap
    dateFormat  YYYY-MM-DD
    axisFormat %b %d

    section Waves
    Wave 1 (Ideathon)          :a1, 2024-04-14, 14d
    Wave 2 (Foundation)        :a2, after a1, 14d
    Wave 3 (Core Features)     :a3, after a2, 14d
    Wave 4 (Enhancements)      :a4, after a3, 14d
    Wave 5 (Security & Control):a5, after a4, 14d
    Wave 6 (Polishing)         :a6, after a5, 14d
    Ending Ceremony            :milestone, 2024-07-13, 0d

    section Features
    Frontend Landing Page     :b1, 2024-04-28, 14d
    Poll Smart Contract       :b2, 2024-04-28, 28d
    Creating Polls            :b3, 2024-05-12, 14d
    Submitting Responses      :b4, 2024-05-12, 28d
    Viewing Results           :b5, 2024-05-26, 14d
    Modifying Polls           :b6, 2024-05-26, 28d
    Deactivating Polls        :b7, 2024-06-09, 14d
    Rewarding Users           :b8, 2024-06-09, 14d
```

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

## Prototype

https://www.figma.com/proto/5kgnPOEZCDkss8t60HpXC0/SMART-dPolls?node-id=218-354&p=f&t=891hx8VhFi0ch2L4-1&scaling=min-zoom&content-scaling=fixed&page-id=212%3A225&starting-point-node-id=218%3A242
