const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    type: {
        type: String,
        enum: ['aptitude', 'coding', 'technical', 'hr'],
        required: true
    },
    questionText: { type: String, required: true },
    options: [{ type: String }], // For MCQ
    correctAnswer: { type: String }, // Index or text
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
