# SPEC — Azzona API

## Arquitetura de Dados (Modelos)

### Dish (Prato)
| Campo       | Tipo         | Descrição                               |
|-------------|--------------|-----------------------------------------|
| id          | UUID         | PK                                      |
| name        | string(100)  | Nome do prato                           |
| description | text         | Descrição detalhada                     |
| price       | decimal(10,2)| Preço em MZN                            |
| category    | enum         | 'Grelhados','Mariscos','Cocktails',etc. |
| image_url   | string       | Caminho da imagem no storage            |
| available   | boolean      | true se estiver no menu atual           |
| created_at  | timestamp    |                                         |
| updated_at  | timestamp    |                                         |

### Reservation (Reserva)
| Campo          | Tipo         | Descrição                               |
|----------------|--------------|-----------------------------------------|
| id             | UUID         | PK                                      |
| customer_name  | string(100)  | Nome do cliente                         |
| customer_email | string(100)  | E-mail para confirmação                 |
| customer_phone | string(20)   | Telefone                                |
| date           | date         | Data da reserva                         |
| time           | time         | Horário                                 |
| guests         | integer      | Número de pessoas                       |
| status         | enum         | 'pending','confirmed','cancelled'       |
| notes          | text         | Observações opcionais                   |
| created_at     | timestamp    |                                         |

### Admin (Usuário administrativo)
| Campo          | Tipo         | Descrição                               |
|----------------|--------------|-----------------------------------------|
| id             | UUID         | PK                                      |
| username       | string(50)   | Único                                   |
| password_hash  | string       | Hash bcrypt                             |
| created_at     | timestamp    |                                         |

## API Endpoints

### Público
| Método | Rota                    | Descrição                                    | Status Codes |
|--------|-------------------------|----------------------------------------------|--------------|
| GET    | /api/dishes             | Lista pratos disponíveis (filtro opcional)   | 200, 500     |
| POST   | /api/reservations       | Cria uma nova reserva                        | 201, 400, 429, 500 |
| GET    | /api/contact            | Retorna informações de contato               | 200          |

### Administrativo (Requer autenticação JWT)
| Método | Rota                    | Descrição                                    | Status Codes |
|--------|-------------------------|----------------------------------------------|--------------|
| POST   | /api/admin/login        | Autentica admin, retorna token JWT           | 200, 401, 429 |
| GET    | /api/admin/dishes       | Lista todos os pratos (inclui indisponíveis) | 200, 401, 403 |
| POST   | /api/admin/dishes       | Cria novo prato                              | 201, 400, 401 |
| PUT    | /api/admin/dishes/:id   | Atualiza prato existente                     | 200, 400, 401, 404 |
| DELETE | /api/admin/dishes/:id   | Remove prato (soft delete ou hard)           | 204, 401, 404 |
| GET    | /api/admin/reservations | Lista todas as reservas (com filtros)        | 200, 401      |
| PUT    | /api/admin/reservations/:id | Atualiza status da reserva               | 200, 400, 401, 404 |

## Caminhos Infelizes (Edge Cases)
- **POST /reservations:** Se data/hora já estiverem lotadas (capacidade definida em variável de ambiente), retornar **409 Conflict** com mensagem genérica.
- **Login:** Em caso de credenciais inválidas, retornar **401 Unauthorized** sem especificar se usuário existe.
- **Rate Limiting:** Endpoints de reserva e login limitados a 10 requisições por IP a cada 15 minutos (resposta **429 Too Many Requests**).
- **Validação de imagem:** Upload deve validar MIME type (image/jpeg, image/png) e tamanho máximo (2MB).

## Critérios de Aceite
- [ ] O menu público exibe apenas pratos com `available = true`.
- [ ] Reservas só podem ser feitas para datas futuras e dentro do horário de funcionamento.
- [ ] Painel admin só é acessível com token JWT válido.
- [ ] Senhas são armazenadas com bcrypt (custo 12).
- [ ] Queries usam parâmetros preparados (ORM/Query Builder).

## Requisitos de Segurança Específicos
- **Autorização:** Middleware verifica se token pertence a um admin válido.
- **Uploads:** Armazenar em `/uploads` fora do webroot ou usar serviço de cloud (S3/Railway Volume) com nomes aleatórios.
- **CORS:** Restrito ao domínio do frontend.
- **Headers de Segurança:** Helmet.js configurado.