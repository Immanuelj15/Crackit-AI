const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CodingProblem = require('./models/CodingProblem');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const problem = await CodingProblem.findOne({ slug: 'binary-search' });
        console.log('Problem Metadata:', JSON.stringify(problem.driverCode, null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
