const axios = require('axios');

const checkCompanies = async () => {
    try {
        const { data } = await axios.get('http://localhost:5000/api/companies');
        console.log('Companies Found:', data.length);
        if (data.length > 0) {
            console.log('First Company:', data[0].name);
            console.log('Hiring Pattern:', data[0].hiringPattern.substring(0, 50) + '...');
            console.log('First Round:', data[0].rounds[0].name, '-', data[0].rounds[0].description);
        }
    } catch (error) {
        console.error('Error fetching companies:', error.message);
    }
};

checkCompanies();
