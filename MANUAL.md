# AZZONA — Manual do Sistema
**Versão 1.0 · Abril 2026**

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
   - 3.5 Configurações Globais
4. [Fluxo de Trabalho Diário](#4-fluxo-de-trabalho-diário)
5. [Segurança e Privacidade](#5-segurança-e-privacidade)
6. [Credenciais de Demonstração](#6-credenciais-de-demonstração)

---

## 1. Visão Geral do Sistema

O **AZZONA** é uma plataforma web completa para gestão do restaurante, composta por dois módulos principais:

| Módulo | Público-alvo | Acesso |
|--------|-------------|--------|
| **Site Público** | Clientes do restaurante | Qualquer pessoa |
| **Painel Administrativo** | Staff e gestão | Credenciais seguras |

### O que o sistema permite fazer

- Receber e gerir **reservas de mesa** online, 24h por dia
- Publicar e actualizar o **menu** de pratos e bebidas
- Gerir as **noites de DJ** — agendamento, fotos e publicação
- Controlar a **música ambiente** em tempo real (via Spotify)
- Fechar reservas para noites específicas com **mensagem personalizada**
- Consultar um **registo de clientes** (histórico de visitas por telefone)

---

## 2. Site Público

O site é acessível em qualquer dispositivo — telemóvel, tablet ou computador — e foi desenhado para refletir a identidade visual do Azzona: tons escuros, dourado e tipografia elegante.

### 2.1 Navegação e Estrutura

A página divide-se nas seguintes secções, acessíveis pelo menu de navegação fixo no topo:

| Secção | Descrição |
|--------|-----------|
| **Início** | Hero com nome e slogan do restaurante |
| **Menu** | Pratos e bebidas organizados por categoria |
| **DJs** | Agenda de artistas convidados |
| **Reservas** | Formulário para marcar mesa |

O menu de navegação acompanha o scroll e indica a secção activa com um indicador dourado.

---

### 2.2 Secção Hero

A página abre com o nome **AZZONA** em destaque sobre uma imagem do espaço, com animações suaves de entrada. Um botão "Reserve a sua mesa" leva diretamente ao formulário.

**Efeito visual:** paralaxe leve na imagem de fundo ao fazer scroll.

---

### 2.3 Menu do Restaurante

O menu é carregado dinamicamente a partir da API. As categorias disponíveis são apresentadas como abas de seleção (ex: Entradas, Pratos Principais, Sobremesas, Bebidas).

**Cada prato mostra:**
- Nome do prato
- Descrição breve
- Preço em meticais (MT)

> O conteúdo do menu é gerido pela equipa e pode ser actualizado a qualquer momento sem necessidade de programação.

---

### 2.4 DJs Convidados

Esta secção apresenta os artistas agendados para as noites de sexta-feira do Azzona.

**Como funciona:**
1. O administrador agenda um DJ no painel (com foto, data e descrição)
2. Ao clicar "Publicar", o DJ aparece automaticamente nesta secção do site
3. Cada card mostra: foto do artista, nome, data da noite e descrição/género musical
4. Ao ocultar ou remover o evento, o card desaparece do site imediatamente

**Player Spotify:**
Logo abaixo dos cards de DJ existe um player embutido do Spotify. O administrador pode alterar o artista/playlist a qualquer momento pelo painel, e a música actualiza-se no site em tempo real.

---

### 2.5 Formulário de Reserva

O cliente preenche os seguintes campos para fazer uma reserva:

| Campo | Tipo | Obrigatório |
|-------|------|:-----------:|
| Nome completo | Texto | ✓ |
| Telefone | Número | ✓ |
| E-mail | E-mail | ✓ |
| Data | Data (calendário) | ✓ |
| Hora | Hora | ✓ |
| Número de pessoas | Número (1–20) | ✓ |
| Observações | Texto livre | — |

**Validação automática:**
- Todos os campos obrigatórios são verificados antes do envio
- A data tem de ser futura (não aceita datas passadas)
- O e-mail tem de ter formato válido
- O número de pessoas está limitado a 20 por reserva

**CRM integrado:** ao introduzir o número de telefone, o sistema verifica automaticamente se o cliente já visitou o restaurante e apresenta discretamente o nome e número de visitas anteriores — sem que o cliente veja. Esta informação é visível apenas na área de gestão.

**Após o envio:**
- O cliente recebe uma mensagem de confirmação no ecrã
- A reserva fica com estado **Pendente** até o staff confirmar
- Se as reservas estiverem fechadas, o cliente vê uma mensagem personalizada

---

### 2.6 Player Spotify (Barra Inferior)

Após o cliente descer 300 pixels na página, uma barra de música aparece suavemente na parte inferior do ecrã. Esta barra contém o player Spotify com a música seleccionada pelo administrador e acompanha o utilizador enquanto navega no site.

O cliente pode pausar, avançar e controlar o volume directamente nesta barra.

---

## 3. Painel Administrativo

O painel é acedido em `/admin` e requer autenticação com nome de utilizador e palavra-passe. É totalmente responsivo e funciona em telemóvel, tablet e computador.

### 3.1 Acesso e Login

**URL de acesso:** `[domínio-do-site]/admin/dashboard.html`

Existe um botão discreto no site público (ícone de cadeado, visível apenas com atenção) que leva directamente ao painel.

**Ecrã de login:**
- Campo de utilizador e palavra-passe
- Botão para mostrar/ocultar palavra-passe
- Protecção automática: após 5 tentativas incorrectas, o acesso fica bloqueado por 15 minutos
- Token de sessão com validade de 24 horas

Após login bem-sucedido, o sistema guarda a sessão. Ao fechar o browser, é necessário autenticar novamente.

---

### 3.2 Dashboard — Visão do Dia

É o ecrã principal após o login. Apresenta um resumo em tempo real do dia actual.

**Métricas visíveis no topo:**

| Indicador | O que mostra |
|-----------|-------------|
| **Reservas para Hoje** | Total de reservas no dia actual |
| **Total de Pessoas Esperadas** | Soma de todas as pessoas das reservas de hoje |
| **Pendentes de Confirmação** | Reservas ainda por confirmar |

**Tabela "Today's Roster":**

Lista todas as reservas de hoje com:
- Nome do cliente e observações especiais (alergias, aniversários, etc.)
- Contacto telefónico
- Hora marcada e número de pessoas
- Estado actual: `Pendente` / `Confirmada` / `Cancelada`
- Botões de acção: **✓ Confirmar** e **✕ Cancelar**

> Ao clicar Confirmar ou Cancelar, a alteração é instantânea — não é necessário recarregar a página.

**Botões de acção rápida (topo direito):**

- **💬 Mensagem de Ausência** — abre um campo de texto para publicar uma mensagem visível no site público (ex: "Esta noite temos evento privado.")
- **🔒 Fechar o Dia / Abrir Reservas** — bloqueia ou desbloqueia o formulário de reservas no site. Quando fechado, os clientes vêem a mensagem de ausência configurada.

---

### 3.3 Gestão de Reservas

Acedida pelo menu lateral → **Reservas**.

**Selector de data:**
- Barra com os próximos 7 dias para navegação rápida
- Selector de data para consultar qualquer outro dia

**Lista de reservas:**

Cada reserva é apresentada como um card individual com toda a informação do cliente. Os botões de acção estão disponíveis directamente em cada card.

**Painel lateral (filtros e resumo):**

| Elemento | Função |
|----------|--------|
| **Pessoas** | Total de pessoas esperadas para o dia seleccionado |
| **Pendentes** | Número de reservas por confirmar |
| **Filtros** | Mostrar todas / só confirmadas / só pendentes / só canceladas |

---

### 3.4 DJ & Events

Acedido pelo menu lateral → **DJ & Events**.

Esta secção permite gerir os artistas que aparecem na secção pública do site.

#### Agendar Novo Evento

Formulário com os seguintes campos:

| Campo | Descrição |
|-------|-----------|
| **DJ / Artist Name** | Nome do artista ou colectivo |
| **Event Date** | Data da noite (calendário) |
| **Genre / Atmosphere** | Estilo musical ou descrição da noite |
| **Promotional Image** | Foto do artista (PNG ou JPG, máx. 5MB) |

Ao clicar **Schedule Event**, o evento é guardado no sistema.

#### Gerir Eventos Agendados

A tabela "Scheduled Talent" lista todos os eventos com:
- Data da noite
- Miniatura da foto + nome do artista
- Descrição/género
- Estado: **Publicado** (verde) ou **Rascunho** (cinzento)
- Botões:
  - **Publicar** — torna o evento visível no site público
  - **Ocultar** — remove do site sem apagar o evento
  - **✕** — elimina o evento permanentemente (com confirmação)

> Um evento só aparece no site quando está no estado **Publicado**. Pode agendar com antecedência e publicar na altura certa.

#### Configurações Spotify

No painel lateral direito da secção DJ existe a área de controlo do Spotify:

1. Cole qualquer link do Spotify (artista, playlist, álbum)
2. O sistema converte automaticamente para formato de embed — uma pré-visualização do link gerado aparece a verde por baixo do campo
3. Clique **Aplicar no Site** — a música actualiza-se no site público imediatamente
4. O botão **Black Coffee** é um atalho rápido para o artista residente

**Links suportados:**
- `open.spotify.com/artist/...`
- `open.spotify.com/playlist/...`
- `open.spotify.com/album/...`
- Links com prefixo de idioma (`/intl-pt/`) são automaticamente corrigidos

---

### 3.5 Configurações Globais

Disponíveis tanto no **Dashboard** como na secção **DJ & Events**:

#### Fechar/Abrir Reservas

Toggle que bloqueia imediatamente o formulário de reservas no site público.

- **Aberto** (padrão): clientes podem fazer reservas normalmente
- **Fechado**: o formulário fica desactivado e aparece a mensagem de ausência

Útil para:
- Noites com evento privado
- Encerramento temporário
- Gestão de capacidade em noites de grande procura

#### Mensagem de Ausência

Texto livre que aparece no site quando as reservas estão fechadas. Exemplos de uso:
- *"Esta sexta-feira temos evento privado. Reservas abertas a partir de sábado."*
- *"Estamos de férias de 1 a 15 de agosto. Obrigado pela compreensão."*

---

## 4. Fluxo de Trabalho Diário

### Manhã (preparação)

1. Entrar no painel → **Dashboard**
2. Verificar reservas do dia na tabela "Today's Roster"
3. Confirmar as reservas pendentes clicando **✓ Confirmar**
4. Se necessário, contactar clientes com reservas sem confirmação

### Tarde (actualização)

1. Se houver alguma alteração de última hora → usar **Mensagem de Ausência**
2. Verificar se há novas reservas (clicar **↺ Actualizar**)
3. Confirmar ou cancelar conforme disponibilidade

### Noite de DJ (publicação)

1. Ir a **DJ & Events**
2. Verificar que o evento da noite está com estado **Publicado**
3. Actualizar o Spotify para a playlist/artista da noite
4. O site reflecte as alterações imediatamente

### Fim da noite

1. Se quiser bloquear reservas para o dia seguinte → activar **Fechar o Dia**
2. Escrever mensagem de ausência adequada
3. Logout (o token expira automaticamente ao fim de 24h)

---

## 5. Segurança e Privacidade

### Protecção do painel

| Mecanismo | Detalhe |
|-----------|---------|
| **Autenticação JWT** | Token seguro com expiração de 24h |
| **Palavra-passe cifrada** | Armazenada com bcrypt (padrão bancário) |
| **Rate limiting no login** | Bloqueio após 5 tentativas erradas / 15 minutos |
| **Rate limiting global** | Máximo 100 pedidos por IP em 15 minutos |
| **Headers de segurança** | Helmet.js — protecção contra XSS, clickjacking, etc. |

### Upload de imagens

As imagens de DJ são validadas por **magic bytes** — o sistema lê os bytes iniciais do ficheiro e rejeita qualquer ficheiro que não seja JPEG, PNG ou WebP, independentemente da extensão indicada. Isto impede o upload de ficheiros maliciosos disfarçados de imagens.

### Dados dos clientes

- Os dados das reservas (nome, telefone, e-mail) ficam guardados em memória durante a sessão do servidor
- Em produção, serão migrados para base de dados PostgreSQL com encriptação
- O CRM público (lookup por telefone) devolve apenas nome e número de visitas — nunca o e-mail ou outros dados sensíveis

---

## 6. Credenciais de Demonstração

> ⚠️ Estas credenciais são apenas para demonstração. Devem ser alteradas antes da entrada em produção.

| Campo | Valor |
|-------|-------|
| **Utilizador** | `admin` |
| **Palavra-passe** | `azzona2026` |
| **URL do painel** | `/admin/dashboard.html` |

---

## Notas Técnicas (para referência)

| Componente | Tecnologia |
|------------|-----------|
| Frontend | HTML5 + Tailwind CSS + JavaScript |
| Painel admin | React 18 (sem build step) |
| Backend | Node.js + Express |
| Autenticação | JWT + bcrypt |
| Base de dados (Sprint 2) | PostgreSQL |
| Deploy | Railway (CI/CD via GitHub Actions) |
| Testes | Jest + Supertest (25 testes automatizados) |

---

*Manual produzido por Niras Lab · niraslab.dev@gmail.com*
*Azzona Restaurant System · Polana District, Maputo*
