const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const auth = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');
const { confirmCustomer } = require('../services/email');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiadas tentativas. Aguarde 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const ADMIN_USERNAME = 'admin';
const ADMIN_HASH = '$2a$12$oPP.cLtA.8NBcDXndtMi8.krDpxmNPrKl5l8UW7L7tPnRqagk9Uge';

// POST /api/admin/login
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const usernameMatch = username === ADMIN_USERNAME;
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
router.get('/reservations', auth, async (req, res) => {
  const { date, status } = req.query;
  const conditions = [];
  const params = [];

  if (date) {
    params.push(date);
    conditions.push(`date = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  try {
    const { rows } = await db.query(
      `SELECT *, date::text AS date, created_at::text AS created_at, updated_at::text AS updated_at
       FROM reservations ${where} ORDER BY "time" ASC`,
      params
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// GET /api/admin/reservations/today
router.get('/reservations/today', auth, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const { rows } = await db.query(
      `SELECT *, date::text AS date, created_at::text AS created_at, updated_at::text AS updated_at
       FROM reservations WHERE date = $1 ORDER BY "time" ASC`,
      [today]
    );
    const totalGuests = rows.reduce((s, r) => s + r.guests, 0);
    res.json({ reservations: rows, total: rows.length, totalGuests });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// PUT /api/admin/reservations/:id
router.put('/reservations/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const allowed = ['pending', 'confirmed', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }
  try {
    const { rows } = await db.query(
      `UPDATE reservations SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *, date::text AS date, created_at::text AS created_at, updated_at::text AS updated_at`,
      [status, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Reserva não encontrada.' });

    if (status === 'confirmed') {
      confirmCustomer(rows[0]).catch(err => console.error('Email erro (cliente):', err.message));
    }

    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// GET /api/admin/settings
router.get('/settings', auth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT key, value FROM settings');
    const s = {};
    rows.forEach(r => { s[r.key] = r.value; });
    res.json(s);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// PUT /api/admin/settings/:key
router.put('/settings/:key', auth, async (req, res) => {
  const { key } = req.params;
  const allowed = ['booking_closed', 'absence_message', 'spotify_embed_url'];
  if (!allowed.includes(key)) {
    return res.status(400).json({ error: 'Configuração inválida.' });
  }
  const value = String(req.body.value ?? '');
  try {
    const { rows } = await db.query(
      `INSERT INTO settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
       RETURNING key, value`,
      [key, value]
    );
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// GET /api/admin/customers/search?phone=
router.get('/customers/search', auth, async (req, res) => {
  const { phone } = req.query;
  if (!phone || phone.length < 7) return res.json([]);
  const normalized = phone.replace(/\D/g, '');
  try {
    const { rows } = await db.query(
      `SELECT DISTINCT ON (customer_phone)
              customer_name AS name,
              customer_phone AS phone,
              customer_email AS email,
              date::text AS last_visit,
              (SELECT COUNT(*) FROM reservations r2
               WHERE regexp_replace(r2.customer_phone,'[^0-9]','','g') =
                     regexp_replace(r.customer_phone,'[^0-9]','','g')) AS visits
       FROM reservations r
       WHERE regexp_replace(customer_phone,'[^0-9]','','g') LIKE $1
       ORDER BY customer_phone, date DESC
       LIMIT 5`,
      [`%${normalized}%`]
    );
    res.json(rows.map(r => ({ ...r, visits: parseInt(r.visits) })));
  } catch (e) {
    console.error(e);
    res.json([]);
  }
});

// ── Events (DJ da Semana) ─────────────────────────────────────

// POST /api/admin/events
router.post('/events', auth, uploadImage('image'), async (req, res) => {
  const { dj_name, date, description, is_active } = req.body;
  if (!dj_name || !date) return res.status(400).json({ error: 'dj_name e date são obrigatórios.' });

  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  const active = is_active === 'true' || is_active === true;

  try {
    const { rows } = await db.query(
      `INSERT INTO events (dj_name, date, description, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *, date::text AS date, created_at::text AS created_at`,
      [dj_name.trim(), date, description?.trim() || '', image_url, active]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao guardar evento.' });
  }
});

// GET /api/admin/events
router.get('/events', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT *, date::text AS date, created_at::text AS created_at FROM events ORDER BY date ASC`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// PUT /api/admin/events/:id
router.put('/events/:id', auth, uploadImage('image'), async (req, res) => {
  const { id } = req.params;
  const { dj_name, date, description, is_active } = req.body;

  try {
    const { rows: existing } = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Evento não encontrado.' });

    const current = existing[0];
    const updates = {
      dj_name:     dj_name     !== undefined ? dj_name.trim()            : current.dj_name,
      date:        date        !== undefined ? date                       : current.date,
      description: description !== undefined ? description.trim()         : current.description,
      is_active:   is_active   !== undefined ? (is_active === 'true' || is_active === true) : current.is_active,
      image_url:   req.file    ? `/uploads/${req.file.filename}`          : current.image_url,
    };

    const { rows } = await db.query(
      `UPDATE events SET dj_name=$1, date=$2, description=$3, image_url=$4, is_active=$5
       WHERE id = $6
       RETURNING *, date::text AS date, created_at::text AS created_at`,
      [updates.dj_name, updates.date, updates.description, updates.image_url, updates.is_active, id]
    );
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// DELETE /api/admin/events/:id
router.delete('/events/:id', auth, async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Evento não encontrado.' });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// ── Cardápio (Dishes) ─────────────────────────────────────────

// GET /api/admin/dishes
router.get('/dishes', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT *, created_at::text AS created_at, updated_at::text AS updated_at
       FROM dishes ORDER BY category, name`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// POST /api/admin/dishes
router.post('/dishes', auth, async (req, res) => {
  const { name, description, price, category, image_url } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'name, price e category são obrigatórios.' });
  }
  try {
    const { rows } = await db.query(
      `INSERT INTO dishes (name, description, price, category, image_url, available)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *, created_at::text AS created_at, updated_at::text AS updated_at`,
      [name.trim(), description?.trim() || '', parseFloat(price), category.trim(), image_url?.trim() || '']
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao guardar prato.' });
  }
});

// PUT /api/admin/dishes/:id
router.put('/dishes/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image_url, available } = req.body;

  try {
    const { rows: existing } = await db.query('SELECT * FROM dishes WHERE id = $1', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Prato não encontrado.' });

    const c = existing[0];
    const { rows } = await db.query(
      `UPDATE dishes
       SET name=$1, description=$2, price=$3, category=$4, image_url=$5, available=$6, updated_at=NOW()
       WHERE id=$7
       RETURNING *, created_at::text AS created_at, updated_at::text AS updated_at`,
      [
        name        !== undefined ? name.trim()              : c.name,
        description !== undefined ? description.trim()        : c.description,
        price       !== undefined ? parseFloat(price)         : c.price,
        category    !== undefined ? category.trim()           : c.category,
        image_url   !== undefined ? image_url.trim()          : c.image_url,
        available   !== undefined ? Boolean(available)        : c.available,
        id,
      ]
    );
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// DELETE /api/admin/dishes/:id
router.delete('/dishes/:id', auth, async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM dishes WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Prato não encontrado.' });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
