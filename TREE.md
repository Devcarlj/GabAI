```mermaid
graph LR
    A[Client] -->|Requests| B(Server)
    B -->|Queries| C[(Database)]
    C -->|Returns Data| B
    B -->|Responds| A
```
