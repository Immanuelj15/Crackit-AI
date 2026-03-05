const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CodingProblem = require('./models/CodingProblem');

dotenv.config();

const fixProblem = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const problem = await CodingProblem.findOne({ slug: 'two-sum-ii-input-array-is-sorted' });
        if (!problem) {
            console.log('Problem not found');
            process.exit(1);
        }

        problem.driverCode = {
            functionName: 'twoSum',
            parameterTypes: ['int[]', 'int'],
            returnType: 'int[]'
        };

        // Add proper test cases if missing
        if (!problem.testCases || problem.testCases.length === 0) {
            problem.testCases = [
                { input: 'numbers = [2,7,11,15], target = 9', expectedOutput: '[1, 2]', isHidden: false },
                { input: 'numbers = [2,3,4], target = 6', expectedOutput: '[1, 3]', isHidden: false },
                { input: 'numbers = [-1,0], target = -1', expectedOutput: '[1, 2]', isHidden: false }
            ];
        }

        await problem.save();
        console.log('Problem fixed successfully');

        // Check for other problematic problems
        const badProblems = await CodingProblem.find({
            $or: [
                { "driverCode.parameterTypes": { $size: 0 } },
                { testCases: { $size: 0 } }
            ]
        }).select('title slug');

        console.log('--- OTHER POTENTIALLY BROKEN PROBLEMS ---');
        badProblems.forEach(p => console.log(`${p.title} (${p.slug})`));

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

fixProblem();
