const express = require('express');
const router = express.Router();
const { getInterviewQuestions, getInterviewQuestionById } = require('../controllers/interviewController');

router.route('/').get(getInterviewQuestions);
router.route('/:id').get(getInterviewQuestionById);

module.exports = router;
