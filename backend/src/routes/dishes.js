const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const router = express.Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

router.get('/', limiter, async (req, res) => {
  const { category } = req.query;
  try {
    const params = [];
    let where = 'WHERE available = true';
    if (category && category !== 'all') {
      params.push(category);
      where += ` AND category = $${params.length}`;
    }
    const { rows } = await db.query(
      `SELECT * FROM dishes ${where} ORDER BY category, name`,
      params
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
