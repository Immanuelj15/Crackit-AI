const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const bcrypt = require('bcryptjs');

const makeAdmin = async (email, password = 'password123') => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database');

        let user = await User.findOne({ email });

        if (!user) {
            console.log(`User "${email}" not found. Creating new admin user...`);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            user = await User.create({
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: 'admin',
                college: 'Admin Institute',
                branch: 'Administration'
            });
            console.log(`Successfully created Admin account: ${email}`);
        } else {
            user.role = 'admin';
            await user.save();
            console.log(`Successfully upgraded existing user "${email}" to Admin.`);
        }

        console.log('Password for this account is: ' + password);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const email = process.argv[2] || 'admin@gmail.com';
const password = process.argv[3] || 'password123';
makeAdmin(email, password);
