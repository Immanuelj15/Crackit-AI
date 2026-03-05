const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CodingProblem = require('./models/CodingProblem');

dotenv.config();

const checkPatterns = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const patterns = await CodingProblem.aggregate([{ $group: { _id: "$pattern", count: { $sum: 1 } } }]);
        console.log('--- DATA START ---');
        patterns.forEach(p => console.log(`${p._id}: ${p.count}`));
        console.log('--- DATA END ---');
        const total = await CodingProblem.countDocuments();
        console.log('TOTAL:', total);
        process.exit();
    } catch (e) {
        process.exit(1);
    }
};

checkPatterns();
