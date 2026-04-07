const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    category: { type: String, enum: ['Technical', 'Behavioral', 'System Design', 'HR'], default: 'Technical' },
    role: { type: String }, // e.g., "Software Engineer", "Frontend Developer"
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    likes: { type: Number, default: 0 },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
