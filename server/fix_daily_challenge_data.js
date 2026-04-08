const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

const fixData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Fixing Daily Aptitude Challenge data...");

        const categories = ['quant', 'logical', 'verbal'];
        
        for (const cat of categories) {
            // Find 10 questions of this category and set company to null
            const questions = await Question.find({ type: 'aptitude', category: cat }).limit(10);
            
            const ids = questions.map(q => q._id);
            await Question.updateMany(
                { _id: { $in: ids } },
                { $unset: { company: "" } } // This effectively makes them 'general'
            );
            
            console.log(`Successfully converted 10 ${cat} questions to General.`);
        }

        console.log("Data fix complete!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixData();
