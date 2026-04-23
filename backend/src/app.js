require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const dishesRouter = require('./routes/dishes');
const reservationsRouter = require('./routes/reservations');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '../../frontend')));
app.use('/img', express.static(path.join(__dirname, '../../img')));

// Serve uploaded DJ images with security header
app.use('/uploads', (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Public API
app.use('/api/dishes', dishesRouter);
app.use('/api/reservations', reservationsRouter);

// Public events (DJ da Semana)
app.get('/api/events/active', (req, res) => {
  const { events } = require('./routes/admin');
  res.json(events.filter(e => e.is_active).sort((a, b) => a.date.localeCompare(b.date)));
});

// Admin API
app.use('/api/admin', adminRouter);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Ficheiro demasiado grande. Máximo 2 MB.' });
  }
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ error: err.message });
  }
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Só faz listen quando executado directamente (não em testes)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🍽  Azzona server → http://localhost:${PORT}`);
  });
}

module.exports = app;
