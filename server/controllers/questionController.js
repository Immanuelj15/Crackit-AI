const Question = require('../models/Question');

// @desc    Get questions by company and type
// @route   GET /api/questions?company=ID&type=TYPE
// @access  Private
const getQuestions = async (req, res) => {
    const { company, type } = req.query;

    let query = {};
    if (company) query.company = company;
    if (type) query.type = type;

    const questions = await Question.find(query);
    res.json(questions);
};

const createQuestion = async (req, res) => {
    const question = await Question.create(req.body);
    res.status(201).json(question);
}

module.exports = { getQuestions, createQuestion };
