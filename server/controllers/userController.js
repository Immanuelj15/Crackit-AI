const User = require('../models/User');

// Update Streak
exports.updateStreak = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let lastActive = null;
        if (user.lastActiveDate) {
            lastActive = new Date(user.lastActiveDate);
            lastActive.setHours(0, 0, 0, 0);
        }

        let streakUpdated = false;
        let message = 'Keep going!';

        if (!lastActive) {
            // First time active
            user.streak = 1;
            user.lastActiveDate = new Date();
            streakUpdated = true;
            message = 'Streak started! Day 1';
        } else {
            const diffTime = Math.abs(today - lastActive);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                // Already active today
                // Do nothing to streak, but update lastActiveDate to now (for precision if needed)
                user.lastActiveDate = new Date();
                return res.json({
                    success: true,
                    updated: false,
                    streak: user.streak,
                    message: 'Daily streak already counted!'
                });
            } else if (diffDays === 1) {
                // Consecutive day
                user.streak += 1;
                user.lastActiveDate = new Date();
                streakUpdated = true;
                message = `Streak increased! Day ${user.streak}`;
            } else {
                // Missed a day or more
                user.streak = 1;
                user.lastActiveDate = new Date();
                streakUpdated = true;
                message = 'Streak reset! Day 1';
            }
        }

        await user.save();

        res.json({
            success: true,
            updated: streakUpdated,
            streak: user.streak,
            message
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Current Streak
exports.getStreak = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('streak lastActiveDate');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ streak: user.streak, lastActiveDate: user.lastActiveDate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
