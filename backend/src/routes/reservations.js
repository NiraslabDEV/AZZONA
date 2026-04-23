const express = require('express');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const { reservations, settings } = require('../data/store');
const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados pedidos. Tente novamente em 15 minutos.' },
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

// GET /api/reservations/booking-status (public)
router.get('/booking-status', (req, res) => {
  res.json({
    booking_closed: settings.booking_closed,
    absence_message: settings.absence_message,
  });
});

// GET /api/reservations/lookup?phone= — CRM público, retorna dados mínimos
const lookupLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Demasiados pedidos.' },
});

router.get('/lookup', lookupLimiter, (req, res) => {
  const { phone } = req.query;
  if (!phone || phone.replace(/\D/g, '').length < 9) return res.json(null);
  const normalized = phone.replace(/\D/g, '');
  const matches = reservations
    .filter(r => r.customer_phone.replace(/\D/g, '').includes(normalized))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  if (!matches.length) return res.json(null);
  const last = matches[0];
  res.json({
    name: last.customer_name,
    last_visit: last.date,
    visits: matches.length,
  });
});

router.post('/', limiter, (req, res) => {
  if (settings.booking_closed) {
    return res.status(409).json({
      error: 'Reservas fechadas.',
      message: settings.absence_message || 'Não estamos a aceitar reservas de momento.',
    });
  }

  const errors = validateReservation(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const reservation = {
    id: uuidv4(),
    customer_name: req.body.customer_name.trim(),
    customer_email: req.body.customer_email.trim().toLowerCase(),
    customer_phone: req.body.customer_phone.trim(),
    date: req.body.date,
    time: req.body.time,
    guests: parseInt(req.body.guests, 10),
    notes: req.body.notes?.trim() || '',
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  reservations.push(reservation);
  console.log('Nova reserva:', reservation.customer_name, reservation.date, reservation.time);

  res.status(201).json({
    message: 'Reserva recebida! Entraremos em contacto para confirmar.',
    id: reservation.id,
  });
});

module.exports = router;
