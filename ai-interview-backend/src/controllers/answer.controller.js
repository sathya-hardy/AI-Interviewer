const { submitAnswer, getAnswer} = require('../services/answer.service');

async function postAnswer(req, res) {
  const { questionId } = req.body;
  const answer = (req.body.answer || '').trim();

  if (!questionId) {
    return res.status(400).json({ error: 'Question ID is required' });
  }
  if (answer.length < 20) {
    return res.status(400).json({ error: 'Answer is too short (minimum 20 characters)' });
  }
  if (answer.length > 5000) {
    return res.status(400).json({ error: 'Answer is too long (maximum 5,000 characters)' });
  }

  const result = await submitAnswer(req.sessionId, questionId, answer);
  res.json(result);
}

async function fetchAnswer(req, res) {
    const { questionId } = req.params;
    const answer = await getAnswer(req.sessionId,questionId);
    res.json(answer);
}


module.exports = { postAnswer, fetchAnswer};