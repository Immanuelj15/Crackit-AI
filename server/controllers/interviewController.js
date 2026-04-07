const InterviewQuestion = require('../models/InterviewQuestion');

// @desc    Get all interview questions
// @route   GET /api/interview-questions
// @access  Public
const getInterviewQuestions = async (req, res) => {
    try {
        const { company, category, search, difficulty } = req.query;
        let query = {};

        if (company) query.company = company;
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;
        if (search) {
            query.$or = [
                { question: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const questions = await InterviewQuestion.find(query)
            .populate('company', 'name logoUrl')
            .sort({ createdAt: -1 });

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get question by ID
// @route   GET /api/interview-questions/:id
// @access  Public
const getInterviewQuestionById = async (req, res) => {
    try {
        const question = await InterviewQuestion.findById(req.params.id).populate('company', 'name logoUrl');
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getInterviewQuestions, getInterviewQuestionById };
