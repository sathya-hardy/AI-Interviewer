const {createQuestionsForSession, getQuestions } = require('../services/question.service');

async function generateQuestions(req, res) {
  try{
  const sessionId = req.sessionId;
  const questions = await createQuestionsForSession(sessionId);
  res.json({ questions });
  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
  }

async function fetchQuestions(req, res) {
  try{
  const sessionId = req.sessionId;
  const questions = await getQuestions(sessionId);
  res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get questions' });
  }
}

module.exports = { generateQuestions, fetchQuestions };