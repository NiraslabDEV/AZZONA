
---

## `TASKS.md` (Backlog de Implementação)

```markdown
# TASKS — Sprint 1

## 1. Setup Inicial
- [ ] Inicializar projeto Node.js + Express
- [ ] Configurar ESLint + Prettier
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Criar estrutura de pastas

## 2. Banco de Dados
- [ ] Criar migrations para tabelas `dishes`, `reservations`, `admins`
- [ ] Configurar conexão PostgreSQL (usando `pg` ou Prisma)

## 3. API Pública
- [ ] `GET /api/dishes` com filtros
- [ ] `POST /api/reservations` com validações

## 4. Autenticação Admin
- [ ] Criar seed para primeiro admin
- [ ] `POST /api/admin/login` (retorna JWT)
- [ ] Middleware `authMiddleware` para verificar token

## 5. CRUD Admin de Pratos
- [ ] `GET /api/admin/dishes`
- [ ] `POST /api/admin/dishes` com upload de imagem
- [ ] `PUT /api/admin/dishes/:id`
- [ ] `DELETE /api/admin/dishes/:id`

## 6. Gerenciamento de Reservas Admin
- [ ] `GET /api/admin/reservations`
- [ ] `PUT /api/admin/reservations/:id` (status)

## 7. Frontend (Adaptação do HTML)
- [ ] Substituir CSS por Tailwind (via CDN ou build)
- [ ] Criar `menu.js` para carregar pratos da API e renderizar cards
- [ ] Implementar formulário de reserva com `fetch` POST

## 8. Segurança e Testes
- [ ] Configurar Helmet, CORS, Rate Limit
- [ ] Testes de integração (Jest/Supertest) cobrindo casos de segurança (IDOR, XSS, SQLi)
- [ ] Configurar CI no GitHub Actions para rodar testes

## 9. Deploy
- [ ] Criar `Dockerfile` e `railway.json` (ou usar Nixpacks)
- [ ] Configurar deploy automático no Railway a partir do GitHub
- [ ] Configurar variáveis de ambiente no Railway

## Dependências
- Tarefa 5 depende da 3 e 4.
- Tarefa 7 depende da 3.