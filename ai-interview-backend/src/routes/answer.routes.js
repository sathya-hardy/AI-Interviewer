const express = require('express');
const router = express.Router();
const { postAnswer, fetchAnswer} = require('../controllers/answer.controller');

router.post('/', postAnswer);
router.get('/:questionId', fetchAnswer);

module.exports = router;