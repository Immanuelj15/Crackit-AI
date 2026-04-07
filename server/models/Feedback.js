const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Bug', 'Suggestion', 'Appreciation', 'Other'],
        default: 'Suggestion'
    },
    image: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Resolved'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
