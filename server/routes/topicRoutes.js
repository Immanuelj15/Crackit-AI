const express = require('express');
const router = express.Router();
const { getTopics, getTopicDetails, submitTestResult, getOverallStats } = require('../controllers/topicController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/stats', protect, getOverallStats);
router.get('/', protect, getTopics);
router.get('/:id', protect, getTopicDetails);
router.post('/result', protect, submitTestResult);

module.exports = router;
