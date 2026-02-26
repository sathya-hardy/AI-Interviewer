const axios = require('axios');
require('dotenv').config();

async function generateInterviewQuestions(resumeText, role) {
  const prompt = `You are a senior technical interviewer.

Candidate Resume:
${resumeText}

Target Role:
${role}

Generate exactly 5 technical interview questions tailored to this resume and role.
Questions should progressively increase in difficulty.

RULES:
- Return ONLY a numbered list (1. through 5.)
- Each line must be a question ending with "?"
- Do NOT include any introduction, preamble, or explanation
- Do NOT include anything like "Here are..." or "Based on..."
- Start directly with "1."`;

    const response = await axios.post(`${process.env.OLLAMA_API_URL}/api/generate`, {
    model: 'llama3',
    prompt,
    stream: false
  });

   const raw = response.data.response;
   return raw
    .split('\n')
    .map(q => q.replace(/^\d+[\).\s]*/, '').trim())
    .filter(q => q.length > 0 && q.endsWith('?'));
}


async function evaluateAnswer(question, answer) {
  const prompt = `
  Question:
  ${question}

  Candidate Answer:
  ${answer}

  You are an interview evaluator.

  Evaluate the candidate's answer. Then provide 2-3 short, actionable tips
  to help the candidate improve their answer. Tips should be specific and
  practical (e.g. "Use the STAR method to structure your response",
  "Mention specific metrics or outcomes", "Discuss the trade-offs of your approach").

  Return ONLY valid JSON in this format:
  {
    "score": number (0-10),
    "feedback": "string",
    "tips": ["tip1", "tip2", "tip3"]
  }
  Nothing else other than Valid JSON should be returned.
  `;

  const res = await axios.post(`${process.env.OLLAMA_API_URL}/api/generate`, {
    model: 'llama3',
    prompt,
    stream: false
  });

  const raw = res.data.response;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      score: parsed.score ?? 5,
      feedback: parsed.feedback ?? "No feedback generated.",
      tips: Array.isArray(parsed.tips) ? parsed.tips : []
    };
}

module.exports = {
  generateInterviewQuestions, evaluateAnswer
};



