const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingProblem',
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['javascript', 'python', 'java', 'cpp', 'c']
    },
    code: {
        type: String,
        required: true
    },
    verdict: {
        type: String,
        required: true,
        enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Pending', 'Running'],
        default: 'Pending'
    },
    passedTestcases: {
        type: Number,
        default: 0
    },
    totalTestcases: {
        type: Number,
        default: 0
    },
    runtime: {
        type: Number, // in ms
        default: 0
    },
    memory: {
        type: Number, // in KB
        default: 0
    },
    results: [{
        input: String,
        expectedOutput: String,
        actualOutput: String,
        status: String,
        time: Number,
        memory: Number
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
