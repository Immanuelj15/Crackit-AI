const express = require('express');
const router = express.Router();
const {
    unlockEditorial,
    getLeaderboard,
    getDailyChallenge
} = require('../controllers/gamificationController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/unlock-editorial', protect, unlockEditorial);
router.get('/leaderboard', getLeaderboard);
router.get('/daily-challenge', getDailyChallenge);

module.exports = router;
