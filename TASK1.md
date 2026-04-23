markdown
# SPEC Completa: Azzona Dashboard & Spotify Integration

**Versão:** 1.0.0  
**Metodologia:** Akita+SDD (Security-First + Spec-Driven)  
**Objetivo:** Transformar o site estático Azzona em uma aplicação dinâmica com painel administrativo seguro e integração com Spotify (embed simples).

## 📋 Contexto Inicial

- **Projeto existente:** HTML estático (fornecido no arquivo `Azzona.html`) com CSS customizado e música sintetizada via Web Audio API.
- **Repositório GitHub:** https://github.com/NiraslabDEV/AZZONA
- **Stack definida pelo usuário:**
  - Frontend: HTML + Tailwind CSS + JavaScript (substituir CSS atual por Tailwind)
  - Backend: Node.js + Express
  - Banco de Dados: PostgreSQL
  - Deploy: Railway (CI/CD via GitHub Actions)
- **O que deve ser implementado:**
  1. Substituir player de música sintetizado por **embed simples do Spotify** (playlist elegante).
  2. Criar **Dashboard Interno** (rota `/admin`) protegido por login.
  3. Dashboard deve conter:
     - Visão geral de reservas do dia (cards com total de reservas e pessoas).
     - Tabela com lista de reservas do dia.
     - Calendário de reservas (visualização semanal/mensal) com ações de confirmar/cancelar.
     - Gerenciamento de DJ da Semana (upload de imagem, data, nome) que atualiza a seção de DJs do site público.
     - Ações rápidas: "Fechar o Dia" (bloquear novas reservas) e "Mensagem de Ausência".
     - Histórico de clientes (CRM leve) ao digitar telefone no formulário de reserva.
  4. **Segurança Avançada (obrigatório):**
     - Autenticação com bcrypt e JWT (ou sessão segura).
     - Proteção contra IDOR em todas as rotas administrativas.
     - Rate limiting severo no login (5 tentativas/IP/15min).
     - Upload de imagem com validação de magic bytes e renomeação segura (UUID).
     - Queries parametrizadas (ORM Sequelize) e Row Level Security (opcional no PostgreSQL).
  5. **Deploy no Railway** com CI/CD via GitHub Actions.

---

## 🔧 FASE 0 — Stack Discovery (Já Resolvida)

- Linguagem/Framework: **Node.js + Express**
- Banco de Dados: **PostgreSQL**
- Autenticação: **JWT + bcrypt**

---

## 📁 Estrutura de Diretórios Esperada
azzona/
├── backend/
│ ├── src/
│ │ ├── app.js
│ │ ├── server.js
│ │ ├── config/
│ │ │ └── database.js
│ │ ├── models/
│ │ │ ├── index.js
│ │ │ ├── Admin.js
│ │ │ ├── Reservation.js
│ │ │ ├── Dish.js (opcional para menu dinâmico)
│ │ │ └── Event.js (DJ da semana)
│ │ ├── controllers/
│ │ │ ├── adminController.js
│ │ │ ├── publicController.js
│ │ │ └── eventController.js
│ │ ├── routes/
│ │ │ ├── admin.js
│ │ │ └── public.js
│ │ ├── middleware/
│ │ │ ├── auth.js
│ │ │ ├── rateLimiter.js
│ │ │ ├── upload.js
│ │ │ └── errorHandler.js
│ │ ├── services/
│ │ │ └── reservationService.js
│ │ └── utils/
│ │ └── magicBytes.js
│ ├── tests/
│ │ ├── admin.test.js
│ │ └── security.test.js
│ ├── uploads/ (imagens dos DJs - fora do webroot público)
│ ├── .env.example
│ ├── package.json
│ └── Dockerfile
├── frontend/
│ ├── index.html (site público convertido para Tailwind)
│ ├── admin/
│ │ ├── login.html
│ │ └── dashboard.html
│ ├── css/
│ │ └── tailwind.css (compilado)
│ ├── js/
│ │ ├── api.js
│ │ ├── public.js
│ │ └── admin.js
│ └── assets/
├── .github/workflows/
│ └── deploy.yml
├── .gitignore
└── README.md

text

---

## 🧱 Modelos de Dados (Sequelize)

### Admin
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | PK |
| username | STRING(50) | Único |
| password_hash | STRING | Hash bcrypt |
| created_at | TIMESTAMP | |

### Reservation
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | PK |
| customer_name | STRING(100) | |
| customer_email | STRING(100) | |
| customer_phone | STRING(20) | |
| date | DATEONLY | |
| time | TIME | |
| guests | INTEGER | |
| status | ENUM | 'pending','confirmed','cancelled' |
| notes | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Event (DJ da Semana)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | PK |
| dj_name | STRING | |
| date | DATEONLY | Data do evento |
| image_url | STRING | Caminho relativo (ex: /uploads/uuid.jpg) |
| description | TEXT | |
| is_active | BOOLEAN | true = aparece no site público |
| created_at | TIMESTAMP | |

### Setting (Configurações)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| key | STRING | PK (ex: 'booking_closed') |
| value | JSON/STRING | Valor da configuração |

---

## 🔌 API Endpoints

### Público (sem autenticação)

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| POST | /api/reservations | Criar reserva (valida disponibilidade) | 201, 400, 409, 429 |
| GET | /api/events/active | Retorna eventos ativos (DJs) para exibir no site | 200 |
| GET | /api/settings/booking-status | Retorna se reservas estão abertas e mensagem | 200 |

### Admin (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/admin/login | Login (rate limit 5/15min) |
| GET | /api/admin/reservations/today | Reservas do dia + totais |
| GET | /api/admin/reservations | Lista com filtros (date, status) |
| PUT | /api/admin/reservations/:id | Atualizar status |
| POST | /api/admin/events | Criar evento (upload imagem) |
| GET | /api/admin/events | Listar eventos |
| PUT | /api/admin/events/:id | Atualizar evento |
| DELETE | /api/admin/events/:id | Remover evento |
| GET | /api/admin/settings | Listar configurações |
| PUT | /api/admin/settings/:key | Atualizar configuração |
| GET | /api/admin/customers/search?phone=... | Buscar cliente por telefone (histórico) |

---

## 🛡️ Requisitos de Segurança (Não Negociáveis)

### Autenticação
- Senha hasheada com `bcrypt` (custo 12).
- JWT assinado com segredo armazenado em variável de ambiente (`JWT_SECRET`), expira em 24h.
- Mensagens de erro de login **genéricas**: "Credenciais inválidas" (nunca revelar se usuário existe).

### Rate Limiting
- Middleware específico para `/api/admin/login`: **5 tentativas por IP a cada 15 minutos**.
- Middleware global: 100 requisições por IP a cada 15 minutos.

### Upload de Imagem (DJ)
- Usar `multer` com:
  - `fileFilter` baseado em **magic bytes** (não apenas extensão). Permitir `image/jpeg`, `image/png`, `image/webp`.
  - Limite de tamanho: 2 MB.
  - Renomear arquivo para `uuidv4().ext` e armazenar em `/backend/uploads`.
  - Servir arquivos via rota `/uploads/:filename` com cabeçalhos de segurança (`X-Content-Type-Options: nosniff`).

### Autorização (IDOR Protection)
- Em **todas** as rotas que acessam um recurso específico (ex: `PUT /api/admin/reservations/:id`), verificar se o usuário autenticado é admin (middleware `authMiddleware` já garante isso). Não confiar apenas no ID da URL.
- Para ações que alteram estado, usar transações atômicas.

### Validação de Input
- Todos os campos do corpo da requisição devem ser validados com biblioteca como `express-validator` ou `Joi`.
- Sanitização contra XSS (escapar saída no frontend também).

### Headers de Segurança
- Usar `helmet` no Express.

---

## 🎨 Frontend — Adaptações Necessárias

### 1. Substituir CSS Customizado por Tailwind CSS
- Incluir Tailwind via CDN ou build.
- Mapear classes existentes para utilitários Tailwind mantendo a identidade visual (dourado, preto, tipografia).
- Exemplo: `background: var(--dark)` → `bg-black`, `color: var(--gold)` → `text-yellow-600`.

### 2. Integração com Spotify (Embed Simples)
- Remover todo o código do sintetizador Web Audio API (funções `initAudio`, `kick`, `hihat`, etc.).
- Substituir o bloco do player (`.vinyl-spin` e botões) por um `<iframe>` do Spotify:
  ```html
  <iframe style="border-radius:12px" 
          src="https://open.spotify.com/embed/playlist/SUA_PLAYLIST_ID?utm_source=generator" 
          width="100%" height="152" frameBorder="0" 
          allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy">
  </iframe>
Escolher uma playlist elegante (sugestões: "Planet Wave House", "Electronic Lounge").

Manter a barra de música inferior removendo os controles de volume sintetizados.

3. Consumir API no Site Público
Reservas: Formulário existente deve enviar POST /api/reservations via fetch.

DJ da Semana: Buscar GET /api/events/active e renderizar cards dos DJs no lugar dos placeholders estáticos.

Status de reservas: Verificar GET /api/settings/booking-status para desabilitar formulário e exibir mensagem se booking_closed = true.

4. Páginas do Dashboard (/admin)
login.html
Formulário simples com username/password.

Em caso de erro 401, exibir mensagem genérica.

Redirecionar para dashboard.html após sucesso (armazenar token JWT no localStorage).

dashboard.html
Layout com sidebar e área principal.

Visão Geral (Hoje):

Cards: "Reservas Hoje: X" e "Pessoas Esperadas: Y".

Tabela de reservas do dia (colunas: Nome, Telefone, Horário, Pessoas, Status, Ações).

Ações: Confirmar (✓) e Cancelar (✗) — chamar PUT /api/admin/reservations/:id.

Calendário de Reservas:

Usar biblioteca como FullCalendar ou similar.

Exibir reservas como eventos.

Ao clicar, abrir modal para confirmar/cancelar.

Gerenciar DJ:

Formulário com campos: Nome do DJ, Data, Descrição, Upload de Imagem.

Lista de eventos futuros com opção de editar/excluir.

Configurações Rápidas:

Toggle "Fechar o Dia" (atualiza setting booking_closed).

Campo de texto "Mensagem de Ausência" (setting absence_message).

5. Histórico de Clientes no Formulário de Reserva (Frontend Público)
No campo de telefone, ao digitar 9+ dígitos, fazer debounce e chamar GET /api/admin/customers/search?phone=....

Se encontrar cliente, exibir sugestão: "Cliente VIP, última visita em DD/MM".

🧪 Testes Automatizados (Devem Falhar Antes da Implementação)
Criar testes com Jest e Supertest.

backend/tests/admin.test.js
javascript
const request = require('supertest');
const app = require('../src/app');
const { sequelize, Admin, Reservation } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Admin.create({ username: 'admin', password: 'admin123' }); // hash automático
});

describe('Admin Security', () => {
  test('Login falha com credenciais erradas (401 genérico)', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/credenciais inválidas/i);
  });

  test('Rate limit bloqueia após 5 falhas', async () => {
    for (let i = 0; i < 6; i++) {
      const res = await request(app)
        .post('/api/admin/login')
        .send({ username: 'x', password: 'x' });
      if (i < 5) expect(res.status).toBe(401);
      else expect(res.status).toBe(429);
    }
  });

  test('Acesso a rota protegida sem token retorna 401', async () => {
    const res = await request(app).get('/api/admin/reservations');
    expect(res.status).toBe(401);
  });

  test('Upload de imagem inválida (não-JPEG) é rejeitado', async () => {
    const agent = request.agent(app);
    // Primeiro faz login para obter token
    const loginRes = await agent
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'admin123' });
    const token = loginRes.body.token;

    const res = await agent
      .post('/api/admin/events')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', Buffer.from('fake'), 'test.txt');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/tipo de arquivo inválido/i);
  });
});
🚀 Deploy no Railway
Dockerfile (backend)
dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
EXPOSE 3000
CMD ["node", "src/server.js"]
Variáveis de Ambiente (Railway)
text
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=um_segredo_muito_longo_e_aleatorio
FRONTEND_URL=https://azzona.railway.app
GitHub Actions (.github/workflows/deploy.yml)
yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: cd backend && npm ci
      - run: cd backend && npm test
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: "azzona-backend"
✅ Plano de Execução (para o Agente Claude Code)
Analisar o HTML existente para entender a estrutura.

Inicializar projeto backend (npm init, instalar dependências listadas).

Configurar Sequelize e criar modelos.

Implementar middlewares de segurança (auth, rate limit, upload).

Criar rotas públicas e administrativas conforme especificação.

Converter frontend para Tailwind (reescrever classes CSS).

Substituir sintetizador por iframe do Spotify.

Construir páginas do dashboard (login.html, dashboard.html) com JavaScript para consumir API.

Escrever testes automatizados e garantir que falhem inicialmente.

Implementar código até que todos os testes passem.

Configurar Dockerfile e GitHub Actions.

Realizar deploy no Railway.

📌 Notas Finais
Nunca pular testes. A fase de testes (RED) deve preceder a implementação.

Sempre pensar como atacante. Validar todos os inputs, proteger rotas, sanitizar saídas.

Justificar decisões de design nos comentários do código.

Após implementação, rodar auditoria de segurança (Fase Extra do Akita).

Este documento é o contrato técnico completo. O agente deve segui-lo à risca, sem desvios.

text

---

Agora você tem um arquivo detalhado que pode ser usado com o Claude Code ou qualquer outro agente compatível. Ele contém todas as instruções necessárias para construir o sistema exatamente como você deseja, com segurança e boas práticas.
