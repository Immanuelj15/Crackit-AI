const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    logoUrl: { type: String }, // URL to image
    hiringPattern: { type: String }, // Markdown or text description
    rounds: [{
        name: { type: String }, // e.g., "Aptitude", "Coding"
        description: { type: String }
    }],
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
