const pool = require('../config/db');
const { parseResume } = require('../utils/resumeParser');

async function uploadResume(req, res) {
    const content = (req.body.content || '').trim();
    const role = (req.body.role || '').trim();
    const sessionId = req.sessionId;

    if (!content || !role) {
        return res.status(400).json({ error: 'Resume content and role are required' });
    }
    if (content.length < 50) {
        return res.status(400).json({ error: 'Resume is too short (minimum 50 characters)' });
    }
    if (content.length > 10000) {
        return res.status(400).json({ error: 'Resume is too long (maximum 10,000 characters)' });
    }
    if (role.length < 2) {
        return res.status(400).json({ error: 'Role is too short (minimum 2 characters)' });
    }
    if (role.length > 100) {
        return res.status(400).json({ error: 'Role is too long (maximum 100 characters)' });
    }

    await pool.query(
        'INSERT INTO resumes (session_id, content, role) VALUES ($1, $2, $3)',
        [sessionId, content, role]
    );
    res.status(201).json({ message: 'Resume uploaded successfully' });
}

/**
 * Handles file upload: multer puts the file on req.file, and the role
 * comes as a text field in the same multipart form (req.body.role).
 *
 * We parse the file to text, then return it so the frontend can show it
 * in the textarea for review before generating questions.
 */
async function uploadResumeFile(req, res) {
    const sessionId = req.sessionId;
    const role = req.body.role;

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!role) {
        return res.status(400).json({ error: 'Target role is required' });
    }

    try {
        // Extract text from the uploaded PDF/DOCX
        const content = await parseResume(req.file.buffer, req.file.mimetype);

        if (!content) {
            return res.status(422).json({ error: 'Could not extract text from file. Is it a valid resume?' });
        }

        // Store in DB just like the text paste flow
        await pool.query(
            'INSERT INTO resumes (session_id, content, role) VALUES ($1, $2, $3)',
            [sessionId, content, role]
        );

        // Return the extracted text so the user can review it
        res.status(201).json({ message: 'Resume uploaded successfully', content });
    } catch (err) {
        if (err.message.includes('Unsupported file type')) {
            return res.status(400).json({ error: err.message });
        }
        console.error('Resume parsing error:', err.message, err.stack);
        res.status(500).json({ error: 'Failed to parse resume file: ' + err.message });
    }
}

/**
 * Parse-only: extracts text from a file and returns it.
 * No role required, nothing saved to DB.
 * The user reviews the text, enters a role, then clicks "Generate Questions"
 * which goes through the normal POST /resume text flow.
 */
async function parseResumeFile(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const content = await parseResume(req.file.buffer, req.file.mimetype);

        if (!content) {
            return res.status(422).json({ error: 'Could not extract text from file. Is it a valid resume?' });
        }

        res.json({ content });
    } catch (err) {
        if (err.message.includes('Unsupported file type')) {
            return res.status(400).json({ error: err.message });
        }
        console.error('Resume parsing error:', err.message, err.stack);
        res.status(500).json({ error: 'Failed to parse resume file: ' + err.message });
    }
}

module.exports = { uploadResume, uploadResumeFile, parseResumeFile }