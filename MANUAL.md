# AZZONA — Manual do Sistema
**Versão 2.0 · Abril 2026**

---

## Índice

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Site Público](#2-site-público)
   - 2.1 Navegação e Estrutura
   - 2.2 Secção Hero
   - 2.3 Menu do Restaurante
   - 2.4 DJs Convidados
   - 2.5 Formulário de Reserva
   - 2.6 Player Spotify
3. [Painel Administrativo](#3-painel-administrativo)
   - 3.1 Acesso e Login
   - 3.2 Dashboard — Visão do Dia
   - 3.3 Gestão de Reservas
   - 3.4 DJ & Events
   - 3.5 Cardápio
   - 3.6 Configurações Globais
4. [Emails Automáticos](#4-emails-automáticos)
5. [Fluxo de Trabalho Diário](#5-fluxo-de-trabalho-diário)
6. [Segurança e Privacidade](#6-segurança-e-privacidade)
7. [Credenciais de Demonstração](#7-credenciais-de-demonstração)
8. [Configuração Técnica](#8-configuração-técnica)

---

## 1. Visão Geral do Sistema

O **AZZONA** é uma plataforma web completa para gestão do restaurante, composta por dois módulos principais:

| Módulo | Público-alvo | Acesso |
|--------|-------------|--------|
| **Site Público** | Clientes do restaurante | Qualquer pessoa |
| **Painel Administrativo** | Staff e gestão | Credenciais seguras |

### O que o sistema permite fazer

- Receber e gerir **reservas de mesa** online, 24h por dia
- Enviar **emails automáticos** ao dono (nova reserva) e ao cliente (confirmação)
- Publicar e actualizar o **cardápio** de pratos em tempo real, sem programação
- Gerir as **noites de DJ** — agendamento, fotos e publicação
- Controlar a **música ambiente** em tempo real via Spotify
- Fechar reservas para noites específicas com mensagem personalizada
- Consultar um **registo de clientes** com histórico de visitas por telefone

---

## 2. Site Público

O site é acessível em qualquer dispositivo — telemóvel, tablet ou computador — e foi desenhado para refletir a identidade visual do Azzona: tons escuros, dourado e tipografia elegante.

### 2.1 Navegação e Estrutura

A página divide-se nas seguintes secções, acessíveis pelo menu de navegação fixo no topo:

| Secção | Descrição |
|--------|-----------|
| **Início** | Hero com nome e slogan do restaurante |
| **Menu** | Pratos e bebidas organizados por categoria |
| **DJs** | Agenda de artistas convidados com fotos |
| **Reservas** | Formulário para marcar mesa |

O menu de navegação acompanha o scroll e indica a secção activa com um indicador dourado.

---

### 2.2 Secção Hero

A página abre com o nome **AZZONA** em destaque sobre uma imagem do espaço, com animações suaves de entrada. Um botão "Reserve a sua mesa" leva diretamente ao formulário.

---

### 2.3 Menu do Restaurante

O menu é carregado dinamicamente a partir da API — o conteúdo reflecte sempre o que foi configurado no painel administrativo. As categorias disponíveis são apresentadas como abas de seleção.

**Categorias suportadas:** Grelhados, Mariscos, Internacional, Comfort Food, Breakfood, Cocktails

**Cada prato mostra:**
- Fotografia do prato
- Nome
- Descrição breve
- Preço em meticais (MT)

> Quando um prato é marcado como **indisponível** no painel, desaparece automaticamente do site. Não é necessário apagar — basta desactivar.

---

### 2.4 DJs Convidados

Esta secção apresenta os artistas agendados para as noites do Azzona.

**Como funciona:**
1. O administrador agenda um DJ no painel com foto, data e descrição
2. Ao clicar **Publicar**, o DJ aparece automaticamente nesta secção do site
3. Cada card mostra: foto do artista, nome, data da noite e género musical
4. Ao **Ocultar** ou remover o evento, o card desaparece imediatamente

**Player Spotify:** logo abaixo dos cards existe um player embutido do Spotify. O administrador pode alterar o artista ou playlist a qualquer momento pelo painel.

---

### 2.5 Formulário de Reserva

| Campo | Tipo | Obrigatório |
|-------|------|:-----------:|
| Nome completo | Texto | ✓ |
| Telefone | Número | ✓ |
| E-mail | E-mail | ✓ |
| Data | Calendário | ✓ |
| Hora | Hora | ✓ |
| Número de pessoas | Número (1–20) | ✓ |
| Observações | Texto livre | — |

**Validação automática:** todos os campos obrigatórios são verificados antes do envio. A data tem de ser futura. O e-mail tem de ter formato válido.

**CRM integrado:** ao introduzir o telefone, o sistema verifica automaticamente se o cliente já visitou o restaurante e apresenta o nome e número de visitas anteriores — visível apenas na área de gestão.

**Após o envio:**
- O cliente vê uma mensagem de confirmação no ecrã
- O **dono recebe um email** imediatamente com todos os detalhes da reserva
- A reserva fica com estado **Pendente** até o staff confirmar no painel
- Ao confirmar, o **cliente recebe um email de confirmação**

---

### 2.6 Player Spotify (Barra Inferior)

Após descer 300 pixels na página, uma barra de música aparece na parte inferior do ecrã com o player Spotify. Acompanha o utilizador durante toda a navegação.

---

## 3. Painel Administrativo

O painel é acedido em `/admin/dashboard.html` e requer autenticação. É totalmente responsivo e funciona em telemóvel, tablet e computador.

### 3.1 Acesso e Login

**URL:** `[domínio]/admin/dashboard.html`

Existe um botão discreto no site público (ícone de cadeado) que leva directamente ao painel.

- Campo de utilizador e palavra-passe
- Botão para mostrar/ocultar palavra-passe
- Bloqueio automático após 5 tentativas incorrectas (15 minutos)
- Sessão com validade de 24 horas

---

### 3.2 Dashboard — Visão do Dia

Ecrã principal após o login. Apresenta um resumo em tempo real do dia actual.

**Métricas no topo:**

| Indicador | O que mostra |
|-----------|-------------|
| **Reservas para Hoje** | Total de reservas no dia actual |
| **Total de Pessoas Esperadas** | Soma de pessoas de todas as reservas de hoje |
| **Pendentes de Confirmação** | Reservas ainda por confirmar |

**Tabela "Today's Roster":** lista todas as reservas de hoje com nome, contacto, hora, estado e botões de acção (Confirmar / Cancelar).

> Ao confirmar uma reserva, o cliente recebe automaticamente um email de confirmação.

**Botões de acção rápida:**
- **💬 Mensagem de Ausência** — publica uma mensagem no site público
- **🔒 Fechar o Dia / Abrir Reservas** — bloqueia ou desbloqueia o formulário de reservas

---

### 3.3 Gestão de Reservas

Menu lateral → **Reservas**

**Selector de data:** barra com os próximos 7 dias + selector para qualquer outra data.

**Lista de reservas:** cada reserva como card individual com toda a informação do cliente. Botões de confirmar/cancelar directamente em cada card.

**Painel lateral:**

| Elemento | Função |
|----------|--------|
| **Pessoas** | Total de pessoas esperadas para o dia |
| **Pendentes** | Reservas por confirmar |
| **Filtros** | Todas / Confirmadas / Pendentes / Canceladas |

---

### 3.4 DJ & Events

Menu lateral → **DJ & Events**

#### Agendar Novo Evento

| Campo | Descrição |
|-------|-----------|
| **DJ / Artist Name** | Nome do artista ou colectivo |
| **Event Date** | Data da noite |
| **Genre / Atmosphere** | Estilo musical ou descrição |
| **Promotional Image** | Foto do artista (PNG, JPG ou WebP, máx. 5MB) |

#### Gerir Eventos

A tabela "Scheduled Talent" mostra todos os eventos com miniatura, nome, descrição, estado e acções:

| Botão | Acção |
|-------|-------|
| **Publicar** | Torna o evento visível no site público |
| **Ocultar** | Remove do site sem apagar |
| **✕** | Elimina permanentemente (com confirmação) |

#### Controlo Spotify

- Cole qualquer link do Spotify (artista, playlist, álbum)
- O sistema converte automaticamente para formato embed — preview a verde confirma a conversão
- **Aplicar no Site** actualiza a música imediatamente
- Links com prefixo de idioma (`/intl-pt/`) são corrigidos automaticamente

---

### 3.5 Cardápio

Menu lateral → **Cardápio ◈**

Gestão completa do menu do restaurante em tempo real — as alterações reflectem-se imediatamente no site público.

#### Lista de Pratos

Cada prato na lista mostra:
- Miniatura da fotografia
- Nome e descrição
- Categoria
- Preço em MT
- **Toggle disponível/indisponível** — desactivar oculta o prato do site sem o apagar
- Botões **Editar** e **✕** (remover com confirmação)

**Filtro por categoria:** abas no topo para filtrar por Grelhados, Mariscos, Internacional, etc.

**Contador no cabeçalho:** mostra o total de pratos e quantos estão disponíveis.

#### Adicionar Novo Prato

Clicar **+ Novo Prato** abre um formulário inline:

| Campo | Obrigatório |
|-------|:-----------:|
| Nome do prato | ✓ |
| Preço (MT) | ✓ |
| Categoria | ✓ |
| Descrição | — |
| URL da imagem | — |

> A URL da imagem pode ser um caminho local (`/img/foto.jpg`) ou uma URL externa. Uma pré-visualização aparece imediatamente ao introduzir o URL.

#### Editar Prato

Clicar **Editar** em qualquer prato abre o mesmo formulário preenchido. Após guardar, o site actualiza-se imediatamente.

#### Disponibilidade

O toggle em cada linha é o controlo principal do dia-a-dia:
- **Verde (ligado):** prato aparece no site
- **Cinzento (desligado):** prato oculto no site

Útil para pratos sazonais, esgotados ou temporariamente indisponíveis — sem precisar de apagar e recriar.

---

### 3.6 Configurações Globais

#### Fechar/Abrir Reservas

Toggle disponível no Dashboard e na secção DJ & Events. Bloqueia imediatamente o formulário de reservas no site.

Útil para:
- Noites com evento privado
- Encerramento temporário
- Gestão de capacidade máxima

#### Mensagem de Ausência

Texto que aparece no site quando as reservas estão fechadas:
- *"Esta sexta-feira temos evento privado. Reservas abertas a partir de sábado."*
- *"Estamos de férias de 1 a 15 de agosto."*

---

## 4. Emails Automáticos

O sistema envia emails automáticos em dois momentos sem qualquer acção manual do staff.

### Email ao Dono — Nova Reserva

**Quando:** imediatamente após o cliente submeter o formulário de reserva.

**Destinatário:** endereço configurado em `OWNER_EMAIL`

**Conteúdo:**
- Nome do cliente
- Data e hora da reserva (em destaque)
- Número de pessoas
- Telefone e e-mail do cliente
- Observações especiais (alergias, aniversários, etc.)
- Alerta de estado "Pendente"

**Design:** email HTML com a identidade visual do Azzona — fundo escuro, dourado, tipografia elegante.

---

### Email ao Cliente — Confirmação

**Quando:** imediatamente após o administrador clicar **✓ Confirmar** no painel.

**Destinatário:** e-mail fornecido pelo cliente no formulário.

**Conteúdo:**
- Confirmação em destaque (✓ Reserva Confirmada)
- Data e hora
- Número de pessoas
- Observações confirmadas
- Morada e horário do restaurante

**Design:** email HTML com as mesmas cores e tipografia do site.

---

### Configuração dos Emails

Para activar os emails, o responsável técnico configura as seguintes variáveis no servidor:

| Variável | Descrição |
|----------|-----------|
| `EMAIL_HOST` | Servidor SMTP (ex: `smtp.gmail.com`) |
| `EMAIL_PORT` | Porta SMTP (ex: `587`) |
| `EMAIL_USER` | Endereço de email do remetente |
| `EMAIL_PASS` | Palavra-passe de aplicação |
| `EMAIL_FROM` | Nome e email que aparece no "De:" |
| `OWNER_EMAIL` | Email do dono/gestor que recebe as notificações |

> **Gmail:** activar "Palavras-passe de aplicação" em myaccount.google.com/security para obter a senha de 16 caracteres a usar em `EMAIL_PASS`.

> **Sem configuração:** o sistema funciona normalmente sem emails — as variáveis são opcionais. Os emails simplesmente não são enviados e aparece um aviso no log do servidor.

---

## 5. Fluxo de Trabalho Diário

### Manhã (preparação)

1. Entrar no painel → **Dashboard**
2. Verificar reservas do dia na tabela "Today's Roster"
3. Confirmar as reservas pendentes → **cliente recebe email automaticamente**
4. Se necessário, cancelar reservas e contactar clientes

### Durante o dia

1. Verificar se chegaram novas reservas (clicar **↺ Actualizar**)
2. Confirmar as novas entradas
3. Se algum prato acabou ou ficou indisponível → **Cardápio** → toggle para desactivar

### Actualizar o Cardápio

1. Ir a **Cardápio ◈** no menu lateral
2. Para desactivar um prato: clicar o toggle → desaparece do site imediatamente
3. Para editar preço ou descrição: clicar **Editar** → alterar → **Guardar Alterações**
4. Para adicionar novo prato: clicar **+ Novo Prato** → preencher → **Adicionar ao Cardápio**

### Noite de DJ (publicação)

1. Ir a **DJ & Events**
2. Verificar que o evento da noite está **Publicado**
3. Actualizar o Spotify para a playlist da noite
4. O site actualiza-se sem necessidade de recarregar

### Encerramento

1. Activar **Fechar o Dia** para bloquear novas reservas
2. Escrever mensagem de ausência adequada
3. Logout (sessão expira automaticamente em 24h)

---

## 6. Segurança e Privacidade

### Protecção do painel

| Mecanismo | Detalhe |
|-----------|---------|
| **Autenticação JWT** | Token seguro com expiração de 24h |
| **Palavra-passe cifrada** | bcrypt com custo 12 (padrão bancário) |
| **Rate limiting — login** | Bloqueio após 5 tentativas / 15 minutos |
| **Rate limiting — API global** | Máximo 100 pedidos por IP em 15 minutos |
| **Headers de segurança** | Helmet.js — protecção XSS, clickjacking, MIME sniffing |

### Upload de imagens

As imagens de DJ são validadas por **magic bytes** — o sistema lê os bytes iniciais do ficheiro e rejeita qualquer ficheiro que não seja JPEG, PNG ou WebP, independentemente da extensão indicada. Impede uploads maliciosos disfarçados de imagens.

### Emails

- Os emails são enviados de forma assíncrona — não bloqueiam nem atrasam a resposta ao cliente
- Falhas de envio ficam registadas no log do servidor mas não afectam o funcionamento do sistema
- As credenciais de email ficam em variáveis de ambiente, nunca no código

### Dados dos clientes

- Dados de reservas (nome, telefone, e-mail) guardados em memória durante a sessão
- Em produção: migração para PostgreSQL com encriptação em repouso
- O endpoint público de lookup por telefone devolve apenas nome e número de visitas — nunca e-mail ou outros dados sensíveis

---

## 7. Credenciais de Demonstração

> ⚠️ Alterar antes da entrada em produção.

| Campo | Valor |
|-------|-------|
| **Utilizador** | `admin` |
| **Palavra-passe** | `azzona2026` |
| **URL do painel** | `/admin/dashboard.html` |

---

## 8. Configuração Técnica

### Stack

| Componente | Tecnologia |
|------------|-----------|
| Frontend (site público) | HTML5 + Tailwind CSS + JavaScript |
| Painel administrativo | React 18 (sem build step, Babel standalone) |
| Backend | Node.js + Express |
| Autenticação | JWT + bcrypt |
| Emails | Nodemailer (SMTP) |
| Upload de imagens | Multer + validação magic bytes |
| Base de dados (Sprint 2) | PostgreSQL |
| Deploy | Railway (CI/CD via GitHub Actions) |
| Testes automatizados | Jest + Supertest — 25 testes |

### Variáveis de Ambiente

```env
# Servidor
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://azzona.co.mz

# Segurança
JWT_SECRET=chave_secreta_forte_aqui
JWT_EXPIRES_IN=24h

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=reservas@azzona.co.mz
EMAIL_PASS=senha_de_aplicacao
EMAIL_FROM=Azzona Reservas <reservas@azzona.co.mz>
OWNER_EMAIL=gestao@azzona.co.mz

# Base de dados (Sprint 2)
DATABASE_URL=postgresql://user:pass@host:5432/azzona
```

### Endpoints da API

#### Públicos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/dishes` | Lista pratos disponíveis |
| GET | `/api/dishes?category=Grelhados` | Filtra por categoria |
| POST | `/api/reservations` | Criar reserva |
| GET | `/api/reservations/booking-status` | Estado das reservas + URL Spotify |
| GET | `/api/reservations/lookup?phone=` | CRM público (dados mínimos) |
| GET | `/api/events/active` | DJs activos para o site |

#### Administrativos (requerem token JWT)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/admin/login` | Autenticação |
| GET | `/api/admin/reservations` | Listar reservas (filtros: date, status) |
| GET | `/api/admin/reservations/today` | Resumo do dia |
| PUT | `/api/admin/reservations/:id` | Alterar estado da reserva |
| GET | `/api/admin/settings` | Ler configurações |
| PUT | `/api/admin/settings/:key` | Alterar configuração |
| GET | `/api/admin/dishes` | Listar todos os pratos |
| POST | `/api/admin/dishes` | Adicionar prato |
| PUT | `/api/admin/dishes/:id` | Editar prato |
| DELETE | `/api/admin/dishes/:id` | Remover prato |
| GET | `/api/admin/events` | Listar eventos DJ |
| POST | `/api/admin/events` | Criar evento DJ (multipart) |
| PUT | `/api/admin/events/:id` | Editar evento DJ |
| DELETE | `/api/admin/events/:id` | Remover evento DJ |
| GET | `/api/admin/customers/search` | Pesquisa de clientes por telefone |

---

*Manual produzido por Niras Lab · niraslab.dev@gmail.com*
*Azzona Restaurant System v2.0 · Polana District, Maputo*
