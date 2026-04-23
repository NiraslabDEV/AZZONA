const request = require('supertest');
const app = require('../src/app');

describe('Security - Rate Limiting', () => {
  test('login invalido retorna 401', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'senha_errada' });
    expect(res.status).toBe(401);
  });
});

describe('Security - Upload Validation', () => {
  let token = '';
  beforeAll(async () => {
    const res = await request(app).post('/api/admin/login').send({ username: 'admin', password: 'azzona2026' });
    token = res.body.token;
  });
  test('upload de texto e rejeitado (400)', async () => {
    const fakeFile = Buffer.from('Texto simples sem magic bytes de imagem.');
    const res = await request(app).post('/api/admin/events')
      .set('Authorization', 'Bearer ' + token)
      .field('dj_name', 'Test DJ').field('date', '2026-12-31')
      .attach('image', fakeFile, { filename: 'fake.jpg', contentType: 'image/jpeg' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/tipo de arquivo/i);
  });
  test('upload sem auth devolve 401', async () => {
    const res = await request(app).post('/api/admin/events').field('dj_name', 'DJ').field('date', '2026-12-31');
    expect(res.status).toBe(401);
  });
  test('evento sem imagem cria com sucesso (201)', async () => {
    const res = await request(app).post('/api/admin/events')
      .set('Authorization', 'Bearer ' + token)
      .send({ dj_name: 'Black Coffee', date: '2026-11-07' });
    expect(res.status).toBe(201);
    expect(res.body.image_url).toBeNull();
  });
});

describe('Security - HTTP Headers', () => {
  test('X-Content-Type-Options nosniff presente', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
  test('X-Frame-Options presente', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-frame-options']).toBeDefined();
  });
});

describe('Security - IDOR Protection', () => {
  test('reserva sem token retorna 401', async () => {
    const res = await request(app).put('/api/admin/reservations/id').send({ status: 'confirmed' });
    expect(res.status).toBe(401);
  });
  test('settings sem token retorna 401', async () => {
    const res = await request(app).get('/api/admin/settings');
    expect(res.status).toBe(401);
  });
  test('customers sem token retorna 401', async () => {
    const res = await request(app).get('/api/admin/customers/search?phone=84000000');
    expect(res.status).toBe(401);
  });
  test('chave de setting invalida retorna 400', async () => {
    const lr = await request(app).post('/api/admin/login').send({ username: 'admin', password: 'azzona2026' });
    const t = lr.body.token;
    const res = await request(app).put('/api/admin/settings/admin_password')
      .set('Authorization', 'Bearer ' + t).send({ value: 'hacked' });
    expect(res.status).toBe(400);
  });
});