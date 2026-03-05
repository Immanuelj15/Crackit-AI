const axios = require('axios');

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

const languageMap = {
    'javascript': { language: 'javascript', version: '18.15.0' },
    'python': { language: 'python', version: '3.10.0' },
    'java': { language: 'java', version: '15.0.2' },
    'cpp': { language: 'cpp', version: '10.2.0' },
    'c': { language: 'c', version: '10.2.0' }
};

const executeCode = async (sourceCode, language, input) => {
    try {
        const langConfig = languageMap[language.toLowerCase()];
        if (!langConfig) throw new Error(`Unsupported language: ${language}`);

        const response = await axios.post(PISTON_URL, {
            language: langConfig.language,
            version: langConfig.version,
            files: [
                {
                    content: sourceCode
                }
            ],
            stdin: input
        });

        // Map Piston response to match what the controller expects
        // Piston returns results in response.data.run
        const runResult = response.data.run;

        return {
            status: { description: runResult.code === 0 ? (runResult.stderr ? 'Runtime Error' : 'Accepted') : 'Runtime Error' },
            stdout: runResult.stdout,
            stderr: runResult.stderr,
            compile_output: '', // Piston combines compile and run output often, or hides compile. 
            time: 0, // Piston doesn't return time/memory in the basic response easily
            memory: 0
        };
    } catch (error) {
        console.error('Piston Execution Error:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = {
    executeCode,
    languageMap
};
