const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CodingProblem = require('./models/CodingProblem');

dotenv.config();

const findProblem = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const problem = await CodingProblem.findOne({ slug: 'two-sum-ii-input-array-is-sorted' });
        console.log('--- DRIVER CODE ---');
        console.log(JSON.stringify(problem.driverCode, null, 2));
        console.log('--- TEST CASES ---');
        console.log(JSON.stringify(problem.testCases, null, 2));
        process.exit();
    } catch (e) {
        process.exit(1);
    }
};

findProblem();
