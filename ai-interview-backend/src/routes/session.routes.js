const express = require('express');
const router = express.Router();
const { createSession, resetSession } = require('../controllers/session.controller');

router.post('/create', createSession);
router.post('/reset', resetSession);

module.exports = router;