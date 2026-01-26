const express = require('express');
const router = express.Router();
const { getQuestions, createQuestion } = require('../controllers/questionController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getQuestions).post(protect, admin, createQuestion);

module.exports = router;
