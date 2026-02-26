const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts plain text from a PDF or DOCX file buffer.
 *
 * - pdf-parse v1: just a function — pass in a Buffer, get back { text } with all pages
 * - mammoth converts DOCX (which is zipped XML internally) to plain text
 *
 * @param {Buffer} buffer - The raw file data from multer
 * @param {string} mimetype - e.g. "application/pdf" or "application/vnd.openxmlformats..."
 * @returns {string} The extracted text content
 */
async function parseResume(buffer, mimetype) {
    if (mimetype === 'application/pdf') {
        const data = await pdfParse(buffer);
        return data.text.trim();
    }

    if (
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimetype === 'application/msword'
    ) {
        // mammoth.extractRawText gives us plain text (no HTML formatting)
        const result = await mammoth.extractRawText({ buffer });
        return result.value.trim();
    }

    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
}

module.exports = { parseResume };
