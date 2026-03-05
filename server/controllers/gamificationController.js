const User = require('../models/User');
const CodingProblem = require('../models/CodingProblem');

// @desc    Unlock editorial for a problem
// @route   POST /api/coding/unlock-editorial
// @access  Private
const unlockEditorial = async (req, res) => {
    try {
        const { problemId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const problem = await CodingProblem.findById(problemId);

        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        if (user.unlockedEditorials.includes(problemId)) {
            return res.status(200).json({ message: 'Editorial already unlocked' });
        }

        const cost = problem.editorialCost || 50;
        if (user.coins < cost) {
            return res.status(400).json({ message: `Insufficient coins. Need ${cost} coins.` });
        }

        user.coins -= cost;
        user.unlockedEditorials.push(problemId);
        await user.save();

        res.status(200).json({ message: 'Editorial unlocked successfully', coins: user.coins });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get global leaderboard
// @route   GET /api/coding/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find({})
            .sort({ streak: -1, coins: -1 })
            .limit(20)
            .select('name picture streak coins college')
            .lean();

        res.status(200).json(topUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get or set daily challenge problem
// @route   GET /api/coding/daily-challenge
// @access  Public
const getDailyChallenge = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Find existing daily challenge for today
        let problem = await CodingProblem.findOne({ dailyChallengeDate: today });

        if (!problem) {
            // Pick a random problem to be today's challenge
            const count = await CodingProblem.countDocuments();
            const random = Math.floor(Math.random() * count);
            problem = await CodingProblem.findOne().skip(random);

            if (problem) {
                problem.dailyChallengeDate = today;
                await problem.save();
            }
        }

        res.status(200).json(problem);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    unlockEditorial,
    getLeaderboard,
    getDailyChallenge
};
