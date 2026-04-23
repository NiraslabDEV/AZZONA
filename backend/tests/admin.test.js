const request = require('supertest');
const app = require('../src/app');

let token = '';

beforeAll(async () => {
  const res = await request(app)
    .post('/api/admin/login')
    .send({ username: 'admin', password: 'azzona2026' });
  token = res.body.token;
});

describe('Admin Auth', () => {
  test('login com credenciais correctas devolve token JWT', async () => {
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // header.payload.signature
  });

  test('login com password errada devolve 401 com mensagem genérica', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'wrong_password' });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/credenciais inválidas/i);
    expect(res.body.message).not.toMatch(/admin/i); // não revela se o user existe
  });

  test('login com username errado devolve 401 com mensagem genérica', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'hacker', password: 'azzona2026' });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/credenciais inválidas/i);
  });

  test('acesso a rota protegida sem token devolve 401', async () => {
    const res = await request(app).get('/api/admin/reservations');
    expect(res.status).toBe(401);
  });

  test('acesso a rota protegida com token inválido devolve 401', async () => {
    const res = await request(app)
      .get('/api/admin/reservations')
      .set('Authorization', 'Bearer token_falso_invalido');
    expect(res.status).toBe(401);
  });
});

describe('Admin Reservations', () => {
  test('GET /api/admin/reservations devolve array com token válido', async () => {
    const res = await request(app)
      .get('/api/admin/reservations')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/admin/reservations/today devolve total e totalGuests', async () => {
    const res = await request(app)
      .get('/api/admin/reservations/today')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('totalGuests');
    expect(res.body).toHaveProperty('reservations');
  });

  test('PUT /api/admin/reservations/:id com status inválido devolve 400', async () => {
    const res = await request(app)
      .put('/api/admin/reservations/id-nao-existe')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'invalid_status' });
    expect(res.status).toBe(400);
  });

  test('PUT /api/admin/reservations com ID inexistente devolve 404', async () => {
    const res = await request(app)
      .put('/api/admin/reservations/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'confirmed' });
    expect(res.status).toBe(404);
  });
});

describe('Admin Settings', () => {
  test('GET /api/admin/settings devolve configurações', async () => {
    const res = await request(app)
      .get('/api/admin/settings')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('booking_closed');
    expect(res.body).toHaveProperty('absence_message');
  });

  test('PUT /api/admin/settings/booking_closed altera o valor', async () => {
    const res = await request(app)
      .put('/api/admin/settings/booking_closed')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: true });
    expect(res.status).toBe(200);
    expect(res.body.value).toBe('true');

    // Reset
    await request(app)
      .put('/api/admin/settings/booking_closed')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: false });
  });

  test('PUT /api/admin/settings com chave inválida devolve 400', async () => {
    const res = await request(app)
      .put('/api/admin/settings/admin_password')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 'hacked' });
    expect(res.status).toBe(400);
  });
});

describe('Public API', () => {
  test('GET /api/reservations/booking-status devolve estado público', async () => {
    const res = await request(app).get('/api/reservations/booking-status');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('booking_closed');
  });

  test('POST /api/reservations com dados inválidos devolve 400', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({ customer_name: 'A' }); // campos a faltar
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('POST /api/reservations com dados válidos cria reserva', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().split('T')[0];

    const res = await request(app)
      .post('/api/reservations')
      .send({
        customer_name: 'Test User',
        customer_email: 'test@azzona.test',
        customer_phone: '+258 84 000 0000',
        date,
        time: '20:00',
        guests: 2,
        notes: 'Teste automatizado',
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.message).toBeDefined();
  });
});
