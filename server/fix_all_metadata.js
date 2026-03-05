const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CodingProblem = require('./models/CodingProblem');

dotenv.config();

const fixMetadata = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const problems = await CodingProblem.find({});
        console.log(`Checking ${problems.length} problems...`);

        for (const problem of problems) {
            const javaStarter = problem.starterCode.find(c => c.language === 'java');
            if (javaStarter) {
                const code = javaStarter.code;

                // Regex to extract: public ReturnType functionName(ArgType1 arg1, ArgType2 arg2)
                // We want to capture the ReturnType, functionName, and the parameters string
                const match = code.match(/public\s+([\w<>\[\]]+)\s+(\w+)\s*\(([^)]*)\)/);

                if (match) {
                    const returnType = match[1];
                    const functionName = match[2];
                    const paramsStr = match[3].trim();

                    const parameterTypes = paramsStr
                        ? paramsStr.split(',').map(p => {
                            const parts = p.trim().split(/\s+/);
                            return parts[parts.length - 2]; // The type is the second to last word
                        })
                        : [];

                    console.log(`Fixing "${problem.title}": ${functionName}(${parameterTypes.join(', ')}) -> ${returnType}`);

                    problem.driverCode = {
                        functionName,
                        parameterTypes,
                        returnType
                    };

                    await problem.save();
                } else {
                    console.warn(`Could not parse Java code for "${problem.title}"`);
                }
            }
        }

        console.log('Finished fixing metadata.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixMetadata();
