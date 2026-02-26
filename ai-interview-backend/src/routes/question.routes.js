const express = require('express');
const router = express.Router();
const { generateQuestions, fetchQuestions } = require('../controllers/question.controller');

router.post('/', generateQuestions);
router.get('/', fetchQuestions);

module.exports = router;
