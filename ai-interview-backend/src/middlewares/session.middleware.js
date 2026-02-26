const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

module.exports = async function (req, res, next) {
  let sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    // No session → create one
    sessionId = uuidv4();

    await pool.query(
      'INSERT INTO sessions (id) VALUES ($1)',
      [sessionId]
    );

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'lax'
    });

    console.log("New session created:", sessionId);
  } else {
    // Session exists in cookie → verify in DB
    const check = await pool.query(
      'SELECT id FROM sessions WHERE id = $1',
      [sessionId]
    );

    if (check.rows.length === 0) {
      // Cookie session doesn't exist in DB (after reset)
      sessionId = uuidv4();

      await pool.query(
        'INSERT INTO sessions (id) VALUES ($1)',
        [sessionId]
      );

      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        sameSite: 'lax'
      });

      console.log("Recreated session:", sessionId);
    }
  }

  req.sessionId = sessionId;
  next();
};

