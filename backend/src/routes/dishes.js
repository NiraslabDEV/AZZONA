const express = require('express');
const rateLimit = require('express-rate-limit');
const { dishes } = require('../data/store');
const router = express.Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });


router.get('/', limiter, (req, res) => {
  const { category } = req.query;
  let result = dishes.filter(d => d.available);
  if (category && category !== 'all') {
    result = result.filter(d => d.category === category);
  }
  res.json(result);
});

module.exports = router;
