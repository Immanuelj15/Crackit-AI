const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const listCollections = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:');
        collections.forEach(c => console.log(c.name));
        process.exit();
    } catch (e) {
        process.exit(1);
    }
};

listCollections();
