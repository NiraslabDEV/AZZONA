# DESIGN — Azzona

## Diagrama de Arquitetura (Mermaid)

```mermaid
graph TD
    A[Cliente Navegador] --> B[Frontend Estático - HTML/Tailwind/JS]
    B --> C{API REST - Express}
    C --> D[(PostgreSQL)]
    C --> E[Armazenamento de Imagens]
    F[Painel Admin - React (futuro)] --> C
    C --> G[Middleware de Autenticação JWT]
    C --> H[Rate Limiter]