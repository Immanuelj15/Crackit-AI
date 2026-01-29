const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // Optional for general aptitude
    type: {
        type: String,
        enum: ['aptitude', 'coding', 'technical', 'hr'],
        required: true
    },
    category: {
        type: String,
        enum: ['quant', 'logical', 'verbal', 'general'],
        default: 'general'
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic' // Link to specific topic like "Percentage"
    },
    questionText: { type: String, required: true },
    options: [{ type: String }], // For MCQ
    correctAnswer: { type: String }, // Index or text
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
