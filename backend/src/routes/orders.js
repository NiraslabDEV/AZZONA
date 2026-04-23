const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { notifyOwnerOrder } = require('../services/email');
const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiados pedidos. Tente novamente em 15 minutos.' },
});

// POST /api/orders — cria pedido de delivery
router.post('/', limiter, async (req, res) => {
  const { customer_name, customer_phone, customer_address, notes, items, total } = req.body;

  if (!customer_name || !customer_phone || !customer_address) {
    return res.status(400).json({ error: 'Nome, telefone e morada são obrigatórios.' });
  }
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'O pedido deve ter pelo menos um item.' });
  }
  const parsedTotal = parseFloat(total);
  if (!parsedTotal || parsedTotal <= 0) {
    return res.status(400).json({ error: 'Total inválido.' });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO orders (customer_name, customer_phone, customer_address, notes, items, total, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *, created_at::text AS created_at`,
      [
        customer_name.trim(),
        customer_phone.trim(),
        customer_address.trim(),
        notes?.trim() || '',
        JSON.stringify(items),
        parsedTotal,
      ]
    );
    const order = rows[0];
    notifyOwnerOrder(order).catch(err => console.error('Email erro (delivery):', err.message));
    console.log('Novo pedido delivery:', order.customer_name, order.total);
    res.status(201).json({ id: order.id, message: 'Pedido registado.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao guardar pedido.' });
  }
});

module.exports = router;
