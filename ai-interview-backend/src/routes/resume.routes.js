const express = require('express');
const multer = require('multer');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');

// multer.memoryStorage() keeps the file in a Buffer (req.file.buffer)
// instead of writing to disk — simpler and we don't need to clean up temp files.
// Limits: 5MB max file size, only one file at a time.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files are allowed'));
        }
    }
});

// Existing route: paste resume as text
router.post('/', resumeController.uploadResume);

// New route: upload a file — upload.single('file') tells multer to expect
// one file in a form field named "file"
router.post('/upload', upload.single('file'), resumeController.uploadResumeFile);

// Parse-only route: extracts text from file without requiring role or saving to DB.
// Used when user uploads a file before entering the role.
router.post('/parse', upload.single('file'), resumeController.parseResumeFile);

module.exports = router;