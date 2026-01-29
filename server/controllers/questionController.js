const Question = require('../models/Question');

// @desc    Get questions by company and type
// @route   GET /api/questions?company=ID&type=TYPE
// @access  Private
const getQuestions = async (req, res) => {
    const { company, type, category, isGeneral } = req.query;

    let query = {};
    if (company) query.company = company;
    if (type) query.type = type;
    if (category) query.category = category;

    // If asking for general aptitude (no specific company)
    if (isGeneral === 'true') {
        query.company = { $exists: false }; // or null depending on how it's stored, checking both usually safer or ensuring seeder doesn't set it.
        // Actually, let's just use `company: null` or check existence.
        // Mongoose might not store keys for undefined. 
        // Let's rely on explicit company filter being absent + type=aptitude.
        // But to separate "Company Aptitude" vs "General Aptitude", we need a distinction.
        // Let's say General Aptitude has no company field.
        delete query.company; // Remove any company filter if present
        query.company = null; // Explicitly search for null/missing
    }

    const questions = await Question.find(query);
    res.json(questions);
};

const createQuestion = async (req, res) => {
    const question = await Question.create(req.body);
    res.status(201).json(question);
}

module.exports = { getQuestions, createQuestion };
