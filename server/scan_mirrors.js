const axios = require('axios');

const MIRRORS = [
    'https://emkc.org/api/v2/piston/execute',
    'https://piston.raycast.com/api/v2/execute',
    'https://piston.engineer/api/v2/execute',
    'https://api.shre.dev/piston/api/v2/execute',
    'https://piston.john-f-cavanaugh.com/api/v2/execute',
    'https://piston.kimbrough.io/api/v2/execute'
];

const testMirror = async (url) => {
    try {
        console.log(`Testing ${url}...`);
        const response = await axios.post(url, {
            language: 'javascript',
            version: '18.15.0',
            files: [{ content: "console.log('OK')" }],
        }, { timeout: 5000 });

        if (response.status === 200) {
            console.log(`SUCCESS: ${url}`);
            return true;
        }
    } catch (e) {
        console.log(`FAILED: ${url} (${e.response?.status || e.message})`);
    }
    return false;
};

const run = async () => {
    for (const url of MIRRORS) {
        if (await testMirror(url)) {
            console.log('\nFOUND WORKING MIRROR:', url);
            break;
        }
    }
};

run();
