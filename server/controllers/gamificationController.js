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
            .sort({ coins: -1, streak: -1 })
            .limit(50)
            .select('name picture streak coins college solvedProblems')
            .lean();

        const formattedLeaderboard = topUsers.map((u, index) => {
            const solvedCount = u.solvedProblems?.length || 0;
            return {
                rank: index + 1,
                name: u.name,
                picture: u.picture,
                streak: u.streak,
                coins: u.coins,
                college: u.college,
                solvedCount
            };
        });

        res.status(200).json(formattedLeaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get or set daily challenge problem
// @route   GET /api/coding/daily-challenge
// @access  Public
const getDailyChallenge = async (req, res) => {
    try {
        const Question = require('../models/Question');
        const today = new Date().toISOString().split('T')[0];

        // 1. Coding Challenge
        let codingProblem = await CodingProblem.findOne({ dailyChallengeDate: today });
        if (!codingProblem) {
            const count = await CodingProblem.countDocuments();
            if (count > 0) {
                const random = Math.floor(Math.random() * count);
                codingProblem = await CodingProblem.findOne().skip(random);
                if (codingProblem) {
                    codingProblem.dailyChallengeDate = today;
                    await codingProblem.save();
                }
            }
        }

        // 2. Aptitude Challenge
        let aptitudeProblem = await Question.findOne({ type: 'aptitude', dailyChallengeDate: today });
        if (!aptitudeProblem) {
            const count = await Question.countDocuments({ type: 'aptitude' });
            if (count > 0) {
                const random = Math.floor(Math.random() * count);
                aptitudeProblem = await Question.findOne({ type: 'aptitude' }).skip(random);
                if (aptitudeProblem) {
                    aptitudeProblem.dailyChallengeDate = today;
                    await aptitudeProblem.save();
                }
            }
        }

        res.status(200).json({
            coding: codingProblem,
            aptitude: aptitudeProblem
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    unlockEditorial,
    getLeaderboard,
    getDailyChallenge
};
