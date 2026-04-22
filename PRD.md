# PRD — Azzona Digital

## Problema
O site atual é estático. A equipe precisa:
- Atualizar o menu sem depender de desenvolvedor
- Gerenciar reservas de mesa
- Coletar contatos para newsletter

## User Stories
1. **Como gestor do restaurante**, quero fazer login em uma área segura para adicionar/editar pratos do menu, para manter o site sempre atualizado.
2. **Como cliente**, quero ver o menu atualizado com fotos e preços, para decidir o que pedir.
3. **Como cliente**, quero preencher um formulário de reserva informando data, hora e número de pessoas, para garantir minha mesa.
4. **Como gestor**, quero visualizar as reservas pendentes e confirmá-las ou recusá-las, para organizar a ocupação.

## Escopo (MVP)
### Incluído
- Página pública com menu dinâmico (consumindo API)
- Formulário de reserva com validação
- Painel administrativo (login) para CRUD de pratos e visualização de reservas

### Fora do Escopo (v1)
- Pagamento online
- Integração com sistemas de entrega
- Multi-idioma