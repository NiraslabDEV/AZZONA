const express = require('express');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados pedidos. Tente novamente em 15 minutos.' },
});

// In-memory store until PostgreSQL (Sprint 2)
const reservations = [];

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

router.post('/', limiter, (req, res) => {
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
  console.log('Nova reserva:', reservation);

  res.status(201).json({
    message: 'Reserva recebida! Entraremos em contacto para confirmar.',
    id: reservation.id,
  });
});

module.exports = router;
