const express = require('express');
const router = express.Router();
const { getQuestions, createQuestion, submitAptitudeResult } = require('../controllers/questionController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getQuestions).post(protect, admin, createQuestion);
router.post('/submit-aptitude', protect, submitAptitudeResult);

module.exports = router;
