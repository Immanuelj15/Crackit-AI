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

// @desc    Submit aptitude test result
// @route   POST /api/questions/submit-aptitude
// @access  Private
const submitAptitudeResult = async (req, res) => {
    try {
        const { category, score, totalQuestions } = req.body;
        const userId = req.user._id;

        const User = require('../models/User');
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Use shared gamification utility
        const { updateUserStats } = require('../utils/gamificationUtils');

        // Check if this fulfills a daily challenge
        const today = new Date().toISOString().split('T')[0];
        // We might need to check if any of the questions in this category were "daily" today
        // Or if the test was triggered via the daily challenge link.
        // For simplicity, let's check if the category matches the current daily aptitude category.
        let isDailyChallenge = false;
        try {
            const CodingProblem = require('../models/CodingProblem'); // Needed if gamificationController isn't loaded
            // We can query the question model for any daily challenge today in this category
            const dailyQuestion = await Question.findOne({ type: 'aptitude', category, dailyChallengeDate: today });
            if (dailyQuestion) isDailyChallenge = true;
        } catch (err) {
            console.error("Daily challenge check failed:", err);
        }

        const result = await updateUserStats(user, {
            type: 'aptitude',
            category,
            score,
            isDailyChallenge
        });

        res.status(200).json({
            message: 'Aptitude result saved',
            coinsAwarded: result.coinsAwarded,
            totalCoins: result.totalCoins,
            streak: result.streak
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save result', error: error.message });
    }
};

module.exports = { getQuestions, createQuestion, submitAptitudeResult };
