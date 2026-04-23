require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

module.exports = async () => {
  if (!process.env.DATABASE_URL) return;
  const migrate = require('../src/db/migrate');
  const db = require('../src/db');
  try {
    await migrate();
  } finally {
    await db.end();
  }
};
