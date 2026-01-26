const mongoose = require('mongoose');
const Company = require('./models/Company');
const dotenv = require('dotenv');
dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Company.countDocuments();
        console.log(`Total Companies: ${count}`);
        if (count > 0) {
            const sample = await Company.findOne();
            console.log('Sample Company:', sample.name);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

checkData();
