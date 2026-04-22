# AZZONA — Sistema Web do Restaurante

## Visão Geral
Transformação do site estático Azzona em uma plataforma dinâmica com:
- Gerenciamento de menu (pratos, categorias)
- Sistema de reservas
- Painel administrativo seguro
- API para futuras integrações (Instagram, Facebook)

## Stack Tecnológica (Definida)
- **Frontend:** HTML5 + Tailwind CSS + JavaScript (futuro React)
- **Backend:** Node.js + Express
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT (acesso admin) + bcrypt para hash de senha
- **Deploy:** Railway (CI/CD via GitHub Actions)

## Decisões Arquiteturais (Trade-offs)
1. **Backend em Node.js:** Equipe familiarizada com JavaScript, excelente ecossistema para APIs REST.
2. **PostgreSQL:** Transações ACID essenciais para reservas; suporte a Row Level Security (RLS).
3. **JWT para Admin:** Sem estado, fácil de escalar horizontalmente.
4. **Tailwind CSS:** Adoção conforme solicitado, substituindo CSS customizado do HTML atual.

## Estrutura de Diretórios (Proposta)
azzona/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middleware/
│ │ ├── services/
│ │ └── utils/
│ ├── tests/
│ ├── .env.example
│ └── package.json
├── frontend/ (inicialmente arquivos estáticos)
│ ├── index.html
│ ├── css/
│ ├── js/
│ └── assets/
├── .github/workflows/
├── docker-compose.yml (opcional)
└── README.md


Padrões Utilizados
Repository Pattern (opcional): Para isolar lógica de acesso a dados.

Service Layer: Lógica de negócio (ex: verificar disponibilidade de mesa) reside em services, não em controllers.

Middleware de Erro Centralizado: Captura exceções e retorna respostas padronizadas.

Estratégia de Autenticação
JWT assinado com segredo em variável de ambiente (JWT_SECRET).

Expiração do token: 24h.

Refresh token não implementado no MVP.

Frontend (Implementação Tailwind)
Converter CSS customizado para classes Tailwind, mantendo a identidade visual.

Consumir API via fetch para carregar menu dinamicamente.

Formulário de reserva com validação client-side (reforçada no backend).