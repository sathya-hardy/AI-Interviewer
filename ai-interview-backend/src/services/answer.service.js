const pool = require('../config/db');
const { evaluateAnswer } = require('../config/ollama');

async function submitAnswer(sessionId, questionId, answer) {
    const qR = await pool.query(
    'SELECT question FROM questions WHERE id=$1 AND session_id=$2',
    [questionId, sessionId]
  );
    const evaluation = await evaluateAnswer(qR.rows[0].question, answer);
    await pool.query(
      `
      INSERT INTO answers
      (session_id, question_id, answer, score, feedback, tips)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (session_id, question_id)
      DO UPDATE SET
        answer = EXCLUDED.answer,
        score = EXCLUDED.score,
        feedback = EXCLUDED.feedback,
        tips = EXCLUDED.tips,
        created_at = NOW()
      `,
      [sessionId, questionId, answer, evaluation.score, evaluation.feedback, evaluation.tips]
    );

  return evaluation;
}

async function getAnswer(sessionId, questionId) {
  const res = await pool.query(
    `
    SELECT
      q.question,
      a.answer,
      a.score,
      a.feedback,
      a.tips
    FROM answers a
    JOIN questions q ON q.id = a.question_id
    WHERE a.session_id = $1 AND a.question_id = $2
    `,
    [sessionId, questionId]
  );

  return res.rows[0];
}

module.exports = {
  submitAnswer,
  getAnswer
};