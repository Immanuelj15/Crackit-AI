const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String, // Optional for Google Auth users
    },
    picture: {
        type: String,
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    googleId: {
        type: String, // For Google Auth
        unique: true,
        sparse: true
    },
    college: {
        type: String,
    },
    branch: {
        type: String,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
