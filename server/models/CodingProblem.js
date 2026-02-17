const mongoose = require('mongoose');

const codingProblemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },

    // Categorization
    pattern: {
        type: String,
        required: true,
        enum: [
            'Two Pointers',
            'Sliding Window',
            'Binary Search',
            'Prefix Sum',
            'Hashing',
            'Stack & Queue',
            'Linked List',
            'Trees',
            'Graphs',
            'Dynamic Programming',
            'Greedy',
            'Backtracking'
        ]
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    companies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }],

    // Problem Details
    constraints: { type: String },
    inputFormat: { type: String },
    outputFormat: { type: String },
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],

    // Code Templates
    starterCode: [{
        language: {
            type: String,
            enum: ['javascript', 'python', 'java', 'cpp', 'c']
        },
        code: String
    }],

    // Execution Data (Hidden from frontend normally)
    driverCode: {
        functionName: { type: String, required: true }, // The function user must implement
    },
    testCases: [{
        input: String,
        expectedOutput: String,
        isHidden: { type: Boolean, default: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
