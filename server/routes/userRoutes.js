const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { updateStreak, getStreak } = require('../controllers/userController');

router.post('/streak', protect, updateStreak);
router.get('/streak', protect, getStreak);

module.exports = router;
