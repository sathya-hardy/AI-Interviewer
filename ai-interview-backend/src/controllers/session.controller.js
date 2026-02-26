const pool = require('../config/db');

async function createSession(req, res) {
  res.json({ sessionId: req.sessionId });
}

async function resetSession(req, res) {
  const sessionId = req.sessionId;

  await pool.query('DELETE FROM sessions WHERE id=$1', [sessionId]);

  res.clearCookie('sessionId');
  res.json({ message: 'Session reset successfully' });
}


module.exports = { createSession, resetSession };