const User = require('../models/User');

/**
 * Updates user statistics including streaks, coins, and progress.
 * @param {Object} user - The user document from Mongoose.
 * @param {Object} options - Update options.
 * @param {string} options.type - 'coding' or 'aptitude'.
 * @param {string} options.problemId - The ID of the problem/question (optional for general aptitude).
 * @param {string} options.category - Topic/Category name.
 * @param {string} options.difficulty - Difficulty level (Easy, Medium, Hard).
 * @param {boolean} options.isDailyChallenge - Whether this submission fulfills a daily challenge.
 * @param {number} options.score - Score attained (for aptitude).
 * @returns {Object} - Results of the update (coinsAwarded, streak).
 */
const updateUserStats = async (user, options) => {
    const { type, problemId, category, difficulty, isDailyChallenge, score } = options;
    const today = new Date().toISOString().split('T')[0];

    // 1. Update Activity Log
    const activityIndex = user.activityLog.findIndex(log => log.date === today);
    if (activityIndex > -1) {
        user.activityLog[activityIndex].count += 1;
    } else {
        user.activityLog.push({ date: today, count: 1 });
    }

    // 2. Update Streak
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toISOString().split('T')[0] : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If active yesterday, increment streak
    if (lastActive === yesterdayStr) {
        user.streak += 1;
    }
    // If not active today and not active yesterday, reset streak
    else if (lastActive !== today) {
        user.streak = 1;
    }
    // If lastActive === today, streak stays the same

    user.lastActiveDate = new Date();

    // 3. Award Coins
    let coinsAwarded = 0;

    // Check if this specific problem has been solved by the user before (Accepted for coding)
    const isFirstTime = !user.solvedProblems.some(p =>
        p.problemId && problemId && p.problemId.toString() === problemId.toString() && p.type === type
    );

    if (type === 'coding') {
        if (isFirstTime) coinsAwarded += 10; // Base award
        if (isDailyChallenge) coinsAwarded += 20; // Daily challenge bonus (Total 30 if first times)
    } else if (type === 'aptitude') {
        // For aptitude, we award based on score
        coinsAwarded += (score || 0) * 2;
        if (isDailyChallenge) coinsAwarded += 15; // Daily challenge bonus
    }

    user.coins = (user.coins || 0) + coinsAwarded;

    // 4. Update Solved Problems Progress
    // Only add a new entry for coding if it's the first time
    if (type === 'coding') {
        if (isFirstTime) {
            user.solvedProblems.push({
                problemId,
                type: 'coding',
                topic: category || 'General',
                difficulty: difficulty || 'Medium',
                solvedAt: new Date()
            });
        }
    } else {
        // For aptitude, we record every attempt for progress tracking
        user.solvedProblems.push({
            problemId: problemId || null,
            type: 'aptitude',
            topic: category || 'Aptitude',
            difficulty: difficulty || 'medium',
            score: score || 0,
            solvedAt: new Date()
        });
    }

    await user.save();
    return { coinsAwarded, streak: user.streak, totalCoins: user.coins };
};

module.exports = { updateUserStats };
