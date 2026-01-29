const mongoose = require('mongoose');
const Company = require('./models/Company');
const Topic = require('./models/Topic');
const dotenv = require('dotenv');
dotenv.config();

const checkData = async () => {
    console.log(`\n🔍 CHECK_DB RUN AT: ${new Date().toISOString()}`);
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`\n✅ Connected to MongoDB at: ${conn.connection.host}`);
        console.log(`✅ Database Name: ${conn.connection.name}`);

        console.log('\n--- COMPANIES ---');
        const companies = await Company.find().select('name');
        companies.forEach((c, i) => console.log(`${i + 1}. ${c.name}`));
        console.log(`Total: ${companies.length}`);

        /*
        console.log('\n--- APTITUDE TOPICS ---');
        const topics = await Topic.find().select('name category');
        topics.forEach((t, i) => console.log(`${i + 1}. ${t.name} (${t.category})`));
        console.log(`Total: ${topics.length}`);
        */

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

checkData();
