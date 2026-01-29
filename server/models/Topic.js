const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['quant', 'logical', 'verbal'],
        required: true
    },
    name: {
        type: String,
        required: true, // e.g., "Percentage", "Time and Work"
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String, // Markdown content for "Study" section (Theories, Formulas)
        required: true
    },
    examples: [{
        question: String,
        solution: String, // Explanation for the example
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
