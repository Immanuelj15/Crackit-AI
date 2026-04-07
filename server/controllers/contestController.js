const Contest = require('../models/Contest');

// @desc    Get all contests
// @route   GET /api/contests
// @access  Private
const getContests = async (req, res) => {
    try {
        const contests = await Contest.find({}).sort({ startTime: -1 });
        res.json(contests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get contest by ID
// @route   GET /api/contests/:id
// @access  Private
const getContestById = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id).populate('problems');
        if (!contest) return res.status(404).json({ message: 'Contest not found' });
        res.json(contest);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Join a contest
// @route   POST /api/contests/:id/join
// @access  Private
const joinContest = async (req, res) => {
    try {
        const userId = req.user._id;
        const contest = await Contest.findById(req.params.id);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        const isParticipating = contest.participants.some(p => p.userId.toString() === userId.toString());
        if (!isParticipating) {
            contest.participants.push({ userId });
            await contest.save();
        }

        res.json({ message: 'Joined contest successfully', contest });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getContests, getContestById, joinContest };
