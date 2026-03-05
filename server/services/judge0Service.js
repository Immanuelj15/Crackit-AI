const axios = require('axios');

const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_HOST = process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.JUDGE0_KEY;

const languageMap = {
    'javascript': 63,
    'python': 71,
    'java': 62,
    'cpp': 54,
    'c': 50
};

const executeCode = async (sourceCode, language, input) => {
    try {
        const languageId = languageMap[language.toLowerCase()];
        if (!languageId) throw new Error(`Unsupported language: ${language}`);

        const response = await axios.post(`${JUDGE0_URL}/submissions`, {
            source_code: sourceCode,
            language_id: languageId,
            stdin: input
        }, {
            params: { wait: true, fields: '*' },
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': JUDGE0_KEY,
                'X-RapidAPI-Host': JUDGE0_HOST
            }
        });

        return response.data;
    } catch (error) {
        console.error('Judge0 Execution Error:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = {
    executeCode,
    languageMap
};
