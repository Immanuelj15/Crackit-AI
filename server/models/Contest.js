const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    duration: { type: Number, default: 90 }, // in minutes
    problems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingProblem'
    }],
    participants: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number, default: 0 },
        submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
        completedAt: { type: Date }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);
