const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }
  const token = header.slice(7);
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_in_prod');
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};
