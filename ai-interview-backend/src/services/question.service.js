const pool = require('../config/db');
const { generateInterviewQuestions } = require('../config/ollama');

async function createQuestionsForSession(sessionId) {
    const res = await pool.query(
    'SELECT content, role FROM resumes WHERE session_id=$1 ORDER BY id DESC LIMIT 1',
    [sessionId]
    );

    
    if (!res.rows[0]) {
    console.log('Session ID used for query:', sessionId);
    throw new Error('No resume found for this session. Please upload a resume first.');
    }


    const { content, role } = res.rows[0];
   
    const questions = await generateInterviewQuestions(content, role);

    for(const q of questions){
        await pool.query(
      'INSERT INTO questions (session_id, question) VALUES ($1, $2)',
      [sessionId, q]
        );
    }
    return questions;
    }

async function getQuestions(sessionId) {
    const res = await pool.query(
    'SELECT id, question FROM questions WHERE session_id=$1',
    [sessionId]
    );
    return res.rows;
}

module.exports = {
  createQuestionsForSession,
  getQuestions
};


