const express = require('express');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { notifyOwner } = require('../services/email');
const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados pedidos. Tente novamente em 15 minutos.' },
});

const lookupLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Demasiados pedidos.' },
});

function validateReservation(body) {
  const { customer_name, customer_email, customer_phone, date, time, guests } = body;
  const errors = [];
  if (!customer_name || customer_name.trim().length < 2) errors.push('Nome inválido.');
  if (!customer_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) errors.push('E-mail inválido.');
  if (!customer_phone || customer_phone.trim().length < 7) errors.push('Telefone inválido.');
  if (!date) errors.push('Data obrigatória.');
  else if (new Date(date) < new Date(new Date().toDateString())) errors.push('Data deve ser futura.');
  if (!time) errors.push('Hora obrigatória.');
  const g = parseInt(guests, 10);
  if (!g || g < 1 || g > 20) errors.push('Número de pessoas inválido (1–20).');
  return errors;
}

// GET /api/reservations/booking-status
router.get('/booking-status', async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT key, value FROM settings WHERE key IN ('booking_closed','absence_message','spotify_embed_url')"
    );
    const s = {};
    rows.forEach(r => { s[r.key] = r.key === 'booking_closed' ? r.value === 'true' : r.value; });
    res.json({
      booking_closed:   s.booking_closed   ?? false,
      absence_message:  s.absence_message  ?? '',
      spotify_embed_url: s.spotify_embed_url ?? '',
    });
  } catch (e) {
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// GET /api/reservations/lookup?phone=
router.get('/lookup', lookupLimiter, async (req, res) => {
  const { phone } = req.query;
  if (!phone || phone.replace(/\D/g, '').length < 9) return res.json(null);
  const normalized = phone.replace(/\D/g, '');
  try {
    const { rows } = await db.query(
      `SELECT customer_name, date::text AS date,
              (SELECT COUNT(*) FROM reservations r2
               WHERE regexp_replace(r2.customer_phone,'[^0-9]','','g') LIKE $1) AS visits
       FROM reservations
       WHERE regexp_replace(customer_phone,'[^0-9]','','g') LIKE $1
       ORDER BY date DESC LIMIT 1`,
      [`%${normalized}%`]
    );
    if (!rows.length) return res.json(null);
    res.json({ name: rows[0].customer_name, last_visit: rows[0].date, visits: parseInt(rows[0].visits) });
  } catch (e) {
    res.json(null);
  }
});

// POST /api/reservations
router.post('/', limiter, async (req, res) => {
  // Check if booking is closed
  const { rows: cfg } = await db.query("SELECT value FROM settings WHERE key='booking_closed'");
  if (cfg[0]?.value === 'true') {
    const { rows: msg } = await db.query("SELECT value FROM settings WHERE key='absence_message'");
    return res.status(409).json({
      error: 'Reservas fechadas.',
      message: msg[0]?.value || 'Não estamos a aceitar reservas de momento.',
    });
  }

  const errors = validateReservation(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const id = uuidv4();
  const { customer_name, customer_email, customer_phone, date, time, guests, notes } = req.body;

  try {
    const { rows } = await db.query(
      `INSERT INTO reservations (id, customer_name, customer_email, customer_phone, date, "time", guests, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending') RETURNING *`,
      [id, customer_name.trim(), customer_email.trim().toLowerCase(), customer_phone.trim(),
       date, time, parseInt(guests, 10), notes?.trim() || '']
    );
    const reservation = { ...rows[0], date: rows[0].date.toISOString?.().split('T')[0] ?? rows[0].date };

    console.log('Nova reserva:', reservation.customer_name, reservation.date, reservation.time);
    notifyOwner(reservation).catch(err => console.error('Email erro (owner):', err.message));

    res.status(201).json({ message: 'Reserva recebida! Entraremos em contacto para confirmar.', id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao guardar reserva.' });
  }
});

module.exports = router;
