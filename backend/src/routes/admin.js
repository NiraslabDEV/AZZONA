const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const { reservations, settings } = require('../data/store');
const auth = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// In-memory events store (DJ events)
const events = [];

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiadas tentativas. Aguarde 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Hardcoded admin — Sprint 2 will use DB
const ADMIN_USERNAME = 'admin';
// bcrypt hash of 'azzona2026' with cost 12
const ADMIN_HASH = '$2a$12$oPP.cLtA.8NBcDXndtMi8.krDpxmNPrKl5l8UW7L7tPnRqagk9Uge';

// POST /api/admin/login
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const usernameMatch = username === ADMIN_USERNAME;
  // Always run bcrypt to avoid timing attacks
  const passwordMatch = await bcrypt.compare(
    password,
    usernameMatch ? ADMIN_HASH : '$2a$12$oPP.cLtA.8NBcDXndtMi8.krDpxmNPrKl5l8UW7L7tPnRqagk9Uge'
  );

  if (!usernameMatch || !passwordMatch) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign(
    { sub: ADMIN_USERNAME, role: 'admin' },
    process.env.JWT_SECRET || 'dev_secret_change_in_prod',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  res.json({ token });
});

// GET /api/admin/reservations
router.get('/reservations', auth, (req, res) => {
  const { date, status } = req.query;
  let result = [...reservations];
  if (date) result = result.filter(r => r.date === date);
  if (status) result = result.filter(r => r.status === status);
  result.sort((a, b) => a.time.localeCompare(b.time));
  res.json(result);
});

// GET /api/admin/reservations/today
router.get('/reservations/today', auth, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todayRes = reservations.filter(r => r.date === today);
  const totalGuests = todayRes.reduce((s, r) => s + r.guests, 0);
  res.json({ reservations: todayRes.sort((a, b) => a.time.localeCompare(b.time)), total: todayRes.length, totalGuests });
});

// PUT /api/admin/reservations/:id
router.put('/reservations/:id', auth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const allowed = ['pending', 'confirmed', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }
  const idx = reservations.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Reserva não encontrada.' });
  reservations[idx] = { ...reservations[idx], status, updated_at: new Date().toISOString() };
  res.json(reservations[idx]);
});

// GET /api/admin/settings
router.get('/settings', auth, (req, res) => {
  res.json(settings);
});

// PUT /api/admin/settings/:key
router.put('/settings/:key', auth, (req, res) => {
  const { key } = req.params;
  const allowed = ['booking_closed', 'absence_message'];
  if (!allowed.includes(key)) {
    return res.status(400).json({ error: 'Configuração inválida.' });
  }
  settings[key] = req.body.value;
  res.json({ key, value: settings[key] });
});

// GET /api/admin/customers/search?phone=...
router.get('/customers/search', auth, (req, res) => {
  const { phone } = req.query;
  if (!phone || phone.length < 7) return res.json([]);
  const normalized = phone.replace(/\D/g, '');
  const matches = reservations
    .filter(r => r.customer_phone.replace(/\D/g, '').includes(normalized))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map(r => ({
      name: r.customer_name,
      phone: r.customer_phone,
      email: r.customer_email,
      last_visit: r.date,
      visits: reservations.filter(x => x.customer_phone === r.customer_phone).length,
    }));
  res.json(matches);
});

// ── Events (DJ da Semana) ─────────────────────────────────────

// POST /api/admin/events — cria evento com upload de imagem
router.post('/events', auth, uploadImage('image'), (req, res) => {
  const { dj_name, date, description, is_active } = req.body;
  if (!dj_name || !date) return res.status(400).json({ error: 'dj_name e date são obrigatórios.' });

  const event = {
    id: uuidv4(),
    dj_name: dj_name.trim(),
    date,
    description: description?.trim() || '',
    image_url: req.file ? `/uploads/${req.file.filename}` : null,
    is_active: is_active === 'true' || is_active === true,
    created_at: new Date().toISOString(),
  };
  events.push(event);
  res.status(201).json(event);
});

// GET /api/admin/events
router.get('/events', auth, (req, res) => {
  res.json([...events].sort((a, b) => a.date.localeCompare(b.date)));
});

// PUT /api/admin/events/:id
router.put('/events/:id', auth, uploadImage('image'), (req, res) => {
  const idx = events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Evento não encontrado.' });
  const { dj_name, date, description, is_active } = req.body;
  events[idx] = {
    ...events[idx],
    ...(dj_name && { dj_name: dj_name.trim() }),
    ...(date && { date }),
    ...(description !== undefined && { description: description.trim() }),
    ...(is_active !== undefined && { is_active: is_active === 'true' || is_active === true }),
    ...(req.file && { image_url: `/uploads/${req.file.filename}` }),
  };
  res.json(events[idx]);
});

// DELETE /api/admin/events/:id
router.delete('/events/:id', auth, (req, res) => {
  const idx = events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Evento não encontrado.' });
  events.splice(idx, 1);
  res.status(204).end();
});

// GET /api/events/active — público, retorna eventos activos para o site
router.get('/events/active-public', (req, res) => {
  res.json(events.filter(e => e.is_active).sort((a, b) => a.date.localeCompare(b.date)));
});

module.exports = router;
module.exports.events = events;
