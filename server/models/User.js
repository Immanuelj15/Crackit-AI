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
    },
    department: {
        type: String,
    },
    year: {
        type: String,
    },
    phone: {
        type: String,
    },
    streak: {
        type: Number,
        default: 0
    },
    lastActiveDate: {
        type: Date,
        default: null
    },
    coins: {
        type: Number,
        default: 0
    },
    unlockedEditorials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingProblem'
    }],
    activityLog: [{
        date: { type: String }, // Format: YYYY-MM-DD
        count: { type: Number, default: 1 }
    }],
    solvedProblems: [{
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem' },
        type: { type: String, enum: ['coding', 'aptitude'] },
        topic: { type: String },
        difficulty: { type: String },
        score: { type: Number }, // For aptitude
        solvedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
